# [Frontend para la Gestión de Productos y Carrito de Compras](https://xseb4s.github.io/frontend-test/) click to check

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

# Despliegue del Frontend

## Despliegue en un VPS

Para desplegar el frontend en un VPS, sigue estos pasos:

### 1. **Configurar el VPS**

Primero, asegúrate de tener un VPS configurado y listo para desplegar. Si aún no tienes un VPS, puedes seguir los pasos descritos en la sección de despliegue del backend (de este README). 

### 2. **Subir el Proyecto al VPS**

Una vez que tengas acceso a tu VPS, sube los archivos del frontend al servidor. Puedes hacer esto utilizando **Git** (si tienes un repositorio remoto) o utilizando **SFTP/FTP** para transferir los archivos manualmente.

Si usas Git:
```bash
git clone <URL-de-tu-repositorio>
cd <nombre-del-repositorio>
```
3. Instalar Dependencias
En tu VPS, asegúrate de tener Node.js y npm instalados. Si no los tienes, sigue los pasos de la sección anterior para instalarlos.

Instala las dependencias del proyecto:

```bash
npm install
```
4. Construir el Proyecto
Antes de poner en marcha el frontend, necesitas compilarlo para producción. Utiliza el siguiente comando para generar los archivos estáticos:

```bash
npm run build
```
Esto creará una carpeta build con los archivos estáticos listos para ser servidos.

5. Instalar un Servidor HTTP (por ejemplo, Nginx o Serve)
Si usas Nginx, puedes configurarlo para servir los archivos estáticos. Primero, instala Nginx si no lo tienes:

```bash
sudo apt install nginx
```
Luego, crea una configuración de servidor para tu aplicación en /etc/nginx/sites-available/default que apunte a la carpeta build de tu proyecto:

```nginx
server {
    listen 80;
    server_name <tu_dominio_o_ip>;

    root /ruta/a/tu/proyecto/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Si prefieres utilizar Serve para servir los archivos estáticos sin configurar un servidor HTTP completo, puedes instalar serve globalmente:

```bash
sudo npm install -g serve
serve -s build
```
6. Iniciar el Servidor
Si usas Nginx, reinicia el servicio:

```bash
sudo systemctl restart nginx
```
Si usas Serve, puedes iniciar el servidor con:

```bash
serve -s build
```
7. Configurar el Firewall
Asegúrate de que el puerto 80 (HTTP) esté abierto en tu firewall para que la aplicación sea accesible desde cualquier navegador.

```bash
sudo ufw allow 80
sudo ufw enable
```
## Despliegue en Vercel
Vercel es una plataforma de despliegue muy sencilla para aplicaciones frontend, como React. Para desplegar tu aplicación en Vercel, sigue estos pasos:

1. Crear una Cuenta en Vercel
Si aún no tienes una cuenta en Vercel, dirígete a Vercel y regístrate utilizando tu cuenta de GitHub, GitLab o tu correo electrónico.

2. Conectar el Repositorio de tu Proyecto
Una vez que inicies sesión en Vercel, conecta tu repositorio de GitHub (o GitLab) a Vercel. Esto permitirá que Vercel acceda a tu código y lo despliegue automáticamente.

3. Configurar el Proyecto
Vercel detectará automáticamente que estás usando React y configurará tu proyecto para ser desplegado en la plataforma. En la mayoría de los casos, no es necesario realizar configuraciones adicionales, pero si tu proyecto necesita variables de entorno, puedes configurarlas en la interfaz de Vercel.

4. Desplegar
Haz clic en "Deploy" y Vercel comenzará a compilar y desplegar tu proyecto. El proceso puede tardar unos minutos. Una vez completado, recibirás una URL para acceder a tu aplicación en producción.

5. Configurar un Dominio Personalizado (Opcional)
Si deseas usar tu propio dominio en lugar de la URL proporcionada por Vercel, puedes configurar tu dominio en la sección de "Domains" de la interfaz de Vercel y actualizar los registros DNS en tu proveedor de dominios para que apunten a Vercel.

Conclusión
Dependiendo de tus necesidades y preferencias, puedes desplegar tu frontend en un VPS para tener más control sobre la infraestructura o usar Vercel para un despliegue rápido y fácil. Ambos métodos son efectivos y ofrecen ventajas según el caso de uso de tu proyecto.
