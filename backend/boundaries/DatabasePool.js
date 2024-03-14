const mysql = require('mysql2/promise');

/**
 * DatabasePool is a singleton class that manages a connection pool to a MySQL database.
 * It ensures that only one instance of the pool is created and shared across the application.
 */
class DatabasePool {
    // Static private variable holds the single instance of the class
    // Using # for private member was not supported, _ is being used to simulate private member
    static _instance = null;

    // Private constructor prevents the creation of additional instances
    // Using # for private constructor was not supported. The constructor returns instance when initialized
    constructor(pool) {
        if (!DatabasePool._instance) {
            this.pool = pool;
            DatabasePool._instance = this;
        } else {
            return DatabasePool._instance;
        }
    }

    // Public method returns the singleton instance of the class
    // If instance doesn't already exist it calls the constructor
    static async getInstance() {
        if (!this._instance) {
            new DatabasePool(await mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'flight_reservation_db',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            }));
        }
        return this._instance;
    }

    // Public methods for querying operations
    query(sql, params) {
        return this.pool.query(sql, params);
    }

    // Public methods for execution operations
    execute(sql, params) {
        return this.pool.execute(sql, params);
    }
}

module.exports = DatabasePool;