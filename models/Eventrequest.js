import mongoose from 'mongoose';

const Eventrequest = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Assuming email should be unique
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    designation: {
        type: String
    },
    event: {
        type: String,
        required: true
    },
 
});

const Eventreq = mongoose.model('Eventreq', Eventrequest);

export default Eventreq;