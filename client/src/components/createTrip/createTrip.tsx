import React, { useState, useEffect } from 'react';
import './createTrip.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { auth } from '../../firebase';
import NavBar from '../NavBar/NavBar';
import { IUser } from '../../interfaces/userInterface';
import { createTrip } from '../../services/tripService';
import { getAllUsers } from '../../services/userService';
import useGoogleAutocomplete from '../../hooks/useGoogleAutoComplete';

const CreateTrip: React.FC = () => {
  const initialFormState = {
    tripName: '',
    startDate: '',
    endDate: '',
    userIds: [],
    creatorEmail: ''
  }
  const [formState, setFormState] = useState(initialFormState);
  const [users, setUsers] = useState<IUser[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [creatorEmail, setCreatorEmail] = useState('');
  const [destinationSearchQuery, setDestinationSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);


  const navigate = useNavigate();

  const { predictions: autocompletePredictions } = useGoogleAutocomplete(destinationSearchQuery);
  useEffect(() => {
    setPredictions(autocompletePredictions);
  }, [autocompletePredictions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState((prevState) => ({...prevState, [e.target.name]: e.target.value}));
    if (e.target.name === 'tripName') {
     setDestinationSearchQuery(e.target.value);
    }
  }

  const resetForm = () => {
    setFormState(initialFormState);
  }

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users as IUser[]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUsers();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCreatorEmail(user.email as string)
        console.log(user.email);
      } else {
        setCreatorEmail('');
      }
    });

    return () => {
      unsubscribe();
    }
  },[])

  const userOptions = users.map((user: IUser) => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName} ${user.email}`,
  }));

  const handleFriendSelectChange = (
    selectedOptions: readonly {label:string, value:string}[] | null
  ) => {
  if (selectedOptions) {
    const selectedIds: string[] = selectedOptions.map((option) => option.value);
    setUserIds(selectedIds);
  } else {
    setUserIds([]);
  }
};

  const getCreatorIdByEmail = (email: string) => {
    const user = users.find((user: IUser) => user.email === email) as IUser;
    return user._id;
  };

  const handleSubmitCreateTrip = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      console.log(userIds);
      const originalCreatorId = getCreatorIdByEmail(creatorEmail);
      const allUserIds = [originalCreatorId, ...userIds];
      console.log(allUserIds);
      const formData = {
        name: formState.tripName,
        startDate: formState.startDate,
        endDate: formState.endDate,
        creator: originalCreatorId,
        travelers: allUserIds,
      }
      console.log(formData);
      await createTrip(formData);
      resetForm();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    <NavBar />
    <div className='create-trip-container'>
      <h1>Plan a new trip! </h1>
      <form className='create-trip-form' onSubmit={handleSubmitCreateTrip}>
        <input className='trip-input'
          type='text'
          placeholder='Traveling to...'
          name='tripName'
          value={formState.tripName}
          onChange={handleInputChange}
        />
        <select className="select-box"
          value={formState.tripName}
          name='tripName'
          onChange={handleInputChange}>
          {predictions.map((prediction: any) => (
            <option key={prediction.place_id} value={prediction.description}>
              {prediction.description}
            </option>
          ))}
        </select>
        <label>Start Date</label>
        <input className='trip-input'
          type='date'
          name='startDate'
          value={formState.startDate}
          onChange={handleInputChange}
        />
        <label>End Date</label>
        <input className='trip-input'
          type='date'
          name='endDate'
          value={formState.endDate}
          onChange={handleInputChange}
        />
        <input className='trip-input'
          type='text'
          placeholder='Invite your friends..'
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
        <Select id="trip-users-selectBox"
          options={userOptions}
          isMulti
          onChange={handleFriendSelectChange}
        />
        <button className='trip-submit-btn' id='blue-btn' type='submit'>Create Trip</button>
      </form>
    </div>
    </>
  )
}

export default CreateTrip;