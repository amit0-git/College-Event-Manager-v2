const mongoose = require('mongoose');

//COUNT SCHEMA



const teamSchema = new mongoose.Schema({

    tid: {
        type: String,
        
        
    },

    name: {

        type: String,
        
    },


    event: {
        type: String,
        
    },

    temp_members: {
        type: [String],
       
    },
    
    actual_members: {
        type: [String],
        
    },
    
    created_by: {
        type: String,
        
    }

});





module.exports = mongoose.model('teamBackup', teamSchema, 'teamBackup');