


// import styles from "./individualEvent.module.css";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import React, { useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet';

// const SoloEvents = () => {
  
  

//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [resStatus, setResponse] = useState("");
//   const [pid,setPid]=useState("")
//   const [email,setEmail]=useState("")

//   // Fetch all the individual events and display them
//   const fetchEvents = async () => {
//     try {
//       const response = await axios.post("/api/events/getSoloEvents", { withCredentials: true });
//       setEvents(response.data);
//       console.log(response.data);
//     } catch (error) {
//       setError("Failed to fetch events");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // Get participated events and set checkboxes for already participated events
//   async function getParticipatedEvents() {
//     try {
      
//       const response = await axios.post("/api/events/individualParticipation", {
//         withCredentials: true
//       });
     
//       setEmail(response.data.data.email);
//       setPid(response.data.pid.pid)
//       console.log("already participated:", response.data.data.events);
//       setSelectedOptions(response.data.data.events); // Set checkbox if the user already participated
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     getParticipatedEvents();
//   }, []);

//     //clear messgae after 10 sec

//     useEffect(() => {
//       let timer;
//       if (resStatus) {
//         timer = setTimeout(() => {
//           setResponse('');
//         }, 10000); // 20 seconds
//       }
//       return () => clearTimeout(timer); // Cleanup the timer on unmount or when errorMessage changes
//     }, [resStatus]);

//   // Handle checkbox change
//   const handleCheckboxChange = (event) => {
//     const value = event.target.value;
//     setSelectedOptions((prevSelected) =>
//       prevSelected.includes(value)
//         ? prevSelected.filter((option) => option !== value)
//         : [...prevSelected, value]
//     );
//   };

//   // Save selected events to the database
//   async function saveIndividualEvents() {
//     try {
//       const response = await axios.post("/api/events/saveSoloEvents", {
//         data: selectedOptions
//       }, { withCredentials: true });

//       console.log(response.data);
//       setResponse(response.data.message);

    
      

//     } catch (error) {
//       console.log(error);
//       setResponse(error.response.data.message);
//     }
//   }

//   const handleSubmit = async () => {
//     await saveIndividualEvents();
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;




//   return (
//     <div className={styles.wrapper}>
//         <Helmet>
//                 <title>Solo Events</title>
              
//             </Helmet>
//       <h1 className={styles.heading}>Solo Events</h1>
//       <table className={styles.infoTable}>
//         <tbody>
//           <tr>
//             <td>Email</td>
//             <td>{email}</td>
//           </tr>
//           <tr>
//             <td>PID</td>
//             <td>{pid}</td>
//           </tr>
//         </tbody>
//       </table>
//       <div className={styles.eventsSection}>
//         <div id={styles.note}>Note:-Check the checkboxes to participate in Solo Events<br/>
//         If you want to edit uncheck and save again.
//         </div>
//         <div className={styles.cardsWrapper}>
//           {events.map((event, index) => (
//             <div key={index} className={styles.card}>
//               <input
//                 type="checkbox"
//                 id={`option${index}`}
//                 name="options"
//                 value={event.event}
//                 checked={selectedOptions.includes(event.event)}
//                 onChange={handleCheckboxChange}
//                 disabled={event.halt === 1} 
//                 className={styles.checkbox}
//               />
              
//               <label htmlFor={`option${index}`} className={styles.label}>
//                 {event.event}
//               </label>
//               {event.halt === 1 && <div className={styles.closed}>Registration Closed*</div>} 
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={styles.errorStatus}>{resStatus}</div>
//       <button className={styles.submitButton} onClick={handleSubmit}>
//         Save
//       </button>
//     </div>
//   );
// };

// export default SoloEvents;



import styles from "./individualEvent.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const SoloEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [resStatus, setResponse] = useState("");
  const [pid, setPid] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false); // State for saving

  // Fetch all the individual events and display them
  const fetchEvents = async () => {
    try {
      const response = await axios.post("/api/events/getSoloEvents", { withCredentials: true });
      setEvents(response.data);
      console.log(response.data);
    } catch (error) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Get participated events and set checkboxes for already participated events
  async function getParticipatedEvents() {
    try {
      const response = await axios.post("/api/events/individualParticipation", {
        withCredentials: true
      });
      setEmail(response.data.data.email);
      setPid(response.data.pid.pid);
      console.log("already participated:", response.data.data.events);
      setSelectedOptions(response.data.data.events); // Set checkbox if the user already participated
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getParticipatedEvents();
  }, []);

  // Clear message after 10 sec
  useEffect(() => {
    let timer;
    if (resStatus) {
      timer = setTimeout(() => {
        setResponse('');
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer); // Cleanup the timer on unmount or when resStatus changes
  }, [resStatus]);

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((option) => option !== value)
        : [...prevSelected, value]
    );
  };

  // Save selected events to the database
  async function saveIndividualEvents() {
    try {
      setSaving(true); // Set saving to true when saving starts
      const response = await axios.post("/api/events/saveSoloEvents", {
        data: selectedOptions
      }, { withCredentials: true });

      console.log(response.data);
      setResponse(response.data.message);
    } catch (error) {
      console.log(error);
      setResponse(error.response.data.message);
    } finally {
      setSaving(false); // Set saving to false when the request is completed
    }
  }

  const handleSubmit = async () => {
    await saveIndividualEvents();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Solo Events</title>
      </Helmet>
      <h1 className={styles.heading}>Solo Events</h1>
      <table className={styles.infoTable}>
        <tbody>
          <tr>
            <td>Email</td>
            <td>{email}</td>
          </tr>
          <tr>
            <td>PID</td>
            <td>{pid}</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.eventsSection}>
        <div id={styles.note}>
          Note: Check the checkboxes to participate in Solo Events<br />
          If you want to edit, uncheck and save again.
        </div>
        <div className={styles.cardsWrapper}>
          {events.map((event, index) => (
            <div key={index} className={styles.card}>
              <input
                type="checkbox"
                id={`option${index}`}
                name="options"
                value={event.event}
                checked={selectedOptions.includes(event.event)}
                onChange={ handleCheckboxChange}
                disabled={event.halt === 1}
                className={styles.checkbox}
              />
              
              <label htmlFor={`option${index}`} className={styles.label}>
                {event.event}
              </label>
              {event.halt === 1 && <div className={styles.closed}>Registration Closed*</div>}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.errorStatus}>{resStatus}</div>
      <button className={styles.submitButton} onClick={handleSubmit} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default SoloEvents;