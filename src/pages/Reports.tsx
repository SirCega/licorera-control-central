
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Reports = () => {
  const { products, orders, inventoryMovements } = useData();
  const [dateFilter, setDateFilter] = useState<"week" | "month" | "year">("month");
  
  // Filter orders by selected date range
  const getFilteredOrders = () => {
    const today = new Date();
    let filterDate = new Date();
    
    if (dateFilter === "week") {
      filterDate.setDate(today.getDate() - 7);
    } else if (dateFilter === "month") {
      filterDate.setMonth(today.getMonth() - 1);
    } else {
      filterDate.setFullYear(today.getFullYear() - 1);
    }
    
    return orders.filter(order => new Date(order.date) >= filterDate);
  };
  
  const filteredOrders = getFilteredOrders();
  
  // Sales by category
  const getSalesByCategory = () => {
    const categoryMap = new Map<string, number>();
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const category = product.category;
          const currentAmount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentAmount + item.totalPrice);
        }
      });
    });
    
    return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
  };
  
  // Sales over time
  const getSalesOverTime = () => {
    const dateFormat = dateFilter === "week" ? "EEE" : dateFilter === "month" ? "dd MMM" : "MMM";
    const salesMap = new Map<string, number>();
    
    filteredOrders.forEach(order => {
      const date = format(new Date(order.date), dateFormat);
      const currentAmount = salesMap.get(date) || 0;
      salesMap.set(date, currentAmount + order.total);
    });
    
    return Array.from(salesMap).map(([date, sales]) => ({ date, sales }));
  };
  
  // Top products
  const getTopProducts = () => {
    const productMap = new Map<number, { name: string, quantity: number }>();
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const currentData = productMap.get(item.productId) || { name: item.productName, quantity: 0 };
        productMap.set(item.productId, {
          name: item.productName,
          quantity: currentData.quantity + item.quantity
        });
      });
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(({name, quantity}) => ({ name, quantity }));
  };
  
  // Inventory movements
  const getInventoryMovements = () => {
    const today = new Date();
    let filterDate = new Date();
    
    if (dateFilter === "week") {
      filterDate.setDate(today.getDate() - 7);
    } else if (dateFilter === "month") {
      filterDate.setMonth(today.getMonth() - 1);
    } else {
      filterDate.setFullYear(today.getFullYear() - 1);
    }
    
    const filteredMovements = inventoryMovements.filter(
      movement => new Date(movement.date) >= filterDate
    );
    
    const entradas = filteredMovements.filter(m => m.type === "entrada").length;
    const salidas = filteredMovements.filter(m => m.type === "salida").length;
    
    return [
      { name: "Entradas", value: entradas },
      { name: "Salidas", value: salidas }
    ];
  };
  
  // Delivery status
  const getDeliveryStatus = () => {
    const statusMap = new Map<string, number>();
    
    filteredOrders.forEach(order => {
      const status = order.status;
      const currentCount = statusMap.get(status) || 0;
      statusMap.set(status, currentCount + 1);
    });
    
    return Array.from(statusMap).map(([name, value]) => ({ name, value }));
  };
  
  // Color schemes for charts
  const COLORS = ['#8884d8', '#9b87f5', '#7E69AB', '#6E59A5', '#553c87'];
  const COLORS_STATUS = {
    'pendiente': '#f97316',
    'en preparación': '#facc15',
    'enviado': '#3b82f6',
    'entregado': '#22c55e'
  };
  
  const pieStatusColors = getDeliveryStatus().map(item => {
    const status = item.name as keyof typeof COLORS_STATUS;
    return COLORS_STATUS[status] || COLORS[0];
  });
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reportes y Análisis</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Período:</span>
            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dateFilter === "week" ? "En los últimos 7 días" : 
                 dateFilter === "month" ? "En los últimos 30 días" : "En el último año"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {dateFilter === "week" ? "En los últimos 7 días" : 
                 dateFilter === "month" ? "En los últimos 30 días" : "En el último año"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${filteredOrders.length > 0 
                  ? (filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length).toFixed(2) 
                  : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                {dateFilter === "week" ? "En los últimos 7 días" : 
                 dateFilter === "month" ? "En los últimos 30 días" : "En el último año"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="delivery">Entregas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Período</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getSalesOverTime()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Ventas']} />
                    <Bar dataKey="sales" fill="#9b87f5" name="Ventas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getSalesByCategory()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getSalesByCategory().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Ventas']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={getTopProducts()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip />
                    <Bar dataKey="quantity" name="Unidades vendidas" fill="#7E69AB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Producto</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Categoría</th>
                        <th className="text-right py-2">Productos</th>
                        <th className="text-right py-2">Stock Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(new Set(products.map(p => p.category))).map(category => {
                        const categoryProducts = products.filter(p => p.category === category);
                        const totalUnits = categoryProducts.reduce((sum, p) => sum + p.totalUnits, 0);
                        
                        return (
                          <tr key={category} className="border-b">
                            <td className="py-2">{category}</td>
                            <td className="text-right py-2">{categoryProducts.length}</td>
                            <td className="text-right py-2">{totalUnits}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Productos Bajos en Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Producto</th>
                        <th className="text-right py-2">Stock</th>
                        <th className="text-right py-2">Mínimo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => p.totalUnits < 50).map(product => (
                        <tr key={product.id} className="border-b">
                          <td className="py-2">{product.name}</td>
                          <td className="text-right py-2">{product.totalUnits}</td>
                          <td className="text-right py-2">50</td>
                        </tr>
                      ))}
                      {products.filter(p => p.totalUnits < 50).length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-muted-foreground">
                            No hay productos con stock bajo
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos de Inventario</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getInventoryMovements()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#f97316" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Movimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Tipo</th>
                      <th className="text-right py-2">Cantidad</th>
                      <th className="text-right py-2">Productos Afectados</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Entradas</td>
                      <td className="text-right py-2">
                        {inventoryMovements.filter(m => m.type === "entrada").length}
                      </td>
                      <td className="text-right py-2">
                        {new Set(inventoryMovements.filter(m => m.type === "entrada").map(m => m.productId)).size}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Salidas</td>
                      <td className="text-right py-2">
                        {inventoryMovements.filter(m => m.type === "salida").length}
                      </td>
                      <td className="text-right py-2">
                        {new Set(inventoryMovements.filter(m => m.type === "salida").map(m => m.productId)).size}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Pedidos</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getDeliveryStatus()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getDeliveryStatus().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieStatusColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Resumen de Pedidos</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Total Pedidos</td>
                          <td className="text-right py-2">{filteredOrders.length}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Pendientes</td>
                          <td className="text-right py-2">
                            {filteredOrders.filter(o => o.status === "pendiente").length}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">En preparación</td>
                          <td className="text-right py-2">
                            {filteredOrders.filter(o => o.status === "en preparación").length}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Enviados</td>
                          <td className="text-right py-2">
                            {filteredOrders.filter(o => o.status === "enviado").length}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Entregados</td>
                          <td className="text-right py-2">
                            {filteredOrders.filter(o => o.status === "entregado").length}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Eficacia de Entrega</h3>
                    <div className="bg-muted rounded-md p-4">
                      <div className="mb-4">
                        <p className="text-sm mb-1">Tasa de Finalización</p>
                        <p className="text-2xl font-bold">
                          {filteredOrders.length > 0 
                            ? `${((filteredOrders.filter(o => o.status === "entregado").length / filteredOrders.length) * 100).toFixed(0)}%` 
                            : "0%"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm mb-1">Tiempo Promedio de Entrega</p>
                        <p className="text-md">
                          ~ 48 horas (dato simulado)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
