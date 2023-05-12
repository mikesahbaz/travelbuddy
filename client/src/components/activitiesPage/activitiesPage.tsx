import React, { useState } from 'react';
import './activitiesPage.css';
import { useParams } from 'react-router';
import { FaHeart } from 'react-icons/fa';
import { SearchPlace_SkyScanner } from '../../services/activityService';
import { SearchHotel_SkyScanner } from '../../services/activityService';
import { SearchThingToDo_SkyScanner } from '../../services/activityService';
import { toggleFavoriteActivity } from '../../services/activityService';

const ActivitiesPage: React.FC = () => {
  const initialFormState = {
    city: ''
  };
  const [formState, setFormState] = useState(initialFormState);
  const [activitiesData, setActivitiesData] = useState<any[] | null>(null);
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

  const handleSubmitActivitySearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data_SearchPlace = await SearchPlace_SkyScanner(formState.city);
    const entityId = data_SearchPlace.data[0].entityId;
    const [startDate, endDate] = dateParameters();
    const data_SearchHotel = await SearchHotel_SkyScanner(entityId, startDate, endDate);
    const [lng, lat] = data_SearchHotel.data.hotels[0].coordinates;
    const data_SearchThingToDo = await SearchThingToDo_SkyScanner(entityId, lng, lat);
    const thingsToDo = data_SearchThingToDo.data.thingsToDo;
    console.log(thingsToDo);
    setActivitiesData(thingsToDo.slice(0, 10));
    setIsLoading(false);
  };

  const handleFavoriteClick = async (activity: any) => {
    const backendFormData = {
      entityId: activity.entityId,
      name: activity.poiName,
      type: activity.poiType,
      typeCategory: activity.poiTypeCategory,
      typeLocale: activity.poiTypeLocale,
    }
    try {
      if (typeof tripId === 'string') {
        const data = await toggleFavoriteActivity(tripId, backendFormData);
        console.log('activity was favorited: ', data);
      }
    } catch (error) {
      console.error('Error favoriting the activity', error);
    }
  }

  return (
    <div className='activity-page-container'>
      <form onSubmit={handleSubmitActivitySearch} className='search-form'>
          <label>Destination City</label>
        <div>
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
        {activitiesData && activitiesData.map( (activity) => (
          <div className='activity-item' key={activity.entityId}>
            <div className='main-activity-content'>
              <h1 className='poi-name'>{activity.poiName}</h1>
              <h4 className='poi-type'>{activity.poiType}</h4>
              <p className='poi-type-category'>{activity.poiTypeCategory}</p>
            </div>
            <FaHeart className='favorite-button' onClick={() => handleFavoriteClick(activity)} />
            <div className='right-activity-container'>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivitiesPage;