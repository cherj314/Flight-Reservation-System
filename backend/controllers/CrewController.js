const BaseController = require('./BaseController'); // Adjust path as necessary
const Crew = require('../entities/Crew');

class CrewController extends BaseController {
    constructor() {
        super(new Crew());
    }

    setRoutes() {
        this.setGet('/', this.getAllImmediately.bind(this)); // Binds this controller to function
        this.setGet('/:flightId', this.getCrewsForFlight);
        this.setPost('/add', this.add.bind(this));
        this.setDelete('/remove/:id', this.remove.bind(this));
    }

    async getCrewsForFlight(req, res) {
        const {flightId} = req.params;
        const crews = await Crew.getListByFlightId(flightId);
        res.json(crews);
    }
}

module.exports = CrewController;
