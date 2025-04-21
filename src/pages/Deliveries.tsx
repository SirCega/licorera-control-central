
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Order } from "@/types";
import { Truck, Eye } from "lucide-react";
import { format } from "date-fns";

const Deliveries = () => {
  const { orders, updateOrderStatus } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter orders that are in delivery status
  const filteredOrders = orders.filter(
    (order) =>
      order.status === "enviado" &&
      (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.id.toString().includes(searchQuery) ||
       order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  const handleViewOrder = (order: Order) => {
    setViewOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: number, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
    if (viewOrder && viewOrder.id === orderId) {
      setViewOrder({ ...viewOrder, status });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestión de Envíos</h1>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar envíos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card-dashboard">
            <h3 className="font-bold mb-2">Pedidos Pendientes</h3>
            <p className="text-sm text-muted-foreground mb-2">Para entregar</p>
            <div className="text-3xl font-bold">
              {orders.filter(o => o.status === "enviado").length}
            </div>
          </div>

          <div className="card-dashboard">
            <h3 className="font-bold mb-2">Pedidos Entregados</h3>
            <p className="text-sm text-muted-foreground mb-2">Completados</p>
            <div className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === "entregado").length}
            </div>
          </div>

          <div className="card-dashboard">
            <h3 className="font-bold mb-2">Tasa de Entrega</h3>
            <p className="text-sm text-muted-foreground mb-2">Efectividad</p>
            <div className="text-3xl font-bold">
              {orders.length > 0 
                ? `${((orders.filter(o => o.status === "entregado").length / 
                      (orders.filter(o => o.status === "entregado").length + 
                       orders.filter(o => o.status === "enviado").length)) * 100).toFixed(0)}%` 
                : "0%"}
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left"># Pedido</th>
                  <th className="py-3 px-4 text-left">Cliente</th>
                  <th className="py-3 px-4 text-left">Dirección</th>
                  <th className="py-3 px-4 text-left">Fecha</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">
                      {order.deliveryAddress.length > 30
                        ? `${order.deliveryAddress.substring(0, 30)}...`
                        : order.deliveryAddress}
                    </td>
                    <td className="py-3 px-4">{formatDate(order.date)}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-warning">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, "entregado")}
                          className="text-green-600"
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Entregar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      <div className="flex flex-col items-center">
                        <Truck className="h-10 w-10 text-muted" />
                        <p className="mt-2">No hay pedidos para entregar</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido #{viewOrder?.id}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Información del Cliente</h3>
                  <p><strong>Nombre:</strong> {viewOrder.customerName}</p>
                  <p><strong>Dirección:</strong> {viewOrder.deliveryAddress}</p>
                </div>
                <div>
                  <h3 className="font-medium">Información del Pedido</h3>
                  <p><strong>Fecha:</strong> {formatDate(viewOrder.date)}</p>
                  <p><strong>Estado:</strong> {viewOrder.status}</p>
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
                      {viewOrder.items.map((item) => (
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
                          ${viewOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <h3 className="font-medium text-amber-800">Instrucciones para el Domiciliario</h3>
                <ul className="mt-2 space-y-2 text-sm text-amber-700">
                  <li>1. Confirma la identidad del cliente antes de entregar.</li>
                  <li>2. Verifica que todos los productos estén en buen estado.</li>
                  <li>3. Marca el pedido como entregado solo cuando el cliente haya recibido.</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Cancelar
            </Button>
            {viewOrder && (
              <Button 
                onClick={() => {
                  handleUpdateStatus(viewOrder.id, "entregado");
                  setIsViewDialogOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Truck className="h-4 w-4 mr-2" />
                Confirmar Entrega
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Deliveries;
