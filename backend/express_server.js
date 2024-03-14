const express = require('express');
const cors = require('cors');

const AirlineRouter = new (require('./controllers/AirlineController'))().getRouter();
const FlightRouter = new (require('./controllers/FlightController'))().getRouter();
const SeatRouter = new (require('./controllers/SeatController'))().getRouter();
const BookingRouter = new (require('./controllers/BookingController'))().getRouter();
const CrewRouter = new (require('./controllers/CrewController'))().getRouter();
const AircraftRouter = new (require('./controllers/AircraftController'))().getRouter();
const UserRouter = new (require('./controllers/UserController'))().getRouter();
const DestinationRouter = new (require('./controllers/DestinationController'))().getRouter();

const PaymentRouter = new (require('./boundaries/PaymentService'))().getRouter();
const EmailRouter = new (require('./boundaries/EmailService'))().getRouter();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/airline', AirlineRouter);
app.use('/flights', FlightRouter);
app.use('/seats', SeatRouter);
app.use('/bookings', BookingRouter);
app.use('/crews', CrewRouter);
app.use('/aircraft', AircraftRouter);
app.use('/users', UserRouter);
app.use('/destination', DestinationRouter);

app.use('/payment', PaymentRouter);
app.use('/email', EmailRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
