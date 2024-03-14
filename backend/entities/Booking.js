const Flight = require('../entities/Flight');
const Seat = require('../entities/Seat');
const User = require('../entities/User');

class Booking {
    constructor() {
        this.table = 'bookings';
        this.booking_id = '';
        this.flight = new Flight();
        this.seat = new Seat();
        this.user = new User();
    }

    setInfo({ booking_id, cancellation_insurance, payment_amount, payment_datetime }) {
        this.booking_id = booking_id;
        this.cancellation_insurance = cancellation_insurance;
        this.payment_amount = payment_amount;
        this.payment_datetime = payment_datetime;
        return this;
    }

    static async getBookingBySeatId(seatId) {
        const db = await DatabasePool.getInstance();
        const [booking] = await db.query('SELECT * FROM bookings WHERE seat_id = ?', [seatId]);
        return booking[0] || null;
    }

    static async updatePayment(bookingId, paymentAmount) {
        const db = await DatabasePool.getInstance();
        const [result] = await db.execute(
            'UPDATE bookings SET payment_amount = ?, payment_datetime = NOW() WHERE booking_id = ?',
            [paymentAmount, bookingId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Booking;
