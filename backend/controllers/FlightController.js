const DatabasePool = require("../boundaries/DatabasePool");
const BaseController = require('./BaseController'); // Adjust path as necessary
const Flight = require('../entities/Flight');

class FlightController extends BaseController {
    constructor() {
        super(new Flight());
    }

    setRoutes() {
        this.setGet('/f', this.getAllImmediately, Flight);
        this.setGet('/', this.getAllImmediately.bind(this)); // Binds this controller to function
        this.setGet('/info/:id', this.getFlightInfo); // flight id
        this.setPost('/add', this.add.bind(this));
        this.setDelete('/remove/:id', this.remove.bind(this));
    }

    async getFlightInfo(req, res) {
        const db = await DatabasePool.getInstance();

        // Load flight, aircraft, origin and destination
        let [ flight, flightInfo ] = await super.getById(new Flight(), req.params.id);
        let [ aircraft, aircraftInfo ] = await super.getById(flight.aircraft, flightInfo.aircraft_id);
        let [ origin, originInfo ] = await super.getById(flight.origin, flightInfo.origin_id);
        let [ destination, destinationInfo ] = await super.getById(flight.destination, flightInfo.destination_id);

        // Load aircraft seats
        let columns = Object.keys(flightInfo);
        let [rows] = await db.query(`
            SELECT 
                s.seat_id, 
                s.aircraft_id, 
                s.seat_number, 
                s.seat_type,
                b.user_id
            FROM 
                seats s
            LEFT JOIN 
                bookings b ON s.seat_id = b.seat_id AND b.flight_id = ?
            WHERE 
                s.aircraft_id = ?`,
            [flight.flight_id, flightInfo.aircraft_id]
        );
        aircraft.setSeats(rows, flight.base_price);

        // Load the crew of the flight
        [rows] = await db.query(`SELECT fc.crew_id, c.name, c.position FROM flight_crew fc INNER JOIN ${flight.crew[0].table} c 
            ON fc.crew_id = c.crew_id WHERE fc.flight_id = ?`, flightInfo.flight_id);
        flight.setCrew(rows);

        res.json(flight);
    }
}

module.exports = FlightController;
