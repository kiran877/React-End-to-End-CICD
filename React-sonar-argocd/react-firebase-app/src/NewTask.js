import React, { useState } from 'react';
import './NewTask.css';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const NewTask = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        date,
        status,
        priority,
      });
      alert('Task created successfully');
      onClose();
    } catch (error) {
      alert('Error creating task');
    }
  };

  return (
    <div className="NewTask-overlay">
      <div className="NewTask-container">
        <div className="NewTask-header">
          <IconButton>
            <AddCircleIcon sx={{ color: '#8A31E5', marginRight: '8px' }} />
          </IconButton>
          <h2>Create New Task</h2>
          <button className="NewTask-close" onClick={onClose}>X</button>
        </div>
        <form className="NewTask-form" onSubmit={handleSubmit}>
          <label>
            Title:<span className="NewTask-required"></span>
            <input
              type="text"
              placeholder="Enter title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Description:
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Select Date:<span className="NewTask-required"></span>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled>Select here</option>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label>
            Priority:
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="" disabled>Select here</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <div className="NewTask-buttons">
            <button type="button" className="NewTask-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="NewTask-create">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTask;
