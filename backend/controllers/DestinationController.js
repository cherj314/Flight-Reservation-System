const BaseController = require('./BaseController'); // Adjust path as necessary
const Destination = require('../entities/Destination');

class DestinationController extends BaseController {
    constructor() {
        super(new Destination());
    }

    setRoutes() {
        this.setGet('/', this.getAllImmediately.bind(this)); // Binds this controller to function
        this.setPost('/add', this.add.bind(this));
        this.setDelete('/remove/:id', this.remove.bind(this));
    }

}

module.exports = DestinationController;
