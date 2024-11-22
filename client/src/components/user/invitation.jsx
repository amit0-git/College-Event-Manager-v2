// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from './invitation.module.css';
// import { Helmet } from 'react-helmet';
// const TeamInvitation = () => {




//   const [invitations, setInvitations] = useState([]); // State to hold invitation data
//   const [status, setStatus] = useState('');
//   const [email, setEmail] = useState("")

//   const handleAccept = async (tid, pid) => {
//     try {
//       const response = await axios.post('/api/events/addVerifiedMember', {
//         tid: tid,
//         pid: pid,
//       }, { withCredentials: true });

//       setStatus(response.data.message);
//     } catch (error) {
//       setStatus(error.response.data.message);
//     }
//   };

//   const handleReject = async (tid, pid) => {
//     try {
//       const response = await axios.post('/api/events/delInvitation', {
//         pid: pid,
//         tid: tid,
//       }, { withCredentials: true });

//       setStatus(response.data.message);
//     } catch (error) {
//       setStatus(error.response.data.message);
//     }
//   };

//   // Load invitation data
//   const getInvitation = async () => {
//     try {
//       const response = await axios.post('/api/events/getInvitation',

//         { withCredentials: true });

//       console.log("Invitations: ", response.data)
//       setEmail(response.data[0].email)
//       setInvitations(response.data);

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getInvitation();
//   }, []);


//   //clear the errror message after 10 sec


//   useEffect(() => {
//     let timer;
//     if (status) {
//       timer = setTimeout(() => {
//         setStatus('');
//       }, 10000); // 20 seconds
//     }
//     return () => clearTimeout(timer); // Cleanup the timer on unmount or when errorMessage changes
//   }, [status]);





//   return (
//     <div className={styles.invitationWrap}>
//         <Helmet>
//                 <title>Invitation</title>
              
//             </Helmet>
//       <div className={styles.heading}>Team Invitation
//         <div className={styles.email}>Email: {email}</div>
//       </div>

     
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>TID</th>
//             <th>Event</th>
//             <th>Team Name</th>
//             <th>Accept</th>
//             <th>Reject</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invitations.length > 0 ? (
//             invitations.map((invitation) => (
//               <tr key={invitation.tid}>
//                 <td>{invitation.tid}</td>
//                 <td>{invitation.event}</td>
//                 <td>{invitation.team_name}</td>
//                 <td>
//                   <button
//                     className={styles.acceptButton}
//                     onClick={() => handleAccept(invitation.tid, invitation.pid)}
//                   >
//                     Accept
//                   </button>
//                 </td>
//                 <td>
//                   <button
//                     className={styles.rejectButton}
//                     onClick={() => handleReject(invitation.tid, invitation.pid)}
//                   >
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5">No invitations found.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {status && <div className={styles.statusMessage}>{status}</div>}
//     </div>
//   );
// };

// export default TeamInvitation;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './invitation.module.css';
import { Helmet } from 'react-helmet';

const TeamInvitation = () => {
  const [invitations, setInvitations] = useState([]); // State to hold invitation data
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState({ accept: {}, reject: {} }); // State for loading on buttons

  const handleAccept = async (tid, pid) => {
    setLoading(prev => ({ ...prev, accept: { [tid]: true } })); // Set loading for accept button
    try {
      const response = await axios.post('/api/events/addVerifiedMember', {
        tid: tid,
        pid: pid,
      }, { withCredentials: true });

      setStatus(response.data.message);
      getInvitation(); // Refresh invitations after accepting
    } catch (error) {
      setStatus(error.response.data.message);
    } finally {
      setLoading(prev => ({ ...prev, accept: { [tid]: false } })); // Reset loading for accept button
    }
  };

  const handleReject = async (tid, pid) => {
    setLoading(prev => ({ ...prev, reject: { [tid]: true } })); // Set loading for reject button
    try {
      const response = await axios.post('/api/events/delInvitation', {
        pid: pid,
        tid: tid,
      }, { withCredentials: true });

      setStatus(response.data.message);
      getInvitation(); // Refresh invitations after rejecting
    } catch (error) {
      setStatus(error.response.data.message);
    } finally {
      setLoading(prev => ({ ...prev, reject: { [tid]: false } })); // Reset loading for reject button
    }
  };

  // Load invitation data
  const getInvitation = async () => {
    try {
      const response = await axios.post('/api/events/getInvitation', { withCredentials: true });
      console.log("Invitations: ", response.data);
      setEmail(response.data[0].email);
      setInvitations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInvitation();
  }, []);

  // Clear the error message after 10 sec
  useEffect(() => {
    let timer;
    if (status) {
      timer = setTimeout(() => {
        setStatus('');
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer); // Cleanup the timer on unmount or when status changes
  }, [status]);

  return (
    <div className={styles.invitationWrap}>
      <Helmet>
        <title>Invitation</title>
      </Helmet>
      <div className={styles.heading}>Team Invitation
        <div className={styles.email}>Email: {email}</div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>TID</th>
            <th>Event</th>
            <th>Team Name</th>
            <th>Accept</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <tr key={invitation.tid}>
                <td>{invitation.tid}</td>
                <td>{invitation.event}</td>
                <td>{invitation.team_name}</td>
                <td>
                  <button
                    className={styles.acceptButton}
                    onClick={() => handleAccept(invitation.tid, invitation.pid)}
                    disabled={loading.accept[invitation.tid]} // Disable if loading
                  >
                    {loading.accept[invitation.tid] ? 'Accepting...' : 'Accept'}
                  </button>
                </td>
                <td>
                  <button
                    className={styles.rejectButton}
                    onClick={() => handleReject(invitation.tid, invitation.pid)}
                    disabled={loading.reject[invitation.tid]} // Disable if loading
                  >
                    {loading.reject[invitation.tid] ? 'Rejecting...' : 'Reject'}
                  </button> </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No invitations found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {status && <div className={styles.statusMessage}>{status}</div>}
    </div>
  );
};

export default TeamInvitation;