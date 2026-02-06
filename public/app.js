const API_BASE = 'http://localhost:8080/api';

const form = document.getElementById('form-producto');
const mensaje = document.getElementById('mensaje');
const listaProductos = document.getElementById('lista-productos');
const btnRecargar = document.getElementById('btn-recargar');

// Crear producto con fetch (POST)
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validaciones básicas
    const descripcion = form.descripcion.value.trim();
    const precio = Number(form.precio.value);
    const stock = Number(form.stock.value);
    const imagen = form.imagen.value.trim();

    if (descripcion.length < 3) {
        mostrarMensaje('La descripción debe tener al menos 3 caracteres', 'error');
        return;
    }

    if (isNaN(precio) || precio <= 0) {
        mostrarMensaje('El precio debe ser un número mayor que 0', 'error');
        return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
        mostrarMensaje('El stock debe ser un entero mayor o igual a 0', 'error');
        return;
    }

    // validar que la URL parezca válida
    if (imagen && !imagen.startsWith('http')) {
        mostrarMensaje('La URL de la imagen debe empezar con http o https', 'error');
        return;
    }

    const data = {
        imagen,
        stock,
        descripcion,
        precio
    };

    try {
        const res = await fetch(`${API_BASE}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            mensaje.textContent =
                errorData.message || 'Error al crear el producto';
            return;
        }

        const productoCreado = await res.json();
        mensaje.textContent = `Producto creado con id: ${productoCreado._id}`;
        form.reset();
        cargarProductos(); // recargamos la lista
    } catch (error) {
        console.error(error);
        mensaje.textContent = 'Error de conexión con la API';
    }
});

// Obtener y mostrar productos (GET)
async function cargarProductos() {
    listaProductos.innerHTML = 'Cargando...';

    try {
        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) {
            listaProductos.textContent = 'Error al obtener productos';
            return;
        }

        const productos = await res.json();

        if (productos.length === 0) {
            listaProductos.textContent = 'No hay productos registrados';
            return;
        }

        listaProductos.innerHTML = '';


        productos.forEach((p) => {
            const li = document.createElement('li');

            // Imagen del producto
            const img = document.createElement('img');
            img.src = p.imagen;
            img.alt = p.descripcion;
            img.style.width = '80px';      // ajusta tamaño a tu gusto
            img.style.marginRight = '10px';

            const texto = document.createElement('span');
            texto.textContent = `${p.descripcion} | Precio: $${p.precio} | Stock: ${p.stock} | Activo: ${p.activo}`;
            if (!p.activo) {
                texto.classList.add('producto-inactivo');
            }

            // Botón para sumar stock
            const btnMas = document.createElement('button');
            btnMas.textContent = '+';
            btnMas.style.marginLeft = '10px';

            // Botón para restar stock
            const btnMenos = document.createElement('button');
            btnMenos.textContent = '−';
            btnMenos.style.marginLeft = '5px';

            // Eventos de los botones
            btnMas.addEventListener('click', () => actualizarStock(p, p.stock + 1));
            btnMenos.addEventListener('click', () => {
                if (p.stock <= 1) return; // evitamos bajar de 1
                actualizarStock(p, p.stock - 1);
            });

            li.appendChild(img);
            li.appendChild(texto);
            li.appendChild(btnMas);
            li.appendChild(btnMenos);

            listaProductos.appendChild(li);
        });

        // Funcion para actualizar el stock
        async function actualizarStock(producto, nuevoStock) {
            try {
                const res = await fetch(`${API_BASE}/productos/${producto._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imagen: producto.imagen,
                        descripcion: producto.descripcion,
                        precio: producto.precio,
                        activo: producto.activo,
                        stock: nuevoStock,
                    }),
                });

                if (!res.ok) {
                    console.error('Error al actualizar stock');
                    return;
                }

                // Opcional: podrías actualizar solo ese <li>, pero para simplificar recargamos todo
                await cargarProductos();
            } catch (error) {
                console.error('Error de conexión al actualizar stock', error);
            }
        }


    } catch (error) {
        console.error(error);
        listaProductos.textContent = 'Error de conexión al cargar productos';
    }
}




// botón para recargar
btnRecargar.addEventListener('click', cargarProductos);

// cargar al abrir la página
cargarProductos();
