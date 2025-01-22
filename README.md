[Open test](https://xseb4s.github.io/frontend-test/) click to check
# Frontend para la Gestión de Productos y Carrito de Compras

## Descripción

El frontend de la aplicación está diseñado para interactuar con la API de productos y carrito de compras que se implementó en el backend. Utiliza TypeScript como base, Axios para la comunicación con la API, y Tailwind CSS para el estilo. Además, se incorporó una función para encontrar la combinación de productos con el mayor valor total dentro de un presupuesto máximo, sin excederlo.

## Implementación

### 1. **Estructura del Proyecto**

El frontend está basado en TypeScript, lo que permite una mayor seguridad y escalabilidad en el código. Se ha configurado Axios para realizar las peticiones HTTP a la API del backend. Los servicios principales que se consumen son:

- **GET** para obtener los productos disponibles.
- **POST** para agregar productos al carrito.

### 2. **Uso de Axios para Consumir la API**

Se creó un **custom hook** para manejar las solicitudes HTTP de manera eficiente. El hook abstrae las llamadas a la API y proporciona un estado gestionado que puede ser utilizado directamente en los componentes.

```typescript
import { useState, useEffect } from 'react';
import { ReadProducts } from '../service/product.service';
import { ProductsInterface } from '../types/products.interface';

const useProducts = () => {
    const [productData, setProductData] = useState<ProductsInterface[]>([]);
    const [filteredData, setFilteredData] = useState<ProductsInterface[]>([]);
    const [error, setError] = useState<boolean>(false);

    const getProducts = async () => {
        const { data, error } = await ReadProducts();
        if (error) {
            console.log(error);
            setError(error);
        } else {
            setProductData(data);
        }
    };

    const findBestCombination = (budget: number): ProductsInterface[] => {
        const n = productData.length;
        const dp = Array.from({ length: n + 1 }, () => 
            Array(budget + 1).fill(0)
        );

        for (let i = 1; i <= n; i++) {
            for (let w = 1; w <= budget; w++) {
                const { price } = productData[i - 1];
                if (price <= w) {
                    dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - price] + price);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        let w = budget;
        const selectedProducts: ProductsInterface[] = [];

        for (let i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                const product = productData[i - 1];
                selectedProducts.push(product);
                w -= product.price;
            }
        }

        setFilteredData(selectedProducts.reverse());
        return selectedProducts;
    };

    useEffect(() => {
        getProducts(); 
    }, []);

    return { 
        productData,
        filteredData,
        findBestCombination, 
        error 
    };
};

export default useProducts;

```
3. Interfaz de Usuario con Tailwind CSS
Tailwind CSS se utilizó para aplicar estilos de manera rápida y eficiente. El diseño es responsive, lo que asegura que la aplicación funcione bien tanto en escritorio como en dispositivos móviles.

Ejemplo de componente para mostrar los productos:

```tsx
const renderProducts = () => {
    const productsToRender = filteredData.length > 0 ? filteredData : productData;
    return productsToRender.map((product) => (
        <Card key={product.id}>
            <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-lg font-semibold text-gray-800">${product.price}</p>
                <button
                    className="bg-green-500 text-white px-4 py-2 mt-4 w-full hover:bg-green-600"
                    onClick={() => addCart(product.id)}
                >
                    Add to cart
                </button>
            </div>
        </Card>
    ));
};
```
4. Integración con el Carrito de Compras
El carrito de compras está gestionado con un estado local y actualizado a través de las solicitudes POST a la API. Los usuarios pueden agregar productos al carrito y visualizar el contenido del mismo.

```typescript
const addCart = async (id: number) => {
        try {
            const { data } = await AddCart(id);

            if (data.cart) {
                setData(data.cart);
            } else {
                await getCart();
            }
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };
```
Este frontend permite interactuar con la API de productos y carrito de compras, proporcionando una experiencia de usuario sencilla y eficiente. El uso de TypeScript y Axios facilita la gestión de datos y las interacciones con la API, mientras que Tailwind CSS permite un diseño limpio y responsive. La función para optimizar las combinaciones de productos dentro de un presupuesto añade un valor adicional para los usuarios al tomar decisiones de compra más inteligentes.
