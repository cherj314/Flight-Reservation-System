const BaseController = require("./BaseController");
const Aircraft = require('../entities/Aircraft');

class AircraftController extends BaseController {
    constructor() {
        super(new Aircraft());
    }

    setRoutes() {
        this.setGet('/', this.getAllImmediately.bind(this)); // Binds this controller to function
        this.setPost('/add', this.add.bind(this));
        this.setDelete('/remove/:id', this.remove.bind(this));
    }
}
module.exports = AircraftController;
