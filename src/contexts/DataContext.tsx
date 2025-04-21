
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  Product, 
  Order, 
  InventoryMovement, 
  DashboardStats, 
  User 
} from "@/types";
import { 
  products as initialProducts, 
  orders as initialOrders, 
  inventoryMovements as initialInventoryMovements 
} from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  // Products
  products: Product[];
  getProduct: (id: number) => Product | undefined;
  addProduct: (product: Omit<Product, "id" | "totalUnits">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  
  // Orders
  orders: Order[];
  getOrder: (id: number) => Order | undefined;
  addOrder: (order: Omit<Order, "id" | "date">) => void;
  updateOrderStatus: (id: number, status: Order["status"]) => void;
  deleteOrder: (id: number) => void;
  
  // Inventory movements
  inventoryMovements: InventoryMovement[];
  addInventoryMovement: (movement: Omit<InventoryMovement, "id" | "date">) => void;
  
  // Dashboard statistics
  getDashboardStats: () => DashboardStats;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(initialInventoryMovements);
  const { toast } = useToast();

  // Load data from localStorage if available
  useEffect(() => {
    const storedProducts = localStorage.getItem("licorera-products");
    const storedOrders = localStorage.getItem("licorera-orders");
    const storedMovements = localStorage.getItem("licorera-inventory-movements");

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedMovements) setInventoryMovements(JSON.parse(storedMovements));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("licorera-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("licorera-orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("licorera-inventory-movements", JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);

  // Product methods
  const getProduct = (id: number) => {
    return products.find(p => p.id === id);
  };

  const addProduct = (product: Omit<Product, "id" | "totalUnits">) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const totalUnits = product.boxQuantity * product.unitsPerBox;
    
    const newProduct: Product = {
      ...product,
      id: newId,
      totalUnits
    };
    
    setProducts([...products, newProduct]);
    
    toast({
      title: "Producto agregado",
      description: `${newProduct.name} ha sido agregado al inventario.`
    });
  };

  const updateProduct = (product: Product) => {
    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...product, totalUnits: product.boxQuantity * product.unitsPerBox } : p
    );
    
    setProducts(updatedProducts);
    
    toast({
      title: "Producto actualizado",
      description: `${product.name} ha sido actualizado.`
    });
  };

  const deleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;
    
    setProducts(products.filter(p => p.id !== id));
    
    toast({
      title: "Producto eliminado",
      description: `${productToDelete.name} ha sido eliminado del inventario.`
    });
  };

  // Order methods
  const getOrder = (id: number) => {
    return orders.find(o => o.id === id);
  };

  const addOrder = (order: Omit<Order, "id" | "date">) => {
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    
    const newOrder: Order = {
      ...order,
      id: newId,
      date: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);
    
    // Update inventory
    order.items.forEach(item => {
      const newMovement: Omit<InventoryMovement, "id" | "date"> = {
        productId: item.productId,
        productName: item.productName,
        type: "salida",
        quantity: item.quantity,
        note: `Pedido #${newId}`,
        userId: order.userId,
        userName: order.customerName
      };
      
      addInventoryMovement(newMovement);
    });
    
    toast({
      title: "Pedido creado",
      description: `El pedido #${newId} ha sido creado exitosamente.`
    });
  };

  const updateOrderStatus = (id: number, status: Order["status"]) => {
    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status } : o
    );
    
    setOrders(updatedOrders);
    
    toast({
      title: "Estado actualizado",
      description: `El pedido #${id} ahora está ${status}.`
    });
  };

  const deleteOrder = (id: number) => {
    setOrders(orders.filter(o => o.id !== id));
    
    toast({
      title: "Pedido eliminado",
      description: `El pedido #${id} ha sido eliminado.`
    });
  };

  // Inventory movement methods
  const addInventoryMovement = (movement: Omit<InventoryMovement, "id" | "date">) => {
    const newId = inventoryMovements.length > 0 
      ? Math.max(...inventoryMovements.map(m => m.id)) + 1 
      : 1;
    
    const newMovement: InventoryMovement = {
      ...movement,
      id: newId,
      date: new Date().toISOString()
    };
    
    setInventoryMovements([...inventoryMovements, newMovement]);
    
    // Update product stock
    const product = products.find(p => p.id === movement.productId);
    if (product) {
      const updatedUnits = movement.type === "entrada" 
        ? product.totalUnits + movement.quantity 
        : product.totalUnits - movement.quantity;
      
      // Calculate new box quantity (with possible remainder)
      const fullBoxes = Math.floor(updatedUnits / product.unitsPerBox);
      
      updateProduct({
        ...product,
        boxQuantity: fullBoxes,
        totalUnits: updatedUnits
      });
    }
  };

  // Dashboard statistics
  const getDashboardStats = (): DashboardStats => {
    const lowStockThreshold = 50; // Units threshold for low stock alert
    
    // Calculate total sales
    const totalSales = orders
      .filter(o => o.status === "entregado")
      .reduce((sum, order) => sum + order.total, 0);
    
    // Find top selling products
    const productSales: Record<number, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
      });
    });
    
    const topProducts = Object.entries(productSales)
      .map(([productId, soldQuantity]) => {
        const product = products.find(p => p.id === Number(productId));
        return {
          productId: Number(productId),
          productName: product?.name || "Producto desconocido",
          soldQuantity
        };
      })
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5);
    
    return {
      totalProducts: products.length,
      lowStockProducts: products.filter(p => p.totalUnits < lowStockThreshold).length,
      pendingOrders: orders.filter(o => o.status !== "entregado").length,
      totalSales,
      recentOrders: orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
      topProducts
    };
  };

  return (
    <DataContext.Provider value={{
      products,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      
      orders,
      getOrder,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      
      inventoryMovements,
      addInventoryMovement,
      
      getDashboardStats
    }}>
      {children}
    </DataContext.Provider>
  );
};
