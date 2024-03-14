const BaseController = require('./BaseController'); // Adjust path as necessary
const Seat = require('../entities/Seat');

class SeatController extends BaseController {
    constructor() {
        super(new Seat());
    }

    setRoutes() {
        this.setGet('/', this.getAllImmediately.bind(this)); // Binds this controller to function
        this.setGet('/byFlight/:flight_id', this.getSeatsByFlight);
        this.setPost('/reserve/:aircraftId', this.reserveSeat);
    }

    async reserveSeat(req, res) {
        const { aircraftId } = req.params;
        const { seatId } = req.body;
        await Seat.reserveSeat(aircraftId, seatId);
        res.sendStatus(200);
    }
}

module.exports = SeatController;
