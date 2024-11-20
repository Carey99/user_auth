const express = require('express');
const db_op = require('./mongooseInNode');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const app = express();
const db = new db_op();

//middlewares
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Adjust for specific origins if needed
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API for creating, authenticating, and managing users',
        },
        servers: [
            {
                url: 'https://user-auth-blush.vercel.app', // Deployed URL
                description: 'Production server',
            },
        ],
    },
    apis: ['./server.js'], // Path to the file containing Swagger comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
/**
 * @swagger
 * /userCreation:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with a hashed password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *       500:
 *         description: Error occurred while creating the user.
 */
app.post('/userCreation', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received data');

        // Hashing password
        const hashed_password = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashed_password);

        // Create a new user with the hashed password
        await db.creatingUser({ username, password: hashed_password });
        console.log('User created successfully');
        res.status(201).json({ message: 'Ok! it was successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error occurred!!' });
    }
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with a username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
app.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Finding user in db
        const user = await db.findUser({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Comparing the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Send JSON response indicating success
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user based on the username.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: No user with specified username found.
 *       500:
 *         description: Internal Server Error.
 */
app.delete('/deleteUser', async (req, res) => {
    try {
        const { username } = req.body;

        // Trigger the delete function in mongoosejs file
        const result = await db.DeleteUser(username);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No user with specified username found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Something went wrong!', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Serve home page
 *     description: Serves the static HTML file for the home page.
 *     responses:
 *       200:
 *         description: HTML file served successfully.
 */
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.listen(4000, () => {
    console.log(`Server running at http://localhost:${4000}`);
});
