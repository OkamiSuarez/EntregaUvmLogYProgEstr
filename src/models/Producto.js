import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
    {
        // Usamos solo el _id que crea Mongo automáticamente, fuera de eso
        activo: {
            type: Boolean,
            default: true,
        },
        imagen: {
            type: String, // opcional ya que podemos poner link o no ponerlo, por eso no tiene un required
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        precio: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;
