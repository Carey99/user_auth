require('dotenv').config(); //For storing MongoURI
const mongoose = require('mongoose');


class DB_Operations {
    constructor() {
        mongoose.connect(process.env.MONGODB_URI) //Connecting to DB

        //Define schema
        const UserSchema = new mongoose.Schema({
            username:  { type: String, required: true, unique: true },
            password: { type: String, required: true},
            dat_created: { type: Date, default: Date.now }
        });

        //Create a model
       this.user = mongoose.model('User', UserSchema, 'db_tut');
    }

    //Creating a new user function
    async creatingUser(userData) {
        try {
            const newUser = new this.user(userData);
            await newUser.save();

            console.log(newUser);
            return newUser
        } catch (err) {
            console.error('Creation failed', err.message);
            throw err
        }
        
    }

    //checks if a user exists in our database
    async findUser({ username }) {
        try {
            console.log('Querying for username:', username); // Debugging line
            const user = await this.user.findOne({ username });
            console.log('Query result:', user); // Debugging line
            return user;
        } catch (err) {
            console.error('Error finding user:', err.message);
            throw err;
        }
    }

    //Deletes user
    async DeleteUser(username) {
        return await this.user.deleteOne({ username }); // Ensure UserModel is your Mongoose model
    }
    

}

module.exports =  DB_Operations
