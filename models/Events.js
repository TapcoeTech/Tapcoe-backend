import mongoose from 'mongoose';


const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
       
    },
    description: {
        type: String,
     
    },
    startDate: {
        type: Date,
       
    },
    endDate: {
        type: Date,
       
    },
    name: { type: String, required: true },
    phone: { type: String,required: true },
   
    designation: { type: String,required: true },
    eventType:{type:String,require:true},
   
    location: {
        type: String,
        
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    Approved:{
        type:Boolean,
        default:false
    }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
