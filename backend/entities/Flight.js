const Destination = require('../entities/Destination');
const Aircraft = require('../entities/Aircraft');
const Crew = require('../entities/Crew');

class Flight {
    constructor() {
        this.table = 'flights';
        this.flight_id = '';
        this.origin = new Destination();
        this.destination = new Destination();
        this.aircraft = new Aircraft();
    }

    setInfo({ flight_id, departure_datetime, arrival_datetime, base_price }) {
        this.flight_id = flight_id;
        this.departure_datetime = this.formatDateTime(departure_datetime);
        this.arrival_datetime = this.formatDateTime(arrival_datetime);
        this.base_price = parseFloat(base_price); // Parse base_price to a float if needed
        this.crew = [];
        this.crew.push(new Crew());
        return this;
    }

    async setCrew(crew){
        while (this.crew.length < crew.length) {
            this.crew.push(new Crew());
        }

        for (let i = 0; i < crew.length; i++) {
            if (this.crew[i] && crew[i]) { // If there are as many seats in the database as it's capacity
                this.crew[i].setInfo(crew[i]);
            }
        }
    }

    formatDateTime(datetimeString) {
        const date = new Date(datetimeString);

        // Format the date and time in a more readable format
        // Example: "November 24, 2023, 21:00"
        return date.toLocaleString('en-US', {
            month: 'long', // Full month name
            day: '2-digit', // Day with leading zero if necessary
            year: 'numeric', // Full year
            hour: 'numeric', // Hour without leading zero
            minute: '2-digit', // Minute with leading zero if necessary
            //second: '2-digit', // Second with leading zero if necessary
            //timeZoneName: 'short' // Short time zone name
        });

    }
}

module.exports = Flight;
