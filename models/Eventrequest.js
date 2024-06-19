import mongoose from 'mongoose';

const Eventrequest = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
 
});

const Eventreq = mongoose.model('Eventreq', Eventrequest);

export default Eventreq;