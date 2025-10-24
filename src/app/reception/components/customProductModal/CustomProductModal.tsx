import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Card, CardBody, CardHeader } from "@heroui/react";
import { IProduct, IProductDetail, IRecipeIngredient } from "../../../types/products.type";
import { IIngredient } from "../../../types/ingredients.type";
import { getProductDetailById } from "@/app/services/products.service";
import { getIngredients } from "@/app/services/ingredients.service";
import { useState, useEffect } from "react";

interface CustomProductModalProps {
     isOpen: boolean;
     onOpenChange: (isOpen: boolean) => void;
     selectedProduct: IProduct | null;
     productQuantities: { [key: string]: number };
     onCustomProductCreated?: (customProduct: IProduct) => void;
     onCustomProductUpdated?: (customProduct: IProduct) => void;
     customProducts?: IProduct[];
     isCustomProduct?: boolean;
 }

const CustomProductModal = ({
     isOpen,
     onOpenChange,
     selectedProduct,
     productQuantities,
     onCustomProductCreated,
     onCustomProductUpdated,
     customProducts = [],
     isCustomProduct = false,
 }: CustomProductModalProps) => {
    const [productDetails, setProductDetails] = useState<IProductDetail | null>(null);
    const [originalIngredients, setOriginalIngredients] = useState<IRecipeIngredient[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [ingredients, setIngredients] = useState<IIngredient[]>([]);
    const [, setSelectedIngredient] = useState<string>("");

    

    useEffect(() => {
        console.log("productDetails actualizado: ", productDetails);
    }, [productDetails])

    useEffect(() => {
        if (isOpen && selectedProduct) {
            setLoading(true);
            if (isCustomProduct) {
                // Load from custom products state
                const customProduct = customProducts.find(p => p.id === selectedProduct.id);
                if (customProduct) {
                    // Create a mock product details from custom product
                    const mockProductDetails: IProductDetail = {
                        id: parseInt(customProduct.id.replace('custom-', '')), // Extract number from custom id
                        name: customProduct.name,
                        price: customProduct.price,
                        preTaxPrice: customProduct.preTaxPrice,
                        category: { id: -1, name: "Custom" },
                        recipe: {
                            id: 0, // Mock id
                            cost: parseFloat(customProduct.cost || "0"),
                            ingredients: customProduct.ingredients?.map(ing => ({
                                id: ing.id,
                                quantity: ing.quantity.toString(),
                                ingredient: {
                                    id: ing.id,
                                    name: "Ingredient " + ing.id, // Mock name, you might need to fetch actual ingredient names
                                    stock: 0 // Mock stock
                                }
                            })) || []
                        },
                        recipeId: 0, // Mock
                        categoryId: -1, // Mock
                        createdAt: new Date().toISOString(), // Mock
                        updatedAt: new Date().toISOString() // Mock
                    };
                    setProductDetails(mockProductDetails);
                    setOriginalIngredients(mockProductDetails.recipe?.ingredients || []);
                    // Still need ingredients for adding new ones
                    getIngredients("", 1, 100)
                        .then(ingredientsResponse => {
                            setIngredients(ingredientsResponse.data);
                        })
                        .catch((error) => {
                            console.error("Error fetching ingredients:", error);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            } else {
                // Load from services
                Promise.all([
                    getProductDetailById(selectedProduct.id),
                    getIngredients("", 1, 100) // Get all ingredients
                ])
                    .then(([productResponse, ingredientsResponse]) => {
                        setProductDetails(productResponse);
                        setOriginalIngredients(productResponse.recipe?.ingredients || []);
                        setIngredients(ingredientsResponse.data);
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        } else {
            setProductDetails(null);
            setOriginalIngredients([]);
            setIngredients([]);
            setSelectedIngredient("");
        }
    }, [isOpen, selectedProduct, isCustomProduct, customProducts]);
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Configuración del Producto</ModalHeader>
                <ModalBody>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : productDetails ? (
                        <div>
                            <Card>
                                <CardBody>
                                    <p><strong>Nombre:</strong> {productDetails.name}</p>
                                    <p><strong>Precio:</strong> ${productDetails.price}</p>
                                    <p><strong>Cantidad actual:</strong> {productQuantities[productDetails.id] || 0}</p>
                                </CardBody>
                            </Card>
                            {productDetails.recipe && productDetails.recipe.ingredients && productDetails.recipe.ingredients.length > 0 && (
                                <Card className="mt-4">
                                    <CardHeader>
                                        <p><strong>Ingredientes:</strong></p>
                                    </CardHeader>
                                    <CardBody>
                                        <ul>
                                            {productDetails.recipe.ingredients.map((recipeIngredient: IRecipeIngredient, index: number) => (
                                                <li key={index} className="flex items-center justify-between">
                                                    <span>{recipeIngredient.ingredient.name}</span>
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
                                    </CardBody>
                                </Card>
                            )}

                            <Card className="mt-4">
                                <CardHeader>
                                    <p><strong>Agregar Ingrediente:</strong></p>
                                </CardHeader>
                                <CardBody>
                                    <Select
                                        placeholder="Seleccionar ingrediente"
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] as string;
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
                                        {ingredients
                                            .filter(ing => !productDetails?.recipe?.ingredients?.some(sel => sel.ingredient.id.toString() === ing.id.toString()))
                                            .map((ingredient) => (
                                                <SelectItem key={ingredient.id}>
                                                    {ingredient.name}
                                                </SelectItem>
                                            ))}
                                    </Select>
                                </CardBody>
                            </Card>
                        </div>
                    ) : (
                        <p>No se pudo cargar la información del producto.</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                    <Button
                        color="primary"
                        isLoading={saving}
                        onPress={async () => {
                            if (!productDetails) return;

                            const currentIngredients = productDetails.recipe?.ingredients || [];
                            const hasChanges = JSON.stringify(currentIngredients) !== JSON.stringify(originalIngredients);

                            if (hasChanges) {
                                setSaving(true);
                                try {
                                    if (isCustomProduct && selectedProduct) {
                                        // Update existing custom product
                                        const updatedCustomProduct: IProduct = {
                                            ...selectedProduct,
                                            ingredients: currentIngredients.map(ing => ({
                                                id: ing.ingredient.id,
                                                quantity: parseInt(ing.quantity)
                                            }))
                                        };
                                        onCustomProductUpdated?.(updatedCustomProduct);
                                        console.log("Producto custom actualizado localmente");
                                    } else {
                                        // Create new custom product
                                        const customProduct: IProduct = {
                                            id: `custom-${Date.now()}`, // Generate a unique ID
                                            name: `${productDetails.name} (Custom)`,
                                            preTaxPrice: productDetails.preTaxPrice,
                                            price: productDetails.price,
                                            category: productDetails.category.name,
                                            cost: productDetails.recipe?.cost?.toString() || "0",
                                            maxPrepareable: "1", // Default for custom products
                                            ingredients: currentIngredients.map(ing => ({
                                                id: ing.ingredient.id,
                                                quantity: parseInt(ing.quantity)
                                            }))
                                        };
                                        onCustomProductCreated?.(customProduct);
                                        console.log("Producto custom creado localmente");
                                    }
                                    onOpenChange(false);
                                } catch (error) {
                                    console.error("Error guardando producto custom:", error);
                                } finally {
                                    setSaving(false);
                                }
                            } else {
                                onOpenChange(false);
                            }
                        }}
                    >
                        Guardar Cambios
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CustomProductModal;