const Seat = require('../entities/Seat');

class Aircraft {
    constructor() {
        this.table = 'aircrafts';
        this.aircraft_id = '';
        return this;
    }

    setInfo({ aircraft_id, aircraft_name, seats_capacity }) {
        this.aircraft_id = aircraft_id;
        this.aircraft_name = aircraft_name;
        this.seats_capacity = seats_capacity;
        this.seats = [];
        this.seats.push(new Seat());
        return this;
    }

    setSeats(seats, base_price){
        while (this.seats.length < seats.length && this.seats.length < this.seats_capacity) {
            this.seats.push(new Seat());
        }

        for (let i = 0; i < seats.length; i++) {
            if (this.seats[i] && seats[i]) { // If there are as many seats in the database as it's capacity
                this.seats[i].setInfo({ ...seats[i], base_price });
            }
        }
    }
}

module.exports = Aircraft;