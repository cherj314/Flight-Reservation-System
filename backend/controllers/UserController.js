const DatabasePool = require("../boundaries/DatabasePool");
const BaseController = require('./BaseController'); // Adjust path as necessary
const User = require('../entities/User');

class UserController extends BaseController {
    constructor() {
        super(new User());
    }

    setRoutes() {
        this.setGet('/', this.getAllRegisteredUsers);
        this.setUpdate('/up/:userId', this.modify.bind(this));
        this.setGet('/:id', this.getByIdImmediately.bind(this));
        this.setPost('/add', this.add.bind(this));
        this.setPost('/login', this.loginUser);
        this.setPost('/register', this.registerUser);
        this.setPost('/verify', this.verifyEmail);
        this.setDelete('/remove/:id', this.remove.bind(this));
    }



    async getAllRegisteredUsers(req, res) {
        const db = await DatabasePool.getInstance();
        const [userIds] = await db.query('SELECT user_id FROM memberships');

        const users = await Promise.all(userIds.map(async (idObj) => {
            const [user] = await db.query('SELECT * FROM users WHERE user_id = ?', [idObj.user_id]);
            return user[0];
        }));

        res.json(users);
    }


    async loginUser(req, res) {
        const { email, password } = req.body;
        const db = await DatabasePool.getInstance();

        // Combined query to check email in the users table and verify the password in memberships
        const [result] = await db.query(
            'SELECT * FROM users u ' +
            'JOIN memberships m ON u.user_id = m.user_id ' +
            'WHERE u.email = ? AND m.password = ?',
            [email, password]
        );

        if (result.length === 0) {
            res.status(401).send('Invalid credentials');
        } else {
            // Load user
            let user = new User().setInfo(result[0]);
            //const [rows] = await db.query(`SELECT * FROM bookings WHERE user_id = ?`, [user.user_id]);
            //user.setBookings(rows);

            res.json(user);
        }
    }

    async verifyEmail(req, res) {
        const { email } = req.body; // Get the email from the request body
        const db = await DatabasePool.getInstance();

        const [result] = await db.query(`
        SELECT 1
        FROM users u
        INNER JOIN memberships m ON u.user_id = m.user_id
        WHERE u.email = ?
        LIMIT 1
    `, [email]);

        if (result.length > 0) {
            res.json({ exists: true }); // Email is already registered
        } else {
            res.json({ exists: false }); // Email is not registered
        }
    }


    async registerUser(req, res) {
        const { name, address, email, credit_card_number, password } = req.body;
        const db = await DatabasePool.getInstance();

        const insertUserResult = await db.execute(
            'INSERT INTO users (name, address, email, credit_card_number, ticket, lounge, news) VALUES (?, ?, ?, ?, FALSE, FALSE, FALSE)',
            [name, address, email, credit_card_number]
        );

        const user_id = insertUserResult[0].insertId;
        await db.execute('INSERT INTO memberships (user_id, password) VALUES (?, ?)', [user_id, password]);

        res.status(201).json({ user_id, name, email, address, credit_card_number, ticket: 0, lounge: 0, news: 0});
    }
}

module.exports = UserController;
