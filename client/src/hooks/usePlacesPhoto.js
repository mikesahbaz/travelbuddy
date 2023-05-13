// usePlacesPhoto.js
import { useState, useEffect } from 'react';

const usePlacesPhoto = (place, placesApiKey) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [service, setService] = useState(null);

  useEffect(() => {
    if (window.google) {
      setService(new window.google.maps.places.PlacesService(document.createElement('div')));
    }
  }, []);

  const getPlacesData = (place) => {
    return new Promise((resolve, reject) => {
      if (!service) {
        reject('Service not available');
        return;
      }

      const request = {
        query: place,
        fields: ["name", "photos"],
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject('Places search failed');
        }
      });
    });
  };


  const fetchPhoto = async (place) => {
    try {
      const placesData = await getPlacesData(place);
      const photoUrl = placesData[0]?.photos[0]?.getUrl({ maxWidth: 500, maxHeight: 500 });
      setPhotoUrl(photoUrl);
      return photoUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { photoUrl, fetchPhoto };
};

export default usePlacesPhoto;
