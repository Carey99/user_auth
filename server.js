const express = require('express');
const db_op = require('./mongooseInNode');
const bodyParser =  require('body-parser');
const bcrypt =  require('bcrypt');
const path = require('path');
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

app.post('/userCreation',  async(req, res) => {
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
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error occurred!!' });
    }
});

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

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home.html')
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:${3000}`);
});