const DatabasePool = require('../boundaries/DatabasePool');

class Seat {
    constructor() {
        this.table = 'seats';
        this.seat_id = '';
    }

    setInfo({ seat_id, aircraft_id, seat_number, seat_type, base_price, user_id }) {
        console.log(user_id)
        this.seat_id = seat_id;
        this.aircraft_id = aircraft_id;
        this.seat_number = seat_number;
        this.seat_type = seat_type;
        this.availability = this.calculateAvailability(user_id);
        this.price = this.calculatePrice(seat_type, base_price);
        return this;
    }

    calculatePrice(seat_type, base_price) {
        switch (seat_type) {
            case 'Ordinary':
                return base_price;
            case 'Comfort':
                return base_price * 1.4; // 40% more than ordinary
            case 'Business-Class':
                return base_price * 2; // More than double, assuming exactly double for this example
            default:
                return base_price; // Default to base price if seat type is not recognized
        }
    }

    calculateAvailability(user_id) {
        switch (user_id) {
            case null:
                return true; // A user has booked this seat
            default:
                return false;
        }
    }

    static async reserveSeat(aircraftId, seatId) {
        const db = await DatabasePool.getInstance();
        await db.execute('UPDATE seats SET status = ? WHERE seat_id = ?', ['reserved', seatId]);
        await db.execute('INSERT INTO bookings (aircraft_id, seat_id) VALUES (?, ?)', [aircraftId, seatId]);
    }
    
    static async updateSeatAvailability(seat_id, availability) {
        const db = await DatabasePool.getInstance();
        await db.execute('UPDATE seats SET availability = ? WHERE seat_id = ?', [availability, seat_id]);
    }
      
}

module.exports = Seat;