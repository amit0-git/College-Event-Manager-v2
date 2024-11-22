const express = require('express');

const eventController = require('../controller/eventController');
const jwt = require("jsonwebtoken");
const router = express.Router();



// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify the token
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        
        req.email = decoded.email;
        next(); 
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};


router.post('/getSoloEvents',verifyToken, eventController.getSoloEvents);
router.post('/saveSoloEvents', verifyToken, eventController.saveSoloEvents);
router.post('/getTeamEvents', verifyToken, eventController.getTeamEvents); 
router.post('/checkPid',verifyToken,  eventController.checkPid); 

router.post('/saveTeam',verifyToken,  eventController.saveTeam); 
router.post('/getInvitation',verifyToken,  eventController.getInvitation); 

router.post('/delInvitation',verifyToken,  eventController.delInvitation); 
router.post('/addVerifiedMember',verifyToken,  eventController.addVerifiedMember); 

router.post('/individualParticipation',verifyToken,  eventController.individualParticipation); 
router.post('/teamParticipation',verifyToken,  eventController.teamParticipation); 
router.post('/delTeam',verifyToken,  eventController.delTeam); 
module.exports = router;
