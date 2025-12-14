
const mongoose = require('mongoose');
require("dotenv").config();

const connect = () => { 
    mongoose.connect(process.env.MONGODB_URL,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then( () => {
    console.log('Connected to MongoDB');
}).catch( (error) => {
    console.log('error connecting to MongoDb', error);
})
}

module.exports = connect;


