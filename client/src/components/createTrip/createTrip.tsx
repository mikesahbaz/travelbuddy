import React, { useState, useEffect } from 'react';
import './createTrip.css';
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { auth } from '../../firebase';

const CreateTrip: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userEmails, setUserEmails] = useState([]);
  const [creatorEmail, setCreatorEmail] = useState<string | null>('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setUserEmails([]);
    setCreatorEmail('');
    setName('');
  }

  useEffect(() => {
    fetchUsers();

    const unsubscribe = auth.onAuthStateChanged( (user) => {
      if (user) {
        setCreatorEmail(user.email)
        console.log(user.email);
      } else {
        setCreatorEmail('');
      }
    });

    return () => {
      unsubscribe();
    }
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/users/all');
      const data = await res.json();
      setUsers(data.users);
      console.log(data.users);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  }

  const handleSubmitCreateTrip = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = {
        startDate: startDate,
        endDate: endDate,
        users: userEmails,
        creator: creatorEmail,
        name: name,
      }
      const res = await fetch(`http://localhost:3001/trips/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('There was an error creating the project');
      }
      resetForm();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }

  }

  const handleChange = (selectedOptions: any) => {
    const selectedEmails = selectedOptions.map((option: any) => option.value);
    setUserEmails(selectedEmails);
    console.log(userEmails);
  };

  const userOptions = users.map((user: any) => ({
    value: user.email,
    label: `${user.firstName} ${user.lastName} ${user.email}`,
  }));

  return (
    <div>
      <NavBar />
      <div className='create-trip-container'>
        <h1>Plan a new trip! </h1>
        <form onSubmit={handleSubmitCreateTrip} className='create-trip-form'>
        <input type='text' value={name} onChange={event => setName(event.target.value)} placeholder='Trip to....?' ></input>
          <label>Start Date</label>
          <input type='date' value={startDate} onChange={event => setStartDate(event.target.value)} ></input>
          <label>End Date</label>
          <input type='date' value={endDate} onChange={event => setEndDate(event.target.value)} ></input>
          <input type='text' placeholder='Invite your friends..' value={searchQuery} onChange={event => setSearchQuery(event.target.value)}></input>
          <Select
            options={userOptions}
            isMulti
            onChange={handleChange}
          />
          <button type='submit' className='submit-project-btn'>Create the Project</button>
        </form>
      </div>

    </div>
  )
}

export default CreateTrip;