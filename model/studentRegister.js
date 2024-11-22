const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

// //COUNT SCHEMA
const Count = require("./count")

const registerSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    pid: {
        type: String,
        required: true,
        unique: true
    },
    rollno: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    accomodation: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,

    },
    address:{
        type:String,
        required:true   
    },
    college: {
        type: String,
        required: true
    }
    ,
    branch: {
        type: String,
        required: true
    },
    year:{
        type:Number,
        required:true
    },
   
});



registerSchema.pre("save", async function (next) {
    try {
        const prevCount = await Count.findOne({ name: "lastCount" });

        if (prevCount) {
            // Increment count if the document exists
            const val = prevCount.count + 1;

            try {
                const result = await Count.updateOne(
                    { name: "lastCount" }, // Match criteria
                    { $set: { count: val } } // Update values
                );

                if (result && result.modifiedCount === 1) {
                    console.log('Last Count Individual updated successfully');
                } else {
                    console.log('Last Count Individual not found or not updated');
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            // Create a new document if 'lastCount' document doesn't exist
            const cc = new Count({
                name: "lastCount",
                count: 1
            });

            await cc.save();
        }

        next(); // Call next after processing
    } catch (error) {
        console.log(error);
        next(error);
    }
});






module.exports = mongoose.model('students', registerSchema,'students');