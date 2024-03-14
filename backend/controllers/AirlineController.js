const DatabasePool = require("../boundaries/DatabasePool");
const BaseController = require('./BaseController'); // Adjust path as necessary
const Airline = require('../entities/Airline');

class AirlineController extends BaseController {
    constructor() {
        super(new Airline());
    }

    setRoutes() {
        this.setGet('/flights/', this.BrowseAllFlights); // example date '2023-11-23'
        this.setGet('/flights/:date', this.BrowseFlightsByDate); // example date '2023-11-23'
        this.setGet('/flights/destination/:id', this.BrowseFlightsByDestination); // example 3
        this.setGet('/bookings/:flight_id', this.getBookingsByFlight.bind(this));
    }

    async BrowseAllFlights(req, res){
        const db = await DatabasePool.getInstance();

        // Load airline
        let airline = new Airline();

        // Load flights by destination
        const [rows] = await db.query(`SELECT * FROM flights`);

        airline.setFlights(rows);
        for (let i = 0; i < airline.flights.length; i++) {
            await super.getById(airline.flights[i].aircraft, rows[i].aircraft_id); // Load aircraft
            await super.getById(airline.flights[i].origin, rows[i].origin_id); // Load origin
            await super.getById(airline.flights[i].destination, rows[i].destination_id); // Already loaded, but for consistency
        }

        res.json(airline.flights);
    }

    async BrowseFlightsByDate(req, res){
        const db = await DatabasePool.getInstance();

        // Load airline
        let airline = new Airline();

        //Load flights
        const [rows] = await db.query(`SELECT * FROM flights WHERE DATE(departure_datetime) = ?`, [req.params.date]);
        airline.setFlights(rows);
        for (let i = 0; i < airline.flights.length; i++) {
            await super.getById(airline.flights[i].aircraft, rows[i].aircraft_id); //Load aircraft
            await super.getById(airline.flights[i].origin, rows[i].origin_id); //Load origin
            await super.getById(airline.flights[i].destination, rows[i].destination_id); //Load destination
        }

        res.json(airline);
    }

    async BrowseFlightsByDestination(req, res){
        const db = await DatabasePool.getInstance();

        // Load airline
        let airline = new Airline();

        // Load flights by destination
        const [rows] = await db.query(`SELECT * FROM flights WHERE destination_id = ?`, [req.params.id]);
        airline.setFlights(rows);

        for (let i = 0; i < airline.flights.length; i++) {
            await super.getById(airline.flights[i].aircraft, rows[i].aircraft_id); // Load aircraft
            await super.getById(airline.flights[i].origin, rows[i].origin_id); // Load origin
            await super.getById(airline.flights[i].destination, rows[i].destination_id); // Already loaded, but for consistency
        }

        res.json(airline.flights);
    }

    async getBookingsByFlight(req, res) {
        const db = await DatabasePool.getInstance();

        // Load airline
        let airline = new Airline();

        let query;
        let queryParams;

        // Check if flight_id is zero, if so, query all bookings
        if (parseInt(req.params.flight_id) === 0) {
            query = `SELECT * FROM bookings`;
            queryParams = [];
        } else {
            query = `SELECT * FROM bookings WHERE flight_id = ?`;
            queryParams = [req.params.flight_id];
        }

        // Execute the query
        const [rows] = await db.query(query, queryParams);
        airline.setBookings(rows);

        for (let i = 0; i < airline.bookings.length; i++) {
            await super.getById(airline.bookings[i].flight, rows[i].flight_id); // Load aircraft
            await super.getById(airline.bookings[i].seat, rows[i].seat_id); // Load origin
            await super.getById(airline.bookings[i].user, rows[i].user_id); // Already loaded, but for consistency
        }

        res.json(airline.bookings);
    }


}

module.exports = AirlineController;
