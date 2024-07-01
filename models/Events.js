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
    eventImage:{type:String,required:true},
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
    Approved:{
        type:Boolean,
        default:false
    },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        image: { 
            imageUrl: {
                type:String
            } ,
            uuid:{
                type:String
            }
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    ], // Adding image URL for each participant
    }],

  
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
