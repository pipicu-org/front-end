"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@heroui/react";
import { IProduct, IProductPayload } from "../../types/products.type";
import { ICategory } from "../../types/categories.type";
import { IIngredient } from "../../types/ingredients.type";

const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  preTaxPrice: z.number().min(0, "Precio sin impuestos debe ser positivo"),
  price: z.number().min(0, "Precio debe ser positivo"),
  category: z.number().min(1, "Categoría requerida"),
  ingredients: z.array(z.object({
    id: z.number(),
    quantity: z.number().min(1, "Cantidad mínima 1")
  })).min(1, "Al menos un ingrediente")
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: IProduct | null;
  categories: ICategory[];
  ingredients: IIngredient[];
  onSave: (data: IProductPayload) => void;
}

const ProductForm = ({ isOpen, onClose, editingProduct, categories, ingredients, onSave }: ProductFormProps) => {
  const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      preTaxPrice: 0,
      price: 0,
      category: 0,
      ingredients: []
    }
  });

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        preTaxPrice: parseFloat(editingProduct.preTaxPrice),
        price: parseFloat(editingProduct.price),
        category: typeof editingProduct.category === 'number' ? editingProduct.category : categories.find(c => c.name === editingProduct.category)?.id || 0,
        ingredients: editingProduct.ingredients || []
      });
    } else {
      reset({
        name: "",
        preTaxPrice: 0,
        price: 0,
        category: 0,
        ingredients: []
      });
    }
  }, [editingProduct, categories, reset]);

  const selectedIngredients = watch("ingredients");

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    onSave(data);
    reset();
  };

  const addIngredient = (ingredientId: number) => {
    const existing = selectedIngredients.find(ing => ing.id === ingredientId);
    if (!existing) {
      setValue("ingredients", [...selectedIngredients, { id: ingredientId, quantity: 1 }]);
    }
  };

  const removeIngredient = (ingredientId: number) => {
    setValue("ingredients", selectedIngredients.filter(ing => ing.id !== ingredientId));
  };

  const updateQuantity = (ingredientId: number, quantity: number) => {
    setValue("ingredients", selectedIngredients.map(ing =>
      ing.id === ingredientId ? { ...ing, quantity } : ing
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          {editingProduct ? "Editar Producto" : "Nuevo Producto"}
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre"
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                />
              )}
            />

            <Controller
              name="preTaxPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Precio sin Impuestos"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  errorMessage={errors.preTaxPrice?.message}
                  isInvalid={!!errors.preTaxPrice}
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Precio"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  errorMessage={errors.price?.message}
                  isInvalid={!!errors.price}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  label="Categoría"
                  selectedKeys={field.value ? [field.value.toString()] : []}
                  onSelectionChange={(keys) => field.onChange(parseInt(Array.from(keys)[0] as string))}
                  errorMessage={errors.category?.message}
                  isInvalid={!!errors.category}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Ingredientes</label>
              <div className="space-y-2">
                {selectedIngredients.map((ing) => {
                  const ingredient = ingredients.find(i => String(i.id) === String(ing.id));
                  return (
                    <div key={ing.id} className="flex items-center space-x-2">
                      <span className="flex-1">{ingredient?.name}</span>
                      <Input
                        type="number"
                        value={ing.quantity.toString()}
                        onChange={(e) => updateQuantity(ing.id, parseInt(e.target.value) || 1)}
                        className="w-20"
                        min="1"
                      />
                      <Button size="sm" color="danger" onPress={() => removeIngredient(ing.id)}>
                        Quitar
                      </Button>
                    </div>
                  );
                })}
              </div>
              <Select
                label="Agregar Ingrediente"
                onSelectionChange={(keys) => {
                  const id = parseInt(Array.from(keys)[0] as string);
                  if (id) addIngredient(id);
                }}
                className="mt-2"
              >
                {ingredients
                  .filter(ing => !selectedIngredients.some(sel => String(sel.id) === String(ing.id)))
                  .map((ingredient) => (
                    <SelectItem key={ingredient.id.toString()}>
                      {ingredient.name}
                    </SelectItem>
                  ))}
              </Select>
              {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients.message}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ProductForm;