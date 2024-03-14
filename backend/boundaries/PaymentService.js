const express = require('express');
const asyncHandler = require('../async_handler');

class PaymentService {

    constructor() {
        this.router = express.Router();
        this.setRoutes();
    }

    setPost(path, handler, ...extraArgs) {
        this.router.post(path, asyncHandler(async (req, res) => handler(req, res, ...extraArgs)));
    }

    setRoutes() {
        this.setPost('/:seat_price', this.receivePayment); // Binds this controller to function
    }

    getRouter() {
        return this.router;
    }

    async receivePayment(req, res) {
        // Payment is always accepted.
        // NOTE: The Bank is an actor thus it is not part of the system. However, we did implement
        // how the request would be sent from the Web application interface to the payment service.
        res.sendStatus(200);
    }

}

module.exports = PaymentService;