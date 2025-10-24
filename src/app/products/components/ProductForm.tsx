"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { IProduct, IProductPayload, IProductDetail, IRecipeIngredient } from "../../types/products.type";
import { ICategory } from "../../types/categories.type";
import { IIngredient } from "../../types/ingredients.type";
import { getProductDetailById } from "../../services/products.service";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: IProduct | null;
  categories: ICategory[];
  ingredients: IIngredient[];
  onSave: (data: IProductPayload) => void;
}

const ProductForm = ({ isOpen, onClose, editingProduct, categories, ingredients, onSave }: ProductFormProps) => {
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [editableProductDetail, setEditableProductDetail] = useState<IProductDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct && editingProduct.id) {
      setLoadingDetail(true);
      setDetailError(null);
      getProductDetailById(editingProduct.id)
        .then((detail) => {
          setEditableProductDetail(detail);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          setDetailError("Failed to load product details");
        })
        .finally(() => setLoadingDetail(false));
    } else {
      setEditableProductDetail(null);
      setDetailError(null);
    }
  }, [editingProduct?.id]);

  useEffect(() => {
    if (isOpen && !editingProduct) {
      setEditableProductDetail({
        id: 0,
        name: '',
        preTaxPrice: '0',
        price: '0',
        categoryId: 0,
        recipeId: 0,
        createdAt: '',
        updatedAt: '',
        category: { id: 0, name: '' },
        recipe: { id: 0, cost: 0, ingredients: [] }
      });
    }
  }, [isOpen, editingProduct]);

  const onSubmit = async () => {
    if (!editableProductDetail) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload: IProductPayload = {
        name: editableProductDetail.name,
        preTaxPrice: parseFloat(editableProductDetail.preTaxPrice),
        price: parseFloat(editableProductDetail.price),
        category: editableProductDetail.categoryId,
        ingredients: editableProductDetail.recipe.ingredients.map(ing => ({
          id: ing.ingredient.id,
          quantity: parseInt(ing.quantity)
        }))
      };
      onSave(payload);
      setEditableProductDetail(null);
      onClose();
    } catch {
      setSaveError("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const addIngredient = (ingredientId: number) => {
    if (!editableProductDetail) return;
    const ingredient = ingredients.find(i => String(i.id) === ingredientId.toString());
    if (!ingredient) return;
    const newIngredient: IRecipeIngredient = {
      id: ingredientId,
      quantity: "1",
      ingredient: {
        id: ingredientId,
        name: ingredient.name,
        stock: ingredient.stock
      }
    };
    setEditableProductDetail({
      ...editableProductDetail,
      recipe: {
        ...editableProductDetail.recipe,
        ingredients: [...editableProductDetail.recipe.ingredients, newIngredient]
      }
    });
  };

  const removeIngredient = (ingredientId: number) => {
    if (!editableProductDetail) return;
    setEditableProductDetail({
      ...editableProductDetail,
      recipe: {
        ...editableProductDetail.recipe,
        ingredients: editableProductDetail.recipe.ingredients.filter(ing => ing.id !== ingredientId)
      }
    });
  };

  const updateQuantity = (ingredientId: number, quantity: string) => {
    if (!editableProductDetail) return;
    setEditableProductDetail({
      ...editableProductDetail,
      recipe: {
        ...editableProductDetail.recipe,
        ingredients: editableProductDetail.recipe.ingredients.map(ing =>
          ing.id === ingredientId ? { ...ing, quantity } : ing
        )
      }
    });
  };

  const hasIngredient = (ing: IIngredient) =>
    !editableProductDetail?.recipe.ingredients.some(sel => sel.ingredient.id.toString() === ing.id.toString())

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="opaque">
      <ModalContent style={{ background: 'linear-gradient(to right, rgba(242, 220, 230, 1) 0%, rgba(245, 225, 220, 1) 50%, rgba(250, 235, 210, 1) 70%, rgba(255, 240, 205, 1) 90%, rgba(255, 245, 210, 1) 100%)' }}>
        <ModalHeader>
          {editingProduct ? "Editar Producto" : "Nuevo Producto"}
        </ModalHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <ModalBody className="space-y-4">
            {loadingDetail && (
              <div className="flex justify-center">
                <Spinner size="lg" />
                <p className="ml-2">Cargando detalles del producto...</p>
              </div>
            )}
            {detailError && (
              <p className="text-red-500 text-sm">{detailError}</p>
            )}
            <div className="flex justify-between gap-2">
              <Input
                value={editableProductDetail?.name || ''}
                onChange={(e) => setEditableProductDetail(prev => prev ? { ...prev, name: e.target.value } : null)}
                label="Nombre"
              />
              <Select
                label="Categoría"
                selectedKeys={[editableProductDetail?.categoryId.toString() || '']}
                onSelectionChange={(keys) => setEditableProductDetail(prev => prev ? { ...prev, categoryId: parseInt(Array.from(keys)[0] as string) } : null)}
              >
                {categories.map((category) => (
                  <SelectItem key={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex justify-between gap-2">
              <Input
                type="number"
                value={editableProductDetail?.preTaxPrice || ''}
                onChange={(e) => setEditableProductDetail(prev => prev ? { ...prev, preTaxPrice: e.target.value } : null)}
                label="Precio sin Impuestos"
              />
              <Input
                type="number"
                value={editableProductDetail?.price || ''}
                onChange={(e) => setEditableProductDetail(prev => prev ? { ...prev, price: e.target.value } : null)}
                label="Precio"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-gray-600 mb-2">Ingredientes</label>
              {editableProductDetail?.recipe.ingredients.length ? (
                <Table aria-label="Ingredientes seleccionados">
                  <TableHeader>
                    <TableColumn>Cantidad</TableColumn>
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Stock</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {editableProductDetail.recipe.ingredients.map((ing) => (
                      <TableRow key={ing.id}>
                        <TableCell>
                          <Input
                            type="number"
                            value={ing.quantity}
                            onChange={(e) => updateQuantity(ing.id, e.target.value)}
                            min="1"
                          />
                        </TableCell>
                        <TableCell>{ing.ingredient.name}</TableCell>
                        <TableCell>{ing.ingredient.stock}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => removeIngredient(ing.id)}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">No hay ingredientes seleccionados</p>
              )}
              <div className="flex gap-2 items-end">
                <Select
                  label="Seleccionar Ingrediente"
                  placeholder="Elige un ingrediente"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) addIngredient(parseInt(selected));
                  }}
                >
                  {ingredients
                    .filter(hasIngredient)
                    .map((ingredient) => (
                      <SelectItem key={ingredient.id.toString()}>
                        {ingredient.name}
                      </SelectItem>
                    ))}
                </Select>
                <Button
                  color="primary"
                  onPress={() => {}}
                >
                  Agregar
                </Button>
              </div>
              {editingProduct && editableProductDetail && (
                <div className="flex justify-end mt-2">
                  <div className="flex flex-col items-end">
                    <label className="text-gray-600">Costo Total</label>
                    <p className="text-gray-800">${editableProductDetail.recipe.cost}</p>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" /> : "Guardar"}
            </Button>
          </ModalFooter>
          {saveError && (
            <div className="px-4 pb-4">
              <p className="text-red-500 text-sm">{saveError}</p>
            </div>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ProductForm;
