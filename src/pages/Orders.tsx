
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";

const Orders = () => {
  const { orders, products, addOrder, updateOrderStatus, deleteOrder } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState<{
    customerName: string;
    deliveryAddress: string;
    items: OrderItem[];
  }>({
    customerName: user?.name || "",
    deliveryAddress: user?.address || "",
    items: []
  });
  const [newItem, setNewItem] = useState<{
    productId: number;
    quantity: number;
  }>({
    productId: 0,
    quantity: 1
  });

  // Filter orders based on user role and search query
  const filteredOrders = orders.filter((order) => {
    // Role-based filtering
    if (user?.role === "cliente") {
      // Clients can only see their own orders
      return order.userId === user.id && 
        (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         order.id.toString().includes(searchQuery));
    } else if (user?.role === "domiciliario") {
      // Delivery staff see orders that are being shipped
      return order.status === "enviado" && 
        (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         order.id.toString().includes(searchQuery));
    } else {
      // Admin, office staff and warehouse can see all orders
      return order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery);
    }
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  const openAddDialog = () => {
    setNewOrder({
      customerName: user?.name || "",
      deliveryAddress: user?.address || "",
      items: []
    });
    setIsDialogOpen(true);
  };

  const viewOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleAddItem = () => {
    if (newItem.productId === 0 || newItem.quantity <= 0) return;

    const selectedProduct = products.find(p => p.id === newItem.productId);
    if (!selectedProduct) return;

    // Check if item already exists
    const existingItemIndex = newOrder.items.findIndex(
      item => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...newOrder.items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      updatedItems[existingItemIndex].totalPrice = 
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
      
      setNewOrder({
        ...newOrder,
        items: updatedItems
      });
    } else {
      // Add new item
      const newOrderItem: OrderItem = {
        id: Date.now(), // Temporary ID
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: newItem.quantity,
        unitPrice: selectedProduct.price,
        totalPrice: selectedProduct.price * newItem.quantity
      };
      
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, newOrderItem]
      });
    }

    // Reset form
    setNewItem({
      productId: 0,
      quantity: 1
    });
  };

  const removeItem = (itemId: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter(item => item.id !== itemId)
    });
  };

  const calculateTotal = () => {
    return newOrder.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSaveOrder = () => {
    if (!newOrder.customerName || !newOrder.deliveryAddress || newOrder.items.length === 0) {
      return; // Validation failed
    }

    addOrder({
      userId: user?.id || 0,
      customerName: newOrder.customerName,
      status: "pendiente",
      deliveryAddress: newOrder.deliveryAddress,
      items: newOrder.items,
      total: calculateTotal()
    });

    setIsDialogOpen(false);
  };

  const handleStatusChange = (orderId: number, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
  };

  const confirmDelete = (orderId: number) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      deleteOrder(orderId);
    }
  };

  // Determine which status options to show based on user role and current status
  const getStatusOptions = (currentStatus: Order["status"]) => {
    if (user?.role === "admin" || user?.role === "oficinista") {
      // Admin and office staff can set any status
      return [
        { value: "pendiente", label: "Pendiente" },
        { value: "en preparación", label: "En preparación" },
        { value: "enviado", label: "Enviado" },
        { value: "entregado", label: "Entregado" }
      ];
    } else if (user?.role === "bodeguero") {
      // Warehouse staff can move from pending to in preparation
      if (currentStatus === "pendiente") {
        return [
          { value: "pendiente", label: "Pendiente" },
          { value: "en preparación", label: "En preparación" }
        ];
      } else if (currentStatus === "en preparación") {
        return [
          { value: "en preparación", label: "En preparación" },
          { value: "enviado", label: "Enviado" }
        ];
      }
    } else if (user?.role === "domiciliario") {
      // Delivery staff can only mark as delivered
      if (currentStatus === "enviado") {
        return [
          { value: "enviado", label: "Enviado" },
          { value: "entregado", label: "Entregado" }
        ];
      }
    }
    
    // Default: can only see current status
    return [
      { value: currentStatus, label: currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1) }
    ];
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
          {(user?.role === "admin" || user?.role === "oficinista" || user?.role === "cliente") && (
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pedido
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar pedidos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left"># Pedido</th>
                  <th className="py-3 px-4 text-left">Cliente</th>
                  <th className="py-3 px-4 text-left">Fecha</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{formatDate(order.date)}</td>
                    <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {(user?.role === "admin" || user?.role === "oficinista" || 
                        user?.role === "bodeguero" || user?.role === "domiciliario") ? (
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={order.status} />
                          </SelectTrigger>
                          <SelectContent>
                            {getStatusOptions(order.status).map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`badge ${
                          order.status === 'entregado' ? 'badge-success' : 
                          order.status === 'enviado' ? 'badge-warning' : 
                          'badge-danger'
                        }`}>
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(user?.role === "admin" || user?.role === "oficinista") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDelete(order.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      <div className="flex flex-col items-center">
                        <ShoppingCart className="h-10 w-10 text-muted" />
                        <p className="mt-2">No se encontraron pedidos</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nuevo Pedido</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right">
                Cliente
              </Label>
              <Input
                id="customerName"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                className="col-span-3"
                readOnly={user?.role === "cliente"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliveryAddress" className="text-right">
                Dirección de Entrega
              </Label>
              <Input
                id="deliveryAddress"
                value={newOrder.deliveryAddress}
                onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-2">Agregar Productos</h3>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="col-span-3">
                  <Select
                    value={newItem.productId.toString()}
                    onValueChange={(value) => setNewItem({ ...newItem, productId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Cantidad"
                  />
                </div>
                <div className="col-span-2">
                  <Button onClick={handleAddItem} className="w-full">
                    Agregar
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-2 px-3 text-left">Producto</th>
                      <th className="py-2 px-3 text-right">Precio Unit.</th>
                      <th className="py-2 px-3 text-right">Cantidad</th>
                      <th className="py-2 px-3 text-right">Total</th>
                      <th className="py-2 px-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newOrder.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-3">{item.productName}</td>
                        <td className="py-2 px-3 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right">{item.quantity}</td>
                        <td className="py-2 px-3 text-right">${item.totalPrice.toFixed(2)}</td>
                        <td className="py-2 px-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {newOrder.items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">
                          No hay productos seleccionados
                        </td>
                      </tr>
                    )}
                    
                    {newOrder.items.length > 0 && (
                      <tr className="font-medium">
                        <td colSpan={3} className="py-2 px-3 text-right">
                          Total:
                        </td>
                        <td className="py-2 px-3 text-right">
                          ${calculateTotal().toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveOrder} disabled={newOrder.items.length === 0}>
              Crear Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido #{currentOrder?.id}</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Información del Cliente</h3>
                  <p><strong>Nombre:</strong> {currentOrder.customerName}</p>
                  <p><strong>Dirección:</strong> {currentOrder.deliveryAddress}</p>
                </div>
                <div>
                  <h3 className="font-medium">Información del Pedido</h3>
                  <p><strong>Fecha:</strong> {formatDate(currentOrder.date)}</p>
                  <p><strong>Estado:</strong> {currentOrder.status}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Productos</h3>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-2 px-3 text-left">Producto</th>
                        <th className="py-2 px-3 text-right">Precio Unit.</th>
                        <th className="py-2 px-3 text-right">Cantidad</th>
                        <th className="py-2 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrder.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2 px-3">{item.productName}</td>
                          <td className="py-2 px-3 text-right">${item.unitPrice.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right">{item.quantity}</td>
                          <td className="py-2 px-3 text-right">${item.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                      
                      <tr className="font-medium">
                        <td colSpan={3} className="py-2 px-3 text-right">
                          Total:
                        </td>
                        <td className="py-2 px-3 text-right">
                          ${currentOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Orders;
