"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { IIngredient, IIngredientPayload } from "../../types/ingredients.type";

const ingredientSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  price: z.number().min(0, "Precio debe ser positivo"),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

interface IngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingIngredient: IIngredient | null;
  onSave: (data: IIngredientPayload) => void;
}

const IngredientForm = ({ isOpen, onClose, editingIngredient, onSave }: IngredientFormProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: editingIngredient?.name || "",
      price: editingIngredient?.price || 0,
    }
  });

  const onSubmit = (data: IngredientFormData) => {
    onSave(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {editingIngredient ? "Editar Ingrediente" : "Nuevo Ingrediente"}
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

export default IngredientForm;