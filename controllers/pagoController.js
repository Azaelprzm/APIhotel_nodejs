const Pago = require('../models/Pago');
const Reserva = require('../models/Reserva');

// Registrar un pago
const realizarPago = async (req, res) => {
  try {
    const { reservaId, monto, metodo, tarjeta } = req.body;

    // Verificar que la reserva exista
    const reserva = await Reserva.findByPk(reservaId);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Validar el monto del pago
    if (monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser mayor a 0.' });
    }
    if (monto > reserva.adeudo) {
      return res.status(400).json({ message: 'El monto excede el adeudo de la reserva.' });
    }

    // Validar método de pago
    if (metodo === 'tarjeta' && !tarjeta) {
      return res.status(400).json({ message: 'Se requiere el número de tarjeta para el pago con tarjeta.' });
    }

    // Registrar el pago
    const nuevoPago = await Pago.create({
      monto,
      metodo,
      tarjeta: metodo === 'tarjeta' ? tarjeta : null,
      reservaId,
    });

    // Actualizar el adeudo de la reserva
    reserva.adeudo -= monto;
    await reserva.save();

    res.status(201).json({ message: 'Pago registrado con éxito.', pago: nuevoPago });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el pago.', error });
  }
};

// Obtener los pagos de una reserva
const obtenerPagosPorReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;

    // Obtener pagos de la reserva
    const pagos = await Pago.findAll({ where: { reservaId } });
    if (pagos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pagos para la reserva.' });
    }

    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos.', error });
  }
};

module.exports = { realizarPago, obtenerPagosPorReserva };
