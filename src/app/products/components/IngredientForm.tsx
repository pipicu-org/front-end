"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Autocomplete, AutocompleteItem } from "@heroui/react";
import { IIngredient, IIngredientPayload } from "../../types/ingredients.type";
import { getUnits } from "../../services/units.service";
import { IUnit } from "../../types/units.type";

const ingredientSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  unitId: z.number().min(1, "Unidad requerida"),
  lossFactor: z.number().min(0, "Factor de pérdida debe ser positivo"),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

interface IngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingIngredient: IIngredient | null;
  onSave: (data: IIngredientPayload) => void;
}

const IngredientForm = ({ isOpen, onClose, editingIngredient, onSave }: IngredientFormProps) => {
  const [units, setUnits] = useState<IUnit[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await getUnits();
        setUnits(data);
      } catch {
        console.error("Error fetching units");
      }
    };
    if (isOpen) fetchUnits();
  }, [isOpen]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: editingIngredient?.name || "",
      unitId: editingIngredient?.unitId || 1,
      lossFactor: parseFloat(editingIngredient?.lossFactor || "0"),
    }
  });

  useEffect(() => {
    if (editingIngredient) {
      reset({
        name: editingIngredient.name,
        unitId: editingIngredient.unitId,
        lossFactor: parseFloat(editingIngredient.lossFactor),
      });
    } else {
      reset({
        name: "",
        unitId: 1,
        lossFactor: 0,
      });
    }
  }, [editingIngredient, reset]);

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
              name="unitId"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  selectedKey={field.value ? field.value.toString() : ""}
                  onSelectionChange={(key) => field.onChange(key ? parseInt(key as string) : 1)}
                  label="Unidad"
                  errorMessage={errors.unitId?.message}
                  isInvalid={!!errors.unitId}
                >
                  {units.map((unit) => (
                    <AutocompleteItem key={unit.id.toString()} textValue={unit.name}>
                      {unit.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              )}
            />

            <Controller
              name="lossFactor"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  label="Factor de Pérdida"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  errorMessage={errors.lossFactor?.message}
                  isInvalid={!!errors.lossFactor}
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