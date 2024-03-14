const DatabasePool = require('../boundaries/DatabasePool');

class Crew {
    constructor() {
        this.table = 'crew';
        this.crew_id = '';
    }

    setInfo({crew_id, name, position}) {
        this.crew_id = crew_id;
        this.name = name;
        this.position = position;
        return this;
    }

    static async getListByFlightId(flightId) {
        const db = await DatabasePool.getInstance();
        const [rows] = await db.query(`SELECT * FROM ${Crew.TABLE_NAME} WHERE flight_id = ?`, [flightId]);
        return rows;
    }
}

module.exports = Crew;
