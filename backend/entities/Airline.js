const Crew = require('../entities/Crew');
const Flight = require('../entities/Flight');
const Aircraft = require('../entities/Aircraft');
const User = require('../entities/User');
const Booking = require('../entities/Booking');

class Airline {
    constructor() {
        this.crew = [];
        this.crew.push(new Crew());
        this.flights = [];
        this.flights.push(new Flight());
        this.aircraft = [];
        this.aircraft.push(new Aircraft());
        this.users = [];
        this.users.push(new User());
        this.bookings = [];
        this.bookings.push(new Booking());
    }

    async setFlights(flights){
        while (this.flights.length < flights.length) {
            this.flights.push(new Flight());
        }

        for (let i = 0; i < flights.length; i++) {
            if (this.flights[i] && flights[i]) { // If there are as many seats in the database as it's capacity
                this.flights[i].setInfo(flights[i]);
            }
        }
    }

    async setBookings(bookings){
        while (this.bookings.length < bookings.length) {
            this.bookings.push(new Booking());
        }

        for (let i = 0; i < bookings.length; i++) {
            if (this.bookings[i] && bookings[i]) { // If there are as many seats in the database as it's capacity
                this.bookings[i].setInfo(bookings[i]);
            }
        }
    }
}

module.exports = Airline;