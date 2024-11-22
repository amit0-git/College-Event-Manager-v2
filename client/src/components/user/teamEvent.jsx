
// import React, { useEffect, useState } from 'react';
// import axios from "axios";
// import { Helmet } from 'react-helmet';
// import styles from './teamEvent.module.css';

// const CreateTeam = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectEvent, setSelectEvent] = useState("");
//   const [events, setEvents] = useState([]);
//   const [teamName, setTeamName] = useState('');
//   const [pid, setPid] = useState('');

//   const [members, setMembers] = useState([]);
//   const [pids, setPids] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errorMessageLast, setErrorMessageLast] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false); // New state for button loading

//   // Get team events from the database
//   async function getTeamEvents() {
//     try {
//       const response = await axios.post("/api/events/getTeamEvents", { withCredentials: true });
//       setEvents(response.data);
//     } catch (error) {
//       setError("Failed to fetch events");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     getTeamEvents();
//   }, []);

//   // Check if PID exists
//   async function checkPID(pid) {
//     try {
//       const response = await axios.post("/api/events/checkPid", { pid: pid }, { withCredentials: true });
//       return response.data;
//     } catch (error) {
//       setErrorMessage(error.response.data.message);
//       return null;
//     }
//   }

//   const handleAddMember = async () => {
//     if (pid) {
//       const pidData = await checkPID(pid);
//       if (pidData) {
//         const memberExists = members.some(member => member.pid === pidData.data.pid);
//         if (memberExists) {
//           setErrorMessage('Member already exists in the team');
//         } else {
//           setMembers([...members, pidData.data]); // Add the new member
//           setPid('');
//         }
//       }
//     } else {
//       setErrorMessage('Please enter a PID');
//     }
//   };

//   const handleDeleteMember = (pidToDelete) => {
//     setMembers(members.filter(member => member.pid !== pidToDelete));
//   };

//   useEffect(() => {
//     if (members.length > 0) {
//       const updatedPids = members.map(member => member.pid);
//       setPids(updatedPids);
//     }
//   }, [members]);

//   // Save the team
//   const handleSubmit = async () => {
//     setIsSubmitting(true); // Start loading
//     try {
//       if (!teamName) {
//         setErrorMessageLast('Please enter a team name');
//         return;
//       }
//       if (members.length === 0) {
//         setErrorMessageLast('Please add members!');
//         return;
//       }
//       if (!selectEvent) {
//         setErrorMessageLast('Please select an event');
//         return;
//       }

//       const response = await axios.post("/api/events/saveTeam", {
//         name: teamName.trim(),
//         event: selectEvent,
//         members: pids
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }, { withCredentials: true });

//       const data = response.data;
//       setErrorMessageLast(data.message);
//     } catch (error) {
//       setErrorMessageLast(error.response.data.message);
//     } finally {
//       setIsSubmitting(false); // Stop loading after the response
//     }
//   };

//   // Effect to clear the error message after 10 seconds
//   useEffect(() => {
//     let timer;
//     if (errorMessage) {
//       timer = setTimeout(() => {
//         setErrorMessage('');
//       }, 10000); // 10 seconds
//     }
//     return () => clearTimeout(timer);
//   }, [errorMessage]);

//   useEffect(() => {
//     let timer;
//     if (errorMessageLast) {
//       timer = setTimeout(() => {
//         setErrorMessageLast('');
//       }, 10000); // 10 seconds
//     }
//     return () => clearTimeout(timer);
//   }, [errorMessageLast]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className={styles.teamWrapper}>
//       <Helmet>
//         <title>Team Events</title>
//       </Helmet>
//       <div className={styles.teamHeader}>Create Team</div>

//       <div className={styles.upper1}>
//         <table>
//           <tbody>
//             <tr>
//               <td>Create Team</td>
//               <td>{selectEvent}</td>
//             </tr>
//             <tr>
//               <td>Select Event</td>
//               <td>
//                 <select
//                   name="eventSelect"
//                   onChange={(e) => setSelectEvent(e.target.value)}
//                 >
//                   <option value="">Select an Event</option>
//                   {events.map((event, index) => (
//                     <option key={index} value={event.halt === 1 ? '' : event.event}>
//                       {event.halt === 1 ? event.event + '--Registration Closed' : event.event}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//             <tr>
//               <td>Team Name</td>
//               <td>
//                 <input
//                   type="text"
//                   name="team_name"
//                   value={teamName}
//                   onChange={(e) => setTeamName(e.target.value)}
//                   required
//                 />
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className={styles.upper2}>
//         <div className={styles.upperHead}>Add Members to Your Team</div>
//         <label htmlFor="">Add PID</label><br />
//         <input
//           type="text"
//           value={pid}
//           onChange={(e) => setPid(e.target.value)}
//           placeholder="PID"
//         /><br />
//         <button onClick={handleAddMember}>Add</button>

//         {errorMessage && <div className={styles.errorStatus}>{errorMessage}</div>}
//         <div className={styles.note}><span>Note:-</span>&nbsp;After Creating team Invitation will be sent to all PIDs <br /> Members will only be added in your team if they accept invite<br />
//           Check Invitation in invitation section
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>PID</th>
//               <th>Name</th>
//               <th>Branch</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {members.map((member, index) => (
//               <tr key={index}>
//                 <td>{member.pid}</td>
//                 <td>{member.name}</td>
//                 <td>{member.branch}</td>
//                 <td>
//                   <button onClick={() => handleDeleteMember(member.pid)} className={styles.deleteBtn}>X</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {errorMessageLast && <div className={styles.errorStatus}>{errorMessageLast}</div>}

//       <button onClick={handleSubmit} disabled={isSubmitting}>
//         {isSubmitting ? 'Saving...' : 'Create Team'}
//       </button>
//     </div>
//   );
// };

// export default CreateTeam;


import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Helmet } from 'react-helmet';
import styles from './teamEvent.module.css';

const CreateTeam = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectEvent, setSelectEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [pid, setPid] = useState('');

  const [members, setMembers] = useState([]);
  const [pids, setPids] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageLast, setErrorMessageLast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State for Create Team button loading
  const [isAdding, setIsAdding] = useState(false); // State for Add button loading

  // Get team events from the database
  async function getTeamEvents() {
    try {
      const response = await axios.post("/api/events/getTeamEvents", { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTeamEvents();
  }, []);

  // Check if PID exists
  async function checkPID(pid) {
    try {
      const response = await axios.post("/api/events/checkPid", { pid: pid }, { withCredentials: true });
      return response.data;
    } catch (error) {
      setErrorMessage(error.response.data.message);
      return null;
    }
  }

  const handleAddMember = async () => {
    if (pid) {
      setIsAdding(true); // Start loading for Add button
      const pidData = await checkPID(pid);
      if (pidData) {
        const memberExists = members.some(member => member.pid === pidData.data.pid);
        if (memberExists) {
          setErrorMessage('Member already exists in the team');
        } else {
          setMembers([...members, pidData.data]); // Add the new member
          setPid('');
        }
      }
      setIsAdding(false); // Stop loading after the check
    } else {
      setErrorMessage('Please enter a PID');
    }
  };

  const handleDeleteMember = (pidToDelete) => {
    setMembers(members.filter(member => member.pid !== pidToDelete));
  };

  useEffect(() => {
    if (members.length > 0) {
      const updatedPids = members.map(member => member.pid);
      setPids(updatedPids);
    }
  }, [members]);

  // Save the team
  const handleSubmit = async () => {
    setIsSubmitting(true); // Start loading for Create Team button
    try {
      if (!teamName) {
        setErrorMessageLast('Please enter a team name');
        return;
      }
      if (members.length === 0) {
        setErrorMessageLast('Please add members!');
        return;
      }
      if (!selectEvent) {
        setErrorMessageLast('Please select an event');
        return;
      }

      const response = await axios.post("/api/events/saveTeam", {
        name: teamName.trim(),
        event: selectEvent,
        members: pids
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }, { withCredentials: true });

      const data = response.data;
      setErrorMessageLast(data.message);
    } catch (error) {
      setErrorMessageLast(error.response.data.message);
    } finally {
      setIsSubmitting(false); // Stop loading after the response
    }
  };

  // Effect to clear the error message after 10 seconds
  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    let timer;
    if (errorMessageLast) {
      timer = setTimeout(() => {
        setErrorMessageLast('');
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [errorMessageLast]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.teamWrapper}>
      <Helmet>
        <title>Team Events</title>
      </Helmet>
      <div className={styles.teamHeader}>Create Team</div>

      <div className={styles.upper1}>
        <table>
          <tbody>
            <tr>
              <td>Create Team</td>
              <td>{selectEvent}</td>
            </tr>
            <tr>
              <td>Select Event</td>
              <td>
                <select
                  name="eventSelect"
                  onChange={(e) => setSelectEvent(e.target.value)}
                >
                  <option value="">Select an Event</option>
                  {events.map((event, index) => (
                    <option key={index} value={event.halt === 1 ? '' : event.event}>
                      {event.halt === 1 ? event.event + '--Registration Closed' : event.event}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Team Name</td>
              <td>
                <input
                  type="text"
                  name="team_name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.upper2}>
        <div className={styles.upperHead}>Add Members to Your Team</div>
        <label htmlFor="">Add PID</label><br />
        <input
          type="text"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          placeholder="PID"
        /><br />
        <button onClick={handleAddMember} disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add'}
        </button>

        {errorMessage && <div className={styles.errorStatus}>{errorMessage}</div>}
        <div className={styles.note}><span>Note:-</span>&nbsp;After Creating team Invitation will be sent to all PIDs <br /> Members will only be added in your team if they accept invite<br />
          Check Invitation in invitation section
        </div>
        <table>
          <thead>
            <tr>
              <th>PID</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td>{member.pid}</td>
                <td>{member.name}</td>
                <td>{member.branch}</td>
                <td>
                  <button onClick={() => handleDeleteMember(member.pid)} className={styles.deleteBtn}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errorMessageLast && <div className={styles.errorStatus}>{errorMessageLast}</div>}

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Create Team'}
      </button>
    </div>
  );
};

export default CreateTeam;