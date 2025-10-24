"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { IUnit, IUnitPayload } from "../../types/units.type";

const unitSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  factor: z.number().min(0, "Factor debe ser positivo"),
});

type UnitFormData = z.infer<typeof unitSchema>;

interface UnitFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingUnit: IUnit | null;
  onSave: (data: IUnitPayload) => void;
}

const UnitForm = ({ isOpen, onClose, editingUnit, onSave }: UnitFormProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: editingUnit?.name || "",
      factor: editingUnit?.factor || 1,
    }
  });

  useEffect(() => {
    if (editingUnit) {
      reset({
        name: editingUnit.name,
        factor: editingUnit.factor,
      });
    } else {
      reset({
        name: "",
        factor: 1,
      });
    }
  }, [editingUnit, reset]);

  const onSubmit = (data: UnitFormData) => {
    onSave(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="opaque">
      <ModalContent style={{ background: 'linear-gradient(to right, rgba(242, 220, 230, 1) 0%, rgba(245, 225, 220, 1) 50%, rgba(250, 235, 210, 1) 70%, rgba(255, 240, 205, 1) 90%, rgba(255, 245, 210, 1) 100%)' }}>
        <ModalHeader>
          {editingUnit ? "Editar Unidad" : "Nueva Unidad"}
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
              name="factor"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  label="Factor"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  errorMessage={errors.factor?.message}
                  isInvalid={!!errors.factor}
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

export default UnitForm;