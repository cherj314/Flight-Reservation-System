-- Create the database
CREATE DATABASE IF NOT EXISTS flight_reservation_db;
USE flight_reservation_db;

-- Table for aircrafts
CREATE TABLE IF NOT EXISTS aircrafts (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_name VARCHAR(255) NOT NULL,
    seats_capacity INT NOT NULL
);

-- Table for flight destinations
CREATE TABLE IF NOT EXISTS destinations (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_name VARCHAR(255) NOT NULL
);

-- Table for flights
CREATE TABLE IF NOT EXISTS flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_id INT,
    origin_id INT,
    destination_id INT,
    departure_datetime DATETIME,
    arrival_datetime DATETIME,
    base_price DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY (aircraft_id) REFERENCES aircrafts(aircraft_id) ON DELETE CASCADE,
    FOREIGN KEY (origin_id) REFERENCES destinations(destination_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE CASCADE
);

-- Table for seats
CREATE TABLE IF NOT EXISTS seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_id INT,
    seat_number INT,
    seat_type ENUM('Ordinary', 'Comfort', 'Business-Class') NOT NULL,
    FOREIGN KEY (aircraft_id) REFERENCES aircrafts(aircraft_id) ON DELETE CASCADE
);

-- Table for registered users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    credit_card_number VARCHAR(16), 
    ticket BOOLEAN,
    lounge BOOLEAN,
    news BOOLEAN
);

-- Table for user memberships
CREATE TABLE IF NOT EXISTS memberships (
    user_id INT PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    -- Add other fields related to membership (e.g., monthly promotions, lounge access, etc.)
);

-- Table for user bookings
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    flight_id INT,
    seat_id INT,
    cancellation_insurance BOOLEAN,
    payment_amount DECIMAL(10, 2),
    payment_datetime DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE
);

-- Table for crew members
CREATE TABLE IF NOT EXISTS crew (
    crew_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL
);

-- Table for flight crew assignments
CREATE TABLE IF NOT EXISTS flight_crew (
    flight_id INT,
    crew_id INT,
    PRIMARY KEY (flight_id, crew_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    FOREIGN KEY (crew_id) REFERENCES crew(crew_id) ON DELETE CASCADE
);

-- Add other tables as needed for managing flight attendants, ticket cancellation insurance options, etc.

-- Sample data for destinations
INSERT INTO destinations (destination_name) VALUES
    ('New York'),
    ('Los Angeles'),
    ('Chicago');

-- Sample data for aircrafts
INSERT INTO aircrafts (aircraft_name, seats_capacity) VALUES
    ('Boeing 747', 300),
    ('Airbus A320', 150);

-- Sample data for flights
INSERT INTO flights (origin_id, destination_id, departure_datetime, arrival_datetime, aircraft_id, base_price) VALUES
    (1, 2, '2023-11-23 10:00:00', '2023-11-23 12:00:00', 1, 200.00),
    (2, 3, '2023-11-24 14:00:00', '2023-11-24 16:00:00', 2, 150.00),
    (2, 1, '2023-11-24 14:00:00', '2023-11-24 16:00:00', 1, 150.00);

-- Sample data for seats 
INSERT INTO seats (aircraft_id, seat_number, seat_type) VALUES
    (1, 1, 'Ordinary'),
    (1, 2, 'Comfort'),
    (1, 3, 'Business-Class'),
    (1, 4, 'Ordinary'),
    (1, 5, 'Comfort'),
	(1, 6, 'Ordinary'),
    (1, 7, 'Comfort'),
    (1, 8, 'Business-Class'),
    (1, 9, 'Ordinary'),
    (1, 10, 'Comfort'),
    (2, 1, 'Ordinary'),
    (2, 2, 'Comfort'),
    (2, 3, 'Business-Class'),
    (2, 4, 'Ordinary'),
    (2, 5, 'Comfort'),
	(2, 6, 'Ordinary'),
    (2, 7, 'Comfort'),
    (2, 8, 'Business-Class'),
    (2, 9, 'Ordinary'),
    (2, 10, 'Comfort');

-- Sample data for crew
INSERT INTO crew (name, position) VALUES 
    ('Clark Kent', 'Pilot'),
    ('Diana Prince', 'Flight Attendant'),
    ('Peter Parker', 'Flight Attendant'),
    ('Tony Stark', 'Flight Attendant'),
    ('Loki Laufeyson', 'Pilot'),
    ('Harley Quinn', 'Flight Attendant');
    
-- Sample data for flight crew
INSERT INTO flight_crew (flight_id, crew_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5),
    (2, 6);
    
-- Sample data for users
INSERT INTO users (name, address, email, credit_card_number, ticket, lounge, news) VALUES
    ('Guest Account', '123 fake st', 'guestemail@example.com', '0001112223334445', FALSE, FALSE, FALSE),
    ('Mary Jane Watson', '456 Elm St, New York', 'mary.jane@example.com', '9876543210987654', TRUE, TRUE, TRUE),
    ('Bruce Wayne', '1007 Mountain Drive, Gotham', 'bruce.wayne@example.com', '1234567890123456', FALSE, FALSE, FALSE),
    ('Alfred Pennyworth', 'Wayne Manor, Gotham', 'alfred.pennyworth@example.com', '1111222233334444', FALSE, TRUE, FALSE),
    ('Lois Lane', '1938 Daily Planet, Metropolis', 'lois.lane@example.com', '5555666677778888', FALSE, TRUE, TRUE),
    ('Perry White', '1938 Daily Planet, Metropolis', 'perry.white@example.com', '9999888877776666', TRUE, TRUE, TRUE),
    ('J. Jonah Jameson', 'The Daily Bugle, New York', 'jj.jameson@example.com', '1212121212121212', TRUE, TRUE, FALSE),
    ('Lana Lang', '123 Lang Farm, Smallville', 'lana.lang@example.com', '3434343434343434', TRUE, TRUE, FALSE);    
    
-- Sample data for registered users
INSERT INTO memberships (user_id, password) VALUES
    (1, '123'),
    (2, '123'),
    (3, '123'),
    (7, '123');
    
-- Sample data for bookings
INSERT INTO bookings (user_id, flight_id, seat_id, cancellation_insurance, payment_amount, payment_datetime) VALUES
    (1, 1, 1, TRUE, 150.00, '2023-11-23 09:00:00'),
    (1, 2, 6, FALSE, 100.00, '2023-11-24 13:00:00'),
    (2, 1, 4, TRUE, 250.00, '2023-11-23 09:00:00'),
    (2, 2, 8, FALSE, 80.00, '2023-11-24 13:00:00');
