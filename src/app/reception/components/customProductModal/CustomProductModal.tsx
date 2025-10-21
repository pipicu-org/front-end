import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { IProduct, IProductDetail, IRecipeIngredient } from "../../../types/products.type";
import { IIngredient, IGetIngredients } from "../../../types/ingredients.type";
import { getProductById } from "@/app/services/products.service";
import { getIngredients } from "@/app/services/ingredients.service";
import { useState, useEffect } from "react";

interface CustomProductModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    selectedProduct: IProduct | null;
    productQuantities: { [key: string]: number };
}

const CustomProductModal = ({
    isOpen,
    onOpenChange,
    selectedProduct,
    productQuantities,
}: CustomProductModalProps) => {
    const [productDetails, setProductDetails] = useState<IProductDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState<IIngredient[]>([]);
    const [selectedIngredient, setSelectedIngredient] = useState<string>("");

    useEffect(() => {
        console.log("productDetails actualizado: ", productDetails);
    }, [productDetails])

    useEffect(() => {
        if (isOpen && selectedProduct) {
            setLoading(true);
            Promise.all([
                getProductById(selectedProduct.id),
                getIngredients("", 1, 100) // Get all ingredients
            ])
                .then(([productResponse, ingredientsResponse]) => {
                    setProductDetails(productResponse as unknown as IProductDetail);
                    setIngredients(ingredientsResponse.data);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setProductDetails(null);
            setIngredients([]);
            setSelectedIngredient("");
        }
    }, [isOpen, selectedProduct]);
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Configuración del Producto</ModalHeader>
                <ModalBody>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : productDetails ? (
                        <div>
                            <p><strong>Nombre:</strong> {productDetails.name}</p>
                            <p><strong>Precio:</strong> ${productDetails.price}</p>
                            <p><strong>Cantidad actual:</strong> {productQuantities[productDetails.id] || 0}</p>
                            {productDetails.recipe && productDetails.recipe.ingredients && productDetails.recipe.ingredients.length > 0 && (
                                <div>
                                    <p><strong>Ingredientes:</strong></p>
                                    <ul>
                                        {productDetails.recipe.ingredients.map((recipeIngredient: IRecipeIngredient, index: number) => (
                                            <li key={index} className="flex items-center justify-between">
                                                <span>{recipeIngredient.ingredient.name} - Cantidad: {recipeIngredient.quantity}</span>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    onPress={() => {
                                                        if (productDetails) {
                                                            const updatedIngredients = productDetails.recipe.ingredients.filter(
                                                                (_, i) => i !== index
                                                            );
                                                            const updatedProductDetails = {
                                                                ...productDetails,
                                                                recipe: {
                                                                    ...productDetails.recipe,
                                                                    ingredients: updatedIngredients
                                                                }
                                                            };
                                                            setProductDetails(updatedProductDetails);
                                                        }
                                                    }}
                                                >
                                                    Remover
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-4">
                                <p><strong>Agregar Ingrediente:</strong></p>
                                <div className="mt-2">
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value=""
                                        onChange={(e) => {
                                            const selected = e.target.value;
                                            console.log("--------------------------");
                                            
                                            console.log("Seleccionado:", selected);
                                            console.log("Ingredientes disponibles:", ingredients);
                                            if (selected && productDetails) {
                                                // Logic to add ingredient to product
                                                const ingredientToAdd = ingredients.find(ing => String(ing.id) === String(selected));
                                                console.log("Comparando IDs - ingrediente.id:", ingredients.map(ing => ing.id), "selected:", selected);
                                                console.log("Tipos - ingrediente.id:", typeof ingredients[0]?.id, "selected:", typeof selected);
                                                console.log("Ingrediente encontrado:", ingredientToAdd);
                                                if (ingredientToAdd) {
                                                    const newIngredient: IRecipeIngredient = {
                                                        id: parseInt(ingredientToAdd.id),
                                                        quantity: "1", // Default quantity
                                                        ingredient: {
                                                            id: parseInt(ingredientToAdd.id),
                                                            name: ingredientToAdd.name,
                                                            stock: ingredientToAdd.stock
                                                        }
                                                    };

                                                    const currentIngredients = productDetails.recipe?.ingredients || [];
                                                    console.log("Ingredientes actuales:", currentIngredients);
                                                    const updatedIngredients = [...currentIngredients, newIngredient];
                                                    console.log("Ingredientes actualizados:", updatedIngredients);

                                                    const updatedProductDetails = {
                                                        ...productDetails,
                                                        recipe: {
                                                            ...productDetails.recipe,
                                                            ingredients: updatedIngredients
                                                        }
                                                    };

                                                    console.log("Actualizando productDetails...");
                                                    setProductDetails(updatedProductDetails);
                                                    console.log("Ingrediente agregado:", ingredientToAdd.name);
                                                }
                                            }
                                        }}
                                    >
                                        <option value="">Seleccionar ingrediente</option>
                                        {ingredients
                                            .filter(ing => !productDetails?.recipe?.ingredients?.some(sel => sel.ingredient.id.toString() === ing.id.toString()))
                                            .map((ingredient) => (
                                                <option key={ingredient.id} value={ingredient.id}>
                                                    {ingredient.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No se pudo cargar la información del producto.</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CustomProductModal;