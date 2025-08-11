import React, { createContext, useState, useEffect } from 'react';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theatersLoading, setTheatersLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch('/api/cities');
        const data = await res.json();
        setCities(data);
        if (data.length > 0) setSelectedCity(data[0]);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (!selectedCity) {
      setTheaters([]);
      setSelectedTheater(null);
      return;
    }
    setTheatersLoading(true);
    fetch(`/api/theaters?city=${selectedCity._id}`)
      .then(res => res.json())
      .then(data => {
        setTheaters(data);
        setSelectedTheater(data.length > 0 ? data[0] : null);
      })
      .catch(err => {
        setTheaters([]);
        setSelectedTheater(null);
        console.error('Failed to fetch theaters:', err);
      })
      .finally(() => setTheatersLoading(false));
  }, [selectedCity]);

  return (
    <CityContext.Provider value={{ cities, selectedCity, setSelectedCity, loading, theaters, selectedTheater, setSelectedTheater, theatersLoading }}>
      {children}
    </CityContext.Provider>
  );
}; 