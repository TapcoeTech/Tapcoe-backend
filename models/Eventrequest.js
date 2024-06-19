import mongoose from 'mongoose';
const EventrequestSchema = new mongoose.Schema({
    eventRequests: [
        {
            name: { type: String, required: true },
            phone: { type: String },
            company: { type: String },
            designation: { type: String },
            event: { type: String, required: true },
            email:{
                type:String,
                unique: false
            }
            // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
        }
    ]
});

export const Eventreq = mongoose.model('Eventreq', EventrequestSchema);
