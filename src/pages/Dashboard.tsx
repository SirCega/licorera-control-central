
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { getDashboardStats, orders } = useData();
  const { user } = useAuth();
  const stats = getDashboardStats();

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Total en inventario
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Por entregar o preparar
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Desde el inicio
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Productos Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Requieren reposición
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>{formatDate(order.date)}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${
                            order.status === 'entregado' ? 'badge-success' : 
                            order.status === 'enviado' ? 'badge-warning' : 
                            'badge-danger'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stats.recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4">No hay pedidos recientes</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad Vendida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((product) => (
                      <tr key={product.productId}>
                        <td>{product.productName}</td>
                        <td>{product.soldQuantity} unidades</td>
                      </tr>
                    ))}
                    {stats.topProducts.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-center py-4">No hay datos de ventas</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
