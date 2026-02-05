import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Producto from './models/Producto.js';


const app = express();
const PUERTO = process.env.PORT || 8080;

const main = async () => {

    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/suplementos';

    mongoose.connect(MONGODB_URI) // aquí luego pegamos la URI de Compass
        .then(() => console.log('Conexion exitosa a la DB'))
        .catch((error) => {
            console.log('Hay un problema con la DB', error);
            process.exit(1); // Si falla la conexión, cierro el servidor
        })
}

main()

// middleware
app.use(cors());
app.use(express.json())
// declaro al server que se va a trabajar con JSON
app.use(express.urlencoded({ extended: true }))


// ruta base
app.get('/api', (req, res) => {
    res.send("API de suplementos UVM funcionando")
})

//empezamos con el CRUD de la DB

// Crear producto (CREATE)
app.post('/api/productos', async (req, res) => {
    try {
        const { imagen, stock, descripcion, precio } = req.body;

        // validación if que pide la consigna
        if (stock == null || descripcion == null || precio == null) {
            return res.status(400).json({
                message: 'stock, descripcion y precio son obligatorios',
            });
        }

        const nuevoProducto = await Producto.create({
            imagen,
            stock,
            descripcion,
            precio,
            // activo se va en true por default, hay que recordar esto al hacer el create dentro de app.post
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener todos los productos (READ)
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener un producto por id
app.get('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error obteniendo producto por id:', error);
        // Si el id no tiene formato válido de ObjectId, devolvemos 400
        return res.status(400).json({ message: 'Id no válido' });
    }
});

// Actualizar un producto por id (UPDATE)
app.put('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { imagen, stock, descripcion, precio, activo } = req.body;

        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            {
                imagen,
                stock,
                descripcion,
                precio,
                activo,
            },
            {
                new: true,        // devuelve el documento ya actualizado
                runValidators: true, // respeta min, required, etc.
            }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(productoActualizado);
    } catch (error) {
        console.error('Error actualizando producto:', error);
        return res.status(400).json({ message: 'Error al actualizar (id no válido o datos incorrectos)' });
    }
});

// Delete de un producto con la opcion de marcar inactivo y stock en 0
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const productoEliminado = await Producto.findByIdAndUpdate(
            id,
            {
                activo: false,
                stock: 0,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({
            message: 'Producto desactivado correctamente',
            producto: productoEliminado,
        });
    } catch (error) {
        console.error('Error al desactivar producto:', error);
        return res.status(400).json({ message: 'Error al desactivar (id no válido)' });
    }
});

// Delete total: elimina el documento de la colección
// ATENCION EQUIPO esta practica no es la usual o la correcta debido a que normalmente lo mejor es mantener el producto existiendo, solo se hace por fines academicos
app.delete('/api/productos/:id/hard', async (req, res) => {
    try {
        const { id } = req.params;

        const productoEliminado = await Producto.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({
            message: 'Producto eliminado completamente de la base de datos',
            producto: productoEliminado,
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return res
            .status(400)
            .json({ message: 'Error al eliminar (id no válido)' });
    }
});



//  Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`escuchando el puerto ${PUERTO}`)
})

export default httpServer;