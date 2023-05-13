import React, { useState, useEffect } from 'react';
import './createTrip.css';
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { auth } from '../../firebase';
import { getAllUsers } from '../../services/userService';
import { createTrip } from '../../services/tripService';
import useGoogleAutocomplete from '../../hooks/useGoogleAutoComplete';

const CreateTrip: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [creatorEmail, setCreatorEmail] = useState<string | null>('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [creatorId, setCreatorId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationSearchQuery, setDestinationSearchQuery] = useState('');
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);

  const { predictions: autocompletePredictions } = useGoogleAutocomplete(destinationSearchQuery);
  useEffect(() => {
    setPredictions(autocompletePredictions);
  }, [autocompletePredictions]);

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setUserIds([]);
    setCreatorEmail('');
    setName('');
  }

  const getCreatorIdByEmail = (email: string) => {
    const user: any = users.find((user: any) => user.email === email);
    return user ? user._id : null;
  };

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
  },[])

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      console.log(data.users);
      setUsers(data.users);
      const originalCreatorId = getCreatorIdByEmail(creatorEmail || '');
      setCreatorId(originalCreatorId);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmitCreateTrip = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const originalCreatorId = getCreatorIdByEmail(creatorEmail || '');
      const allUserIds = [originalCreatorId, ...userIds];
      const formData = {
        name: name,
        startDate: startDate,
        endDate: endDate,
        creator: originalCreatorId,
        travelers: allUserIds,
      }
      await createTrip(formData);
      resetForm();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }

  }

  const handleChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setUserIds(selectedIds);
    console.log(selectedIds);
  };

  const userOptions = users.map((user: any) => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName} ${user.email}`,
  }));

  return (
    <div>
      <NavBar />
      <div className='create-trip-container'>
        <h1>Plan a new trip! </h1>
        <form onSubmit={handleSubmitCreateTrip} className='create-trip-form'>
        <input type='text' value={name} onChange={event => {setName(event.target.value); setDestinationSearchQuery(event.target.value)}} placeholder='Going to' ></input>
        <select className="select-box" value={name} onChange={event => setName(event.target.value)}>
          {predictions.map((prediction: any) => (
            <option key={prediction.place_id} value={prediction.description}>
              {prediction.description}
            </option>
          ))}
        </select>
          <label>Start Date</label>
          <input type='date' value={startDate} onChange={event => setStartDate(event.target.value)} ></input>
          <label>End Date</label>
          <input type='date' value={endDate} onChange={event => setEndDate(event.target.value)} ></input>
          {/* <input type='text' placeholder='Invite your friends..' value={searchQuery} onChange={event => setSearchQuery(event.target.value)}></input> */}
          <Select
            options={userOptions}
            isMulti
            onChange={handleChange}
            placeholder='Invite your friends...'
          />
          <button type='submit' className='submit-project-btn'>Create the Project</button>
        </form>
      </div>

    </div>
  )
}

export default CreateTrip;