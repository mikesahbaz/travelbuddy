import React, { useState } from 'react';
import './activitiesPage.css';
import { useParams } from 'react-router';
import { FaHeart } from 'react-icons/fa';
import { SearchPlace_SkyScanner } from '../../services/activityService';
import { SearchHotel_SkyScanner } from '../../services/activityService';
import { SearchThingToDo_SkyScanner } from '../../services/activityService';
import { toggleFavoriteActivity } from '../../services/activityService';
import usePlacesPhoto from '../../hooks/usePlacesPhoto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation } from '@tanstack/react-query';

const ActivitiesPage: React.FC = () => {
  const { fetchPhoto } = usePlacesPhoto(process.env.REACT_APP_PLACES_KEY);

  const initialFormState = {
    city: ''
  };
  const [formState, setFormState] = useState(initialFormState);
  // const [activitiesData, setActivitiesData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { tripId } = useParams();

  function dateParameters() {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let dd = String(today.getDate()).padStart(2, '0');
    let dd2 = String(today.getDate() + 1).padStart(2, '0');

    let formattedDate = `${yyyy}-${mm}-${dd}`;
    let formattedDate2 = `${yyyy}-${mm}-${dd2}`;

    return [formattedDate, formattedDate2];
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({...prevState, [e.target.name]: e.target.value}));
  };

  const fetchActivities = async ({ city }: any) => {
    setIsLoading(true);
    const data_SearchPlace = await SearchPlace_SkyScanner(formState.city);
    const entityId = data_SearchPlace.data[0].entityId;
    const [startDate, endDate] = dateParameters();
    const data_SearchHotel = await SearchHotel_SkyScanner(entityId, startDate, endDate);
    const [lng, lat] = data_SearchHotel.data.hotels[0].coordinates;
    const data_SearchThingToDo = await SearchThingToDo_SkyScanner(entityId, lng, lat);
    const thingsToDo = data_SearchThingToDo.data.thingsToDo;
    console.log(thingsToDo);
    const activitiesWithPhotos = await Promise.all(thingsToDo.map(async (activity: any) => {
      const photoUrl = await fetchPhoto(activity.poiName);
      return { ...activity, photoUrl };
    }));
    console.log(activitiesWithPhotos);
    setIsLoading(false);
    return activitiesWithPhotos.slice(0, 10);
  };

  const handleFavoriteClick = async (activity: any) => {
    console.log(activity);
    const backendFormData = {
      entityId: activity.entityId,
      poiName: activity.poiName,
      poiType: activity.poiType,
      poiTypeCategory: activity.poiTypeCategory,
      poiTypeLocale: activity.poiTypeLocale,
    }
    try {
      if (typeof tripId === 'string') {
        const data = await toggleFavoriteActivity(tripId, backendFormData);
        toast.success('Activity was favorited!', {
          className: 'toast-success',
          position: toast.POSITION.TOP_CENTER
        });
        console.log('activity was favorited: ', data);
      }
    } catch (error) {
      console.error('Error favoriting the activity', error);
      toast.error('Error favoriting the activity', {
        className: 'toast-error',
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  const activityQuery = useQuery(
    ['activities', formState.city],
    async () => fetchActivities({ city: formState.city }),
    { enabled: false }

  );

  const handleSubmitActivitySearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    activityQuery.refetch();
  }

  const activitiesData = activityQuery.data || [];

  return (
    <div className='activity-page-container'>
      <ToastContainer />
      <form onSubmit={handleSubmitActivitySearch} className='search-form'>
        <div>
          <label>Destination City</label>
          <input
            type="text"
            placeholder="City"
            name="city"
            value={formState.city}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Search Activities</button>
      </form>

      <div className='activity-data'>
        {isLoading && <div>Searching for activities...</div>}
        {activitiesData && activitiesData.map( (activity: any) => (
          <div className='activity-item' key={activity.entityId}>
            {activity.photoUrl && <img src={activity.photoUrl} alt={activity.poiName} className='activity-photo' />}
            <div className='main-activity-content'>
              <h1 className='poi-name'>{activity.poiName}</h1>
              <h4 className='poi-type'>{activity.poiType}</h4>
              <p className='poi-type-category'>{activity.poiTypeCategory}</p>
            </div>
            <FaHeart className='favorite-button-activity' onClick={() => handleFavoriteClick(activity)} />
            <div className='right-activity-container'>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivitiesPage;