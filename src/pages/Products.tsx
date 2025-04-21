
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useData } from "@/contexts/DataContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, Package, AlertTriangle } from "lucide-react";

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    boxQuantity: 0,
    unitsPerBox: 0,
    category: ""
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      boxQuantity: 0,
      unitsPerBox: 0,
      category: ""
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.category) {
      return; // Validation failed
    }

    if (isEditing && currentProduct.id) {
      updateProduct(currentProduct as Product);
    } else {
      addProduct({
        name: currentProduct.name || "",
        description: currentProduct.description || "",
        price: currentProduct.price || 0,
        boxQuantity: currentProduct.boxQuantity || 0,
        unitsPerBox: currentProduct.unitsPerBox || 0,
        category: currentProduct.category || ""
      });
    }

    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price" || name === "boxQuantity" || name === "unitsPerBox") {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseFloat(value) || 0
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value
      });
    }
  };

  const confirmDelete = (productId: number) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      deleteProduct(productId);
    }
  };

  // Stock threshold for low stock warning
  const LOW_STOCK_THRESHOLD = 50;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar productos..."
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
                  <th className="py-3 px-4 text-left">Producto</th>
                  <th className="py-3 px-4 text-left">Categoría</th>
                  <th className="py-3 px-4 text-left">Cajas</th>
                  <th className="py-3 px-4 text-left">Unid./Caja</th>
                  <th className="py-3 px-4 text-left">Total Unid.</th>
                  <th className="py-3 px-4 text-left">Precio</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description.length > 30
                              ? `${product.description.substring(0, 30)}...`
                              : product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">{product.boxQuantity}</td>
                    <td className="py-3 px-4">{product.unitsPerBox}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {product.totalUnits}
                        {product.totalUnits < LOW_STOCK_THRESHOLD && (
                          <AlertTriangle className="h-4 w-4 ml-2 text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="h-10 w-10 text-muted" />
                        <p className="mt-2">No se encontraron productos</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Producto" : "Agregar Producto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Input
                id="category"
                name="category"
                value={currentProduct.category}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={currentProduct.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="boxQuantity" className="text-right">
                Cantidad de Cajas
              </Label>
              <Input
                id="boxQuantity"
                name="boxQuantity"
                type="number"
                min="0"
                value={currentProduct.boxQuantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitsPerBox" className="text-right">
                Unidades por Caja
              </Label>
              <Input
                id="unitsPerBox"
                name="unitsPerBox"
                type="number"
                min="0"
                value={currentProduct.unitsPerBox}
                onChange={handleInputChange}
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

export default Products;
