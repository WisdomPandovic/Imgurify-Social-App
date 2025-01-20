import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notification  ()  {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get('https://imgurif-api.onrender.com/api/notifications')
      .then((response) => {
        setNotifications(response.data.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }, []);
  console.log(setNotifications)
  return (
    <div>
      {/* <h1>Notifications</h1> */}
      <div >
        {notifications.map((notification) => (
          <div key={notification._id} >
            <div  className='notify'>
            <div>{notification.message}</div>
            <div> {new Date(notification.timestamp).toLocaleString()}</div> <hr></hr></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;