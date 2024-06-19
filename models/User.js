import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleToken:{
type:String,
unique:true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
      
    }
    ,
    profileImg:{
        type:String,
      
    }
});

const User = mongoose.model('User', userSchema);

export default User;
