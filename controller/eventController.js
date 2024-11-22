const User = require("../model/user")
const bcrypt = require("bcrypt")
const axios = require('axios');
const jwt = require("jsonwebtoken")
//otp model
const OTP = require("../model/otp")
const USER = require("../model/user")
const STUDENT = require("../model/studentRegister")
const COUNT = require("../model/count")
const EVENT = require("../model/events")
const INDIVIDUAL = require("../model/individualEvent")
const TEAM = require("../model/teamEvent")
const INVITATION = require("../model/invitation");
const TEAM_BACKUP = require("../model/teamBackup");



//get solo events list
exports.getSoloEvents = async (req, res) => {
    //get solo events
    try {
        const events = await EVENT.find({ type: "Solo" })
        res.status(200).json(events)

    }
    catch (error) {
        console.log(error)
        //return error
        res.status(500).json({ message: 'Server error' });
    }
}



//get team events list
exports.getTeamEvents = async (req, res) => {
    //get solo events
    try {
        const events = await EVENT.find({ type: "Team" })
        console.log(events);
        res.status(200).json(events)

    }
    catch (error) {
        console.log(error)
        //return error
        res.status(500).json({ message: 'Server error' });
    }
}





async function fetchDetailsFromPid(pid) {
    try {
        const data = await STUDENT.findOne({ pid: pid })
        if (!data) {
            return null;
        }

        return data;
    }

    catch (error) {
        console.log(error)
        return null
    }
}




//maxEventParticipation condition  for solo event 
async function maxEventParticipation(email, sEvent) {

    try {

        const student = await STUDENT.findOne({ email: email })

        ///pid
        const pid = student.pid

        //get single events 
        //const soloEvents1 = await INDIVIDUAL.findOne({ email: email}, { events: 1 })

        const soloEvents = sEvent.length

        //get team events

        const team = await TEAM.countDocuments({ actual_members: pid })



        console.log(soloEvents, team)
        //condition for SRMS CET COLLEGE
        //total 5 events 
        if (student.college === "SRMS CET") {

            if (soloEvents + team <= 2) {
                return true
            }
            else {
                //return response
                return false
            }

        }



        //for other colleges 
        //total 7 events
        else {

            if (soloEvents + team < 7) {
                return true
            }
            else {
                //return response
                return false
            }
        }
    }


    catch (error) {
        console.log(error)
    }
}



//save solo events 

exports.saveSoloEvents = async (req, res) => {
    try {
        
        
        const email = req.email


        //get the data from the request body 
        const data = req.body.data

        console.log("events: ", data)

        //user participation verify logic 
        const userParticipation = await maxEventParticipation(email, data);

        if (!userParticipation) {
            return res.status(401).json({ message: 'You have exceeded the maximum number of events' })
        }




        //save the sata in individual events
        // Find the existing record for the user
        const existingEvent = await INDIVIDUAL.findOne({ email: email });

        if (existingEvent) {
            // Update the existing record with the new data
            existingEvent.events = data; // You can merge or replace as needed
            await existingEvent.save();
            res.status(200).json({ message: 'Updated successfully' });

        } else {
            // Optionally, create a new record if it doesn't exist
            const individualEvent = new INDIVIDUAL({
                email: email,
                events: data
            });
            await individualEvent.save();
            res.status(200).json({ message: 'Saved successfully' });
        }

        console.log(data)

    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" })
    }
}







//maxEventParticipation condition  for solo event 
async function maxEventParticipationTeam(pid1) {

    try {

        const student = await STUDENT.findOne({ pid: pid1 })

        ///pid
        //const pid = student.pid
        const email = student.email



        //get single events 
        const soloEvents1 = await INDIVIDUAL.findOne({ email: email }, { events: 1 })
        var soloEvents = 0;
        if (soloEvents1) {
            soloEvents = soloEvents1.events.length
        }

        console.log("Team Solo", soloEvents1)
        //get team events

        const team = await TEAM.countDocuments({ actual_members: pid1 })



        console.log("Team Solo", soloEvents, team)
        //condition for SRMS CET COLLEGE
        //total 5 events 
        if (student.college === "SRMS CET") {

            if (soloEvents + team < 2) {
                return true
            }
            else {
                //return response
                return false
            }

        }



        //for other colleges 
        //total 7 events
        else {

            if (soloEvents + team < 7) {
                return true
            }
            else {
                //return response
                return false
            }
        }
    }


    catch (error) {
        console.log(error)
    }
}



//chk pid and return 
exports.checkPid = async (req, res) => {
    try {

        const pid1 = req.body.pid;
        const data = await STUDENT.findOne({ pid: pid1 });
        if (!data) {
            return res.status(404).json({ message: 'PID not found!' });
        }
        console.log(data)


        //check the maximum participation condition for pid 
        const maxCondition = await maxEventParticipationTeam(pid1);


        if (!maxCondition) {
            return res.status(400).json({ message: 'Maximum participation condition exceeded!' });
        }



        res.status(200).json({ message: 'Student found', data: data });


    }
    catch (error) {
        console.log(error);
    }
}

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



//async to send invitation to the pids 
async function sendInvitation(email, pid, tid1, team_name, event1) {
    try {
        //send email to the student
        const invitation = new INVITATION({
            email: email,
            pid: pid,
            tid: tid1,
            team_name: team_name,
            event: event1
        })
        const result = await invitation.save()

        return result;
    }

    catch (error) {
        console.log(error)

    }
}



//save team events

exports.saveTeam = async (req, res) => {
    try {

     

        


        const email = req.email;
        const { name, event, members } = req.body;

        //check for same team name event

        const teamName = await TEAM.findOne({ name: name })
        if (teamName) {
            return res.status(400).json({ message: 'Team name already exists' });
        }



        //chk maximum team participation for any team event
        const event2 = await EVENT.findOne({ event: event });
        const maxC = event2.limit

        if (members.length > maxC) {
            return res.status(400).json({ message: 'Maximum team participation reached' });
        }






        //chk if pid is already registered with the same team event

        const foundPids = []; // Array to store found pids

        const promises = members.map(async (member) => {
            const result = await TEAM.findOne({
                event: event,
                actual_members: { $in: [member] }  // Use bracket notation for dynamic field name
            });

            // Check if the result contains the member (pid) and if it exists in actual_members
            if (result && members.includes(member)) {
                foundPids.push(member); // Store the found pid
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        //if the pids exists in the same event then return the pids in the response 
        const pidsString = foundPids.join(', ');
        if (foundPids.length > 0) {
            return res.status(400).json({ message: `Pids ${pidsString} are already registered for ${event}` });

        }



        //get the last count from the count table to get the tid 

        const lastCount = await getLastCount();
        console.log("Last Count", lastCount)

        const tid = "T" + Number(lastCount + 1)

        //save the data in the  team database 
        const team = new TEAM({
            tid: tid,
            name: name,
            event: event,
            temp_members: members,
            created_by: email
        })

        //save in the database

        await team.save();






        //after saving the team update Invitation table with the tid and email of 
        //the user who created the team and the email of the members who joined the team


        const tid1 = team.tid;
        const team_name = team.name;
        const event1 = team.event;
        console.log(members)
        console.log(typeof (members))

        for (var i = 0; i < Object.keys(members).length; i++) {
            const pid_data = await fetchDetailsFromPid(members[i]);
            const email = pid_data.email;  //email of invitation user
            const pid = pid_data.pid;

            const send_invi = await sendInvitation(email, pid, tid1, team_name, event1);


        }




        //return success status

        res.status(201).json({ message: "Team Saved Successfully!" })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!" });
    }
}


exports.getInvitation = async (req, res) => {
    try {
        //security handle latr 

       

        const emailToken = req.email;

        console.log(emailToken)
        const data = await INVITATION.find({ email: emailToken });

        if (!data) {
            return res.status(404).json({ message: "No Invitation Found!" });
        }
        console.log(data)
        res.status(200).json(data);

    }
    catch (error) {
        console.log(error);

    }
}


//add verified memeber to the database when the user accepts the 
//invitation
//delete the record from the invitation table

exports.addVerifiedMember = async (req, res) => {
    try {
        //verifivcattion logic above

        const tid = req.body.tid;
        const pid = req.body.pid;

        //find tid 
        const team = await TEAM.findOne({ tid: tid })
        if (!team) {
            return res.status(404).json({ message: "Team Not Found!" });
        }


        //chk whether pid already exist in the actual members

        const actualMember = await TEAM.findOne({
            tid: tid,
            actual_members: { $in: [pid] }
        });
        console.log(actualMember)

        if (actualMember) {
            //if the pid is already in the actual members array
            return res.status(404).json({ message: "PID already in the team" });

        }

        //add pid in the verified members 
        // Assuming team has a verifiedMembers array
        team.actual_members.push(pid);

        // Save the updated team object
        await team.save();



        //delete the record from the invitation table
        const result = await INVITATION.deleteOne({ tid: tid, pid: pid });
        if (result.deletedCount === 0) {
            // If no documents were deleted, return a message
            return res.status(404).json({ message: 'No member found with the provided TID and PID.' });
        }

        res.status(200).json({ message: "Member Added Successfully!" });



    }
    catch (error) {
        console.log(error);
        //server erro 
        res.status(500).json({ message: "Server Error!" })
    }
}



//delete invitation member from the Invitation

exports.delInvitation = async (req, res) => {
    try {
        //verification logic

        const pid = req.body.pid;
        const tid = req.body.tid;

        //chk tid exists
        // Delete the member with the specified tid and pid
        const result = await INVITATION.deleteOne({ tid: tid, pid: pid });
        console.log(result)
        if (result.deletedCount === 0) {
            // If no documents were deleted, return a message
            return res.status(404).json({ message: 'No member found with the provided TID and PID.' });
        }

        // Return success message
        return res.status(200).json({ message: 'Invitation Rejected' });


    }

    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}


//function to delete the team by the team leader 
exports.delTeam = async (req, res) => {
    try {

        //verify email with token email
      
        const tid = req.body.tid;

        

        const emailToken = req.email;

        //get the email from team leader from the tid
        const teamLeaderEmail = await TEAM.findOne({ tid: tid })

        if (!teamLeaderEmail) {
            return res.status(404).json({ message: "No team found with the provided TID" });
        }
        const email1 = teamLeaderEmail.created_by;


        console.log("edede", email1);
        //if the record is deleted by the team leader then only delete

        if (email1 !== emailToken) {
            return res.status(404).json({ message: "Team can be deleted by Team Leader only" });
        }


        //before deleting the table save deleted record in the backup table
        const backup = new TEAM_BACKUP({
            tid: teamLeaderEmail.tid,
            name: teamLeaderEmail.name,
            event: teamLeaderEmail.event,
            temp_members: teamLeaderEmail.temp_members,
            actual_members: teamLeaderEmail.actual_members,
            created_by: teamLeaderEmail.created_by,

        });

        //save in the backup table 

        await backup.save();

        //else delete the team
        const result = await TEAM.deleteOne({ tid: tid });

        console.log(result)
        //if the team is deleted then send the response
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No team found with the provided TID" });

        }

        return res.status(200).json({ message: "Team Deleted Successfully" });

    }


    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}



//get the indiviaul and team events participated by student

exports.individualParticipation = async (req, res) => {
    try {


     

        const emailToken = req.email;

        const response = await INDIVIDUAL.findOne({ email: emailToken });

        if (!response) {
            return res.status(404).json({ message: 'No individual found with the provided email.' });
        }

        //get the pid from the STUDENT table using email
        const pid = await STUDENT.findOne({ email: emailToken }).select('pid')

        //retrn the response
        res.status(200).json({ data: response, pid: pid })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })

    }
}


exports.teamParticipation = async (req, res) => {
    try {

        const emailToken = req.email;
        //find pid from the email from student collectiond 

        const pidData = await STUDENT.findOne({ email: emailToken }, { pid: 1 });
        if (!pidData) {
            return res.status(404).json({ message: 'No student found with the provided email.' })
        }


        //get the pid
        const pid = pidData.pid


        const response = await TEAM.find({ actual_members: { $in: [pid] } });

        if (!response) {
            return res.status(404).json({ message: 'No individual found with the provided email.' });
        }
        console.log(response)

        //retrn the response
        res.status(200).json({ data: response })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })

    }
}