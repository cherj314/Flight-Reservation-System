const BaseController = require('./BaseController'); // Adjust path as necessary
const Booking = require('../entities/Booking');
const Seat = require('../entities/Seat');
const DatabasePool = require("../boundaries/DatabasePool");

class BookingController extends BaseController {
    constructor() {
        super(new Booking());
    }

    setRoutes() {
        this.setGet('/', this.getAllImmediately.bind(this)); // Binds this controller to function
        this.setGet('/user/:id', this.getBookingsByUser.bind(this)); // Binds this controller to function
        this.setGet('/confirmation/:id', this.getBookingInfo); // flight id
        this.setPost('/add', this.add.bind(this));
        this.setDelete('/remove/:id', this.remove.bind(this));
    }

    async getBookingsByUser(req, res) {
        const db = await DatabasePool.getInstance();
        const [rows] = await db.query(`SELECT * FROM bookings WHERE user_id = ?`, [req.params.id]);
        res.json(rows);

    }

    async getBookingInfo(req, res) {
        var bookingId = req.params.id;

        try {
            let [booking, bookingInfo] = await super.getById(new Booking(), bookingId);
            if (bookingInfo) {
                res.json(bookingInfo);
            } else {
                res.status(404).json({error: 'Booking not found'});
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    async getConfirmation(req, res) {
        const {bookingId} = req.params;

        try {
            const bookingInfo = await new Booking().getById(bookingId);
            if (bookingInfo) {
                res.json(bookingInfo);
            } else {
                res.status(404).json({error: 'Booking not found'});
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

}

module.exports = BookingController;