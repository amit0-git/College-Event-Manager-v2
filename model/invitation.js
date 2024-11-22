const mongoose = require('mongoose');


const invitationSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    
    },
    pid: {
        type: String,
        required: true
    },
    tid: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    team_name: {
        type: String,
        required: true
    },

    status: {
        type: Number,
        required: true,
        default: 0
    }

});





module.exports = mongoose.model('invitation', invitationSchema, 'invitation');