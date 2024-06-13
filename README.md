
# API de Sistema de Comercio Electrónico

## Introducción

Esta API proporciona endpoints para manejar productos, carritos, sesiones y usuarios en un sistema de comercio electrónico.

**Base URL:** `https://apataproyectofinal.up.railway.app`

## Autenticación

Para autenticarse, se debe iniciar sesión con correo y contraseña o directamente desde GitHub. También es posible registrarse en la página.

## Endpoints

### Carritos

1. **Obtener todos los carritos**
   - **Método:** GET
   - **URL:** `/api/carts`
   - **Descripción:** Devuelve todos los carritos disponibles.
   - **Función del Controlador:** `getCarts`

2. **Obtener un carrito por ID**
   - **Método:** GET
   - **URL:** `/api/carts/:cid`
   - **Descripción:** Devuelve un carrito específico según el ID proporcionado.
   - **Función del Controlador:** `getCartById`

3. **Agregar un nuevo carrito**
   - **Método:** POST
   - **URL:** `/api/carts`
   - **Descripción:** Agrega un nuevo carrito.
   - **Función del Controlador:** `addCart`

4. **Agregar un producto al carrito**
   - **Método:** POST
   - **URL:** `/api/carts/:cid/products/:pid`
   - **Descripción:** Agrega un producto específico al carrito.
   - **Función del Controlador:** `addProductInCart`

5. **Eliminar un producto del carrito**
   - **Método:** DELETE
   - **URL:** `/api/carts/:cid/products/:pid`
   - **Descripción:** Elimina un producto específico del carrito.
   - **Función del Controlador:** `deleteProduct`

6. **Vaciar un carrito por ID**
   - **Método:** DELETE
   - **URL:** `/api/carts/:cid`
   - **Descripción:** Elimina todos los productos de un carrito específico.
   - **Función del Controlador:** `cleanCartById`

7. **Actualizar productos en el carrito**
   - **Método:** PUT
   - **URL:** `/api/carts/:cid`
   - **Descripción:** Actualiza los productos en un carrito específico.
   - **Función del Controlador:** `updateProductsInCart`

8. **Actualizar la cantidad de productos en el carrito**
   - **Método:** PATCH
   - **URL:** `/api/carts/:cid/products/:pid`
   - **Descripción:** Actualiza la cantidad de un producto específico en el carrito.
   - **Función del Controlador:** `updateProductsQuantityInCart`

9. **Realizar una compra**
   - **Método:** PUT
   - **URL:** `/api/carts/:cid/purchase`
   - **Descripción:** Procesa la compra de un carrito, cambiando su estado.
   - **Función del Controlador:** `purchase`

### Productos

1. **Obtener todos los productos**
   - **Método:** GET
   - **URL:** `/api/products`
   - **Descripción:** Devuelve todos los productos disponibles.
   - **Función del Controlador:** `getProducts`

2. **Obtener un producto por ID**
   - **Método:** GET
   - **URL:** `/api/products/:pid`
   - **Descripción:** Devuelve un producto específico según el ID proporcionado.
   - **Función del Controlador:** `getProductById`

3. **Agregar un nuevo producto**
   - **Método:** POST
   - **URL:** `/api/products`
   - **Descripción:** Agrega un nuevo producto.
   - **Función del Controlador:** `addProduct`

4. **Actualizar un producto por ID**
   - **Método:** PUT
   - **URL:** `/api/products/:pid`
   - **Descripción:** Actualiza un producto existente según el ID proporcionado.
   - **Función del Controlador:** `updateProduct`

5. **Eliminar un producto por ID**
   - **Método:** DELETE
   - **URL:** `/api/products/:pid`
   - **Descripción:** Elimina un producto específico según el ID proporcionado.
   - **Función del Controlador:** `deleteProduct`

6. **Generar productos ficticios**
   - **Método:** GET
   - **URL:** `/mocking/products`
   - **Descripción:** Genera y devuelve una lista de productos ficticios.
   - **Función del Controlador:** `mockingProducts`

### Usuarios

1. **Obtener todos los usuarios**
   - **Método:** GET
   - **URL:** `/api/users`
   - **Descripción:** Devuelve todos los usuarios registrados.
   - **Función del Controlador:** `getUsers`

2. **Eliminar un usuario por ID**
   - **Método:** DELETE
   - **URL:** `/api/users/:uid`
   - **Descripción:** Elimina un usuario específico según el ID proporcionado.
   - **Función del Controlador:** `deleteUser`

3. **Eliminar usuarios inactivos**
   - **Método:** DELETE
   - **URL:** `/api/users/deleteOld`
   - **Descripción:** Elimina los usuarios que no se han conectado en más de dos días.
   - **Función del Controlador:** `deleteOldUsers`

4. **Registrar un nuevo usuario**
   - **Método:** POST
   - **URL:** `/register`
   - **Descripción:** Registra un nuevo usuario en el sistema.
   - **Función del Controlador:** `register`

5. **Iniciar sesión**
   - **Método:** POST
   - **URL:** `/login`
   - **Descripción:** Inicia sesión de un usuario existente.
   - **Función del Controlador:** `login`

6. **Cerrar sesión**
   - **Método:** GET
   - **URL:** `/logout`
   - **Descripción:** Cierra la sesión del usuario actual.
   - **Función del Controlador:** `logout`

7. **Restaurar contraseña**
   - **Método:** POST
   - **URL:** `/passwordRestore`
   - **Descripción:** Permite al usuario restaurar su contraseña.
   - **Función del Controlador:** `passwordRestore`

8. **Ver perfil de usuario**
   - **Método:** GET
   - **URL:** `/profile`
   - **Descripción:** Devuelve la información del perfil del usuario actual.
   - **Función del Controlador:** `current`

9. **Actualizar rol de usuario**
   - **Método:** PUT
   - **URL:** `/api/users/:uid/changeRole`
   - **Descripción:** Actualiza el rol de un usuario específico.
   - **Función del Controlador:** `changeRole`

### Otros Endpoints y Funcionalidades

- **Enviar correo electrónico de recuperación de contraseña**
  - **Método:** GET
  - **URL:** `/mail`
  - **Descripción:** Envía un correo electrónico con un enlace para restablecer la contraseña.
  - **Función del Controlador:** `mail`

- **Vistas y funcionalidades adicionales relevantes:**
  - `rootView`: Se redirige a `/login`
  - `/realTimeProducts`: Vista de administración de los productos (creación y eliminación)
  - `/chat`: Chat exclusivo para usuarios; los administradores no tienen acceso
  - `/productsView`: Renderiza `/products` si el usuario está logueado; de lo contrario, redirige a `/login`
  - `/loginView`: Renderiza `/login`
  - `/profileView`: Renderiza `/profile` con los datos del usuario logueado
  - `/passwordRestoreView`: Redirige `/passwordRestore` a la vista para completar correo para enviar el mail de restauración
  - `/restoreLinkView`: Verifica que el correo enviado no haya expirado y, si todo está bien, redirige a `/login` para iniciar sesión con la nueva clave
  - `/registerView`: Renderiza `/register` para crear un usuario
  - `/userAdminView`: Renderiza `/api/users/admin`; vista administrativa de todos los usuarios donde se puede eliminar y cambiar el rol de cada uno

## Realizar Compra

- **URL del Endpoint:** `/api/carts/:cid/purchase`
