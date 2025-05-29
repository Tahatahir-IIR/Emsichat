const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    mail:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    pendingRequests: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    servers: {type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'  // Reference the Group model (your "server")
    }], default: [] }
});

// Export the model
module.exports = mongoose.model('User', userSchema);
