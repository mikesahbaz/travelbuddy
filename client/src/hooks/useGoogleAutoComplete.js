import { useState, useEffect, useRef } from 'react';

const useGoogleAutocomplete = (input) => {
  const [predictions, setPredictions] = useState([]);
  const autoCompleteServiceRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      autoCompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    if (!autoCompleteServiceRef.current) return;

    if (input === '') {
      setPredictions([]);
      return;
    }

    autoCompleteServiceRef.current.getPlacePredictions({ input }, (predictions) => {
      setPredictions(predictions || []);
    });

  }, [input]);

  return {predictions};
};

export default useGoogleAutocomplete;
