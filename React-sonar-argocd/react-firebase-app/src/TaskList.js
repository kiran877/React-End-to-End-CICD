import React, { useEffect, useState } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'; 
import './TaskList.css'; 
import calendarIcon from './images/calender-icon.png'; 
import { Menu, MenuItem, IconButton } from '@mui/material'; 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; 

const TaskList = () => {
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], completed: [] });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleMenuClick = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const fetchedTasks = { todo: [], inprogress: [], completed: [] };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if `data.status` is valid and matches a key in `fetchedTasks`
        if (data.status && fetchedTasks[data.status]) {
          fetchedTasks[data.status].push({ id: doc.id, ...data });
        } else {
          console.warn(`Invalid or missing status for task with ID: ${doc.id}`);
        }
      });

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedTaskId) {
      try {
        const taskDocRef = doc(db, 'tasks', selectedTaskId);
        await updateDoc(taskDocRef, { status: newStatus });
        await fetchTasks(); 
      } catch (error) {
        console.error('Error updating task status: ', error);
      }
    }
    handleMenuClose();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'low';
      case 'medium':
        return 'medium';
      case 'high':
        return 'high';
      default:
        return 'low';
    }
  };

  const formatPriority = (priority) => {
    if (priority) {
      return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    }
    return priority;
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  return (
    <div className="TaskList">
      <div className="TaskList-container">
        {['todo', 'inprogress', 'completed'].map((status) => (
          <div key={status} className={`TaskList-column ${status}`}>
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            {tasks[status].map((task) => (
              <div key={task.id} className={`TaskList-item ${status}`}>
                <div className={`TaskList-priority ${getPriorityClass(task.priority)}`}>
                  {formatPriority(task.priority)}
                </div>
                <div className="TaskList-content">
                  <div className="TaskList-title-description">
                    <div className="TaskList-title">
                      <h3>{task.title}</h3>
                      <IconButton onClick={(event) => handleMenuClick(event, task.id)}>
                        <ArrowDropDownIcon />
                      </IconButton>
                    </div>
                    <p>{task.description}</p>
                  </div>
                  <div className="TaskList-date">
                    <img src={calendarIcon} alt="Calendar" className="TaskList-calendar-icon" />
                    {formatDate(task.date)}
                  </div>
                </div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedTaskId === task.id}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem className="ChangeStatusMenuItem" disabled>Change Status</MenuItem>
                  <MenuItem onClick={() => handleStatusChange('todo')}>Todo</MenuItem>
                  <MenuItem onClick={() => handleStatusChange('inprogress')}>In Progress</MenuItem>
                  <MenuItem onClick={() => handleStatusChange('completed')}>Completed</MenuItem>
                </Menu>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
