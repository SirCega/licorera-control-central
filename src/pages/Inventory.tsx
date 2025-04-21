
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryMovement } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const Inventory = () => {
  const { products, inventoryMovements, addInventoryMovement } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMovement, setNewMovement] = useState<{
    productId: number;
    type: "entrada" | "salida";
    quantity: number;
    note: string;
  }>({
    productId: 0,
    type: "entrada",
    quantity: 1,
    note: ""
  });

  const filteredMovements = inventoryMovements.filter(
    (movement) =>
      movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.note?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  };

  const openAddDialog = () => {
    setNewMovement({
      productId: 0,
      type: "entrada",
      quantity: 1,
      note: ""
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "quantity") {
      setNewMovement({
        ...newMovement,
        quantity: parseInt(value) || 0
      });
    } else {
      setNewMovement({
        ...newMovement,
        [name]: value
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "productId") {
      setNewMovement({
        ...newMovement,
        productId: parseInt(value)
      });
    } else if (name === "type") {
      setNewMovement({
        ...newMovement,
        type: value as "entrada" | "salida"
      });
    }
  };

  const handleSave = () => {
    if (newMovement.productId === 0 || newMovement.quantity <= 0) {
      return; // Validation failed
    }

    const product = products.find(p => p.id === newMovement.productId);
    if (!product) return;

    // Check if there's enough stock for outgoing movements
    if (newMovement.type === "salida" && product.totalUnits < newMovement.quantity) {
      alert(`No hay suficiente stock. Stock actual: ${product.totalUnits} unidades.`);
      return;
    }

    addInventoryMovement({
      productId: newMovement.productId,
      productName: product.name,
      type: newMovement.type,
      quantity: newMovement.quantity,
      note: newMovement.note,
      userId: user?.id || 0,
      userName: user?.name || "Sistema"
    });

    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Control de Inventario</h1>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Movimiento
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar movimientos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Products summary */}
          <div className="card-dashboard">
            <h3 className="font-bold mb-2">Resumen de Inventario</h3>
            <p className="text-sm text-muted-foreground mb-4">Productos en el sistema</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted rounded-md p-3">
                <p className="text-xs text-muted-foreground">Total Productos</p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
              <div className="bg-muted rounded-md p-3">
                <p className="text-xs text-muted-foreground">Categorías</p>
                <p className="text-xl font-bold">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>

          {/* Stock movement summary */}
          <div className="card-dashboard">
            <h3 className="font-bold mb-2">Movimientos Recientes</h3>
            <p className="text-sm text-muted-foreground mb-4">Últimos 30 días</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 rounded-md p-3">
                <p className="text-xs text-green-600">Entradas</p>
                <p className="text-xl font-bold text-green-700">
                  {inventoryMovements.filter(
                    m => m.type === "entrada" && 
                    new Date(m.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <div className="bg-amber-50 rounded-md p-3">
                <p className="text-xs text-amber-600">Salidas</p>
                <p className="text-xl font-bold text-amber-700">
                  {inventoryMovements.filter(
                    m => m.type === "salida" && 
                    new Date(m.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
            </div>
          </div>

          {/* Low stock alert */}
          <div className="card-dashboard bg-amber-50">
            <h3 className="font-bold mb-2">Alertas de Stock</h3>
            <p className="text-sm text-amber-600 mb-4">Productos con stock bajo</p>
            <div className="bg-white rounded-md p-3 border border-amber-200">
              <p className="text-xs text-amber-600">Requieren reposición</p>
              <p className="text-xl font-bold text-amber-700">
                {products.filter(p => p.totalUnits < 50).length}
              </p>
            </div>
            <div className="mt-2">
              <ul className="text-xs text-amber-700 space-y-1">
                {products.filter(p => p.totalUnits < 50).slice(0, 3).map(p => (
                  <li key={p.id} className="flex justify-between">
                    <span>{p.name}</span>
                    <span>{p.totalUnits} unidades</span>
                  </li>
                ))}
                {products.filter(p => p.totalUnits < 50).length > 3 && (
                  <li className="text-center italic">Y más productos...</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-medium mb-4">Historial de Movimientos</h2>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left">Fecha</th>
                  <th className="py-3 px-4 text-left">Producto</th>
                  <th className="py-3 px-4 text-left">Tipo</th>
                  <th className="py-3 px-4 text-left">Cantidad</th>
                  <th className="py-3 px-4 text-left">Responsable</th>
                  <th className="py-3 px-4 text-left">Nota</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="border-b">
                    <td className="py-3 px-4">{formatDate(movement.date)}</td>
                    <td className="py-3 px-4">{movement.productName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {movement.type === "entrada" ? (
                          <>
                            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                            <span className="text-green-600">Entrada</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 mr-1 text-amber-500" />
                            <span className="text-amber-600">Salida</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{movement.quantity}</td>
                    <td className="py-3 px-4">{movement.userName}</td>
                    <td className="py-3 px-4">{movement.note}</td>
                  </tr>
                ))}

                {filteredMovements.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      <div className="flex flex-col items-center">
                        <ClipboardList className="h-10 w-10 text-muted" />
                        <p className="mt-2">No se encontraron movimientos</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Movement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Producto
              </Label>
              <div className="col-span-3">
                <Select
                  value={newMovement.productId.toString()}
                  onValueChange={(value) => handleSelectChange("productId", value)}
                >
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} ({product.totalUnits} unidades)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo de Movimiento
              </Label>
              <div className="col-span-3">
                <Select
                  value={newMovement.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={newMovement.quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Nota
              </Label>
              <Input
                id="note"
                name="note"
                value={newMovement.note}
                onChange={handleInputChange}
                placeholder="Descripción del movimiento"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
