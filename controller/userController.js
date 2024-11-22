const User = require("../model/user")
const bcrypt = require("bcrypt")
const axios = require('axios');
const jwt = require("jsonwebtoken")
//otp model
const OTP = require("../model/otp")
const USER = require("../model/user")
const STUDENT = require("../model/studentRegister")
const COUNT = require("../model/count")







//dend otp if time is more than 5 min
//nd no record for otp exists

// async function canSendOtp(email) {
//     try {
//         const emailExist = await OTP.findOne({ email: email });
//         if (!emailExist) {
//             // can send otp
//             return true;
//         } else {
//             // check if 5 min passed for otp
//             const otpduration = 5 * 60 * 1000; // 5 min in ms
//             const otpRecord = await OTP.findOne({ email: email }, { time: 1 });
//             if (otpRecord && otpRecord.time) {
//                 const startTime = otpRecord.time;
//                 if ((Date.now() - startTime) >= otpduration) {
//                     // send otp
//                     return true;
//                 }
//             }

//             //if time  is less than 5 min dont send

//             return false;
//         }
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }


///function to send data to client using email

exports.getData = async (req, res) => {
    try {

     

        //verify email with token email
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        const emailToken = decoded.email;


        console.log(emailToken);

      

        //get data
        const data = await STUDENT.findOne({ email: emailToken });

        if (!data) {
            return res.status(404).json({ message: "Student not found" })
        }

        return res.status(200).json({ data: data });



    }

    catch (error) {
        console.log(error);

    }

}


//send otp to the user
// exports.sendOtp = async (req, res) => {
//     try {
//         const { email } = req.body;
//         console.log(email);

//         // Check if the otp can be sent
//         const otpStatus = await canSendOtp(email);
//         if (!otpStatus) {

//             // If the OTP has been sent recently, return a message
//             return res.status(400).json({ message: "You have already sent an OTP within 5 minutes." });
//         }


//         // Generate a new OTP (for example, a random 6-digit number)
//         const otp = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number

//         // Create or update the OTP record
//         const existingOtpRecord = await OTP.findOne({ email: email });
//         //update the old otp in the  database

//         const otpRecord = existingOtpRecord || new OTP({ email: email });

//         // Update the OTP and timestamp
//         otpRecord.otp = otp;
//         otpRecord.time = Date.now();

//         await otpRecord.save();

//         // Send the OTP to the user via email (implement your email sending logic here)
//         // Example: await sendEmail(email, otp);

//         return res.status(200).json({ message: "OTP sent to your email!" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };




//verify the captcha 
async function verifyCaptcha(captcha) {
    try {

        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: "6LfA1XMqAAAAANNoqMFYYW9rm8hGDI6zET9gr4HZ",
                response: captcha,
            },
        });

        return response.data; // Return the response from Google
    } catch (error) {
        console.error("Error verifying captcha:", error);
        return { success: false }; // Return false on error
    }
};


//user signup method
//1. check username already exists
//2. hash password 
//3. verify otp
//4. captcha verify
//5. create new user


exports.signup = async (req, res) => {

    const { email, password, otp, captchaValue } = await req.body;

    // console.log(captchaValue, email, otp, password)
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {

            return res.status(400).json({ message: 'User already exists' });
        }


        //otp verify
        const otpRecord = await OTP.findOne({ email: email });

        if (otpRecord && otpRecord.otp !== parseInt(otp)) {

            return res.status(400).json({ message: 'Invalid OTP' });

        }

        //captcha verify
        const captchaVerify = await verifyCaptcha(captchaValue);

        if (!captchaVerify.success) {
            return res.status(400).json({ message: 'Captcha verification failed.' });
        }







        // Hash the password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            role: "User"
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

};




//user login
//1. chk email exists
//2. compare hashed password with  original password
///3 verify captcha
//4. return token

exports.login = async (req, res) => {
    try {


        console.log("ck token:", req.cookies.token)


        const { email, password, captchaValue } = req.body;
        // console.log(email, password)
        const user = await USER.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        //verify captcha

        const captchaVerify = await verifyCaptcha(captchaValue);

        if (!captchaVerify.success) {
            return res.status(400).json({ message: 'Captcha verification failed.' });
        }

        //generate token
        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY,
            {
                expiresIn: '1h'
            });

        //set the http cookie after successfull login


        // Send token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: false, // Prevents access to cookie from JS (for security)
            secure: false, // Use 'true' in production (HTTPS)

            maxAge: 3600 * 1000 // 1 hour expiration
        });

        res.status(200).json({ token, email: user.email });


    }
    catch (error) {

        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};




//function to get the last count of the count 
async function getLastCount() {
    //count number of students
    try {
        // Count the number of students
        const count1 = await COUNT.findOne({ name: "lastCount" })

        if (count1) {
            const lastVal = count1.count;
            return lastVal
        }

        else {
            return false;
        }


    } catch (err) {
        console.error(err);
        throw err;
    }
}

// user register
//1. chk wheter user already registered

exports.register = async (req, res) => {
    try {


        const token = req.cookies.token;
        const tid = req.body.tid;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        const emailToken = decoded.email;


        //get last count of count collection
        const lastCount = await getLastCount();
        console.log("Last Count", lastCount)

        const pid = "P" + Number(lastCount + 1)
        //trim data to remove spaces
      

        const email = emailToken;
        const rollno = req.body.rollno.trim()
        const name = req.body.name.trim()
        const phone = req.body.phone.trim()
        const address = req.body.address.trim();
        const gender=req.body.gender
        const accomodation=req.body.accomodation
        const college = req.body.college
        const branch = req.body.branch
        const year = req.body.year


        console.log(email, pid, rollno, name, phone, address, college, branch, year);


        //chk user already registered then update the user 

        const alreadyRegistered = await STUDENT.findOne({ email: email })
        //if the user is editing its details
        if (alreadyRegistered  && email===emailToken) {

            //if the user is already registered then update the student
            const updatedStudent = await STUDENT.findOneAndUpdate(
                { email: email }, // Filter by email
                {
                    rollno: rollno,
                    name: name,
                    phone: phone,
                    gender:gender,
                    accomodation:accomodation,
                    address: address,
                    college: college,
                    branch: branch,
                    year: year
                },
                { new: true, upsert: true } // Return the updated document and create if it doesn't exist
            );

            // Check if the update was successful
            if (updatedStudent) {
                console.log("Updated student:", updatedStudent);
                return res.status(200).json({ message: 'User  updated successfully.', data: updatedStudent });
            } else {
                return res.status(400).json({ message: 'Failed to update user.' });
            }
        }

        //chk for duplicate rollno



        


       
        




        //create new user
        const student = new STUDENT({
            pid: pid,
            email: email,
            rollno: rollno,
            name: name,
            gender:gender,
            accomodation:accomodation,
            phone: phone,
            address: address,
            college: college,
            branch: branch,
            year: year

        })
        //save user to db
        await student.save()
        console.log(student);
        res.status(201).json({ message: 'User created successfully.', data: student });


    }
    catch (error) {
        console.error("error",error);
        res.status(500).json({ message: 'Server error' });

    }
}



//logout functionalty
exports.logout=async(req,res)=>{
    try {
        //reset the cookie
        console.log("Logout ")
        res.clearCookie('token', {
            httpOnly: false, // Makes the cookie inaccessible to JavaScript
            secure: false, // Set to true in production for HTTPS
            
          });
          res.status(200).json({ message: 'Logged out successfully.' });

    }
    catch(error){

    }
}