# EntregaUvmLogYProgEstr

Proyecto sencillo para la materia de **Lógica y Programación Estructurada**.  
Consiste en un render de productos de suplementos, con CRUD básico sobre una base de datos MongoDB y una interfaz simple en HTML/JS.

## Requisitos

- Node.js (versión 18+ recomendada)
- npm
- MongoDB en local (o una instancia remota)
- Navegador web moderno

---

## 🛠️ Instalación y configuración

### 1. Clonar el repositorio

git clone https://github.com/OkamiSuarez/EntregaUvmLogYProgEstr.git
cd EntregaUvmLogYProgEstr

### 2. Instalar dependencias

npm install

### 3. Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto con el siguiente contenido (puedes ajustarlo a tu entorno):

MONGODB_URI=mongodb://127.0.0.1:27017/suplementos
PORT=8080
MONGODB_URI: cadena de conexión a tu base de datos MongoDB.

PORT: puerto donde se levantará el servidor Express.

### 4. Importar datos de ejemplo (opcional)
Puedes importar un archivo productos.json en tu base de datos suplementos, colección productos, usando MongoDB Compass:

Abrir Compass y conectar a mongodb://127.0.0.1:27017.

Crear base de datos suplementos y colección productos (o dejar que se creen automáticamente).

Entrar a la colección productos → botón IMPORT DATA → seleccionar productos.json → formato JSON.

##▶️ Cómo ejecutar el proyecto
### 1. Iniciar el backend
Dependiendo de cómo esté configurado el package.json:

#### Desarrollo (con nodemon)
npm run dev

#### producción simple
npm start
El servidor quedará escuchando en http://localhost:8080 (o el puerto que hayas definido en PORT).

### 2. Iniciar el frontend
El frontend está en la carpeta public.

Opciones:

Usar Live Server en VS Code y abrir public/index.html.

O servir la carpeta public desde un servidor estático.

La aplicación consumirá la API en http://localhost:8080/api.

✨ Funcionalidades
Crear productos (imagen, descripción, precio, stock, activo).

Listar productos desde la base de datos.

Incrementar / decrementar stock desde la interfaz.

Activar / desactivar productos (cambia el campo activo).

Exportar los productos a un archivo .json desde el frontend.

Validaciones básicas de formulario en el cliente.

🧾 Estructura general del proyecto
src/ – Código del servidor (Express, conexión a MongoDB, rutas de la API).

public/ – Frontend sencillo con HTML, CSS y JavaScript.

productos.json – Datos de ejemplo para importar a MongoDB (opcional).

Proyecto educativo; puedes usarlo como referencia para aprender o practicar.
