import React, { createContext, useEffect, useState, useContext } from 'react';

const GlobalStateContext = createContext();

const initialState = {
  cities: [],
  users: [],
  apiUrl: process.env.NODE_ENV === 'production' ? '//traverbal-api-xj5iwh2pjq-uc.a.run.app' : '//localhost:3001',
  imageUrl: 'https://ik.imagekit.io/traverbal/',
};

export const GlobalStateProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState(initialState.cities);
  const [users, setUsers] = useState(initialState.users);
  const [apiUrl] = useState(initialState.apiUrl);
  const [imageUrl] = useState(initialState.imageUrl);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(apiUrl + '/api/cities');
        const { cities } = await res.json();
        setCities(cities);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const r = await fetch(apiUrl + '/api/users');
        const { users } = await r.json();
        setUsers(users);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchCities()]);
      setLoading(false);
    };

    fetchData();
  }, [apiUrl]);

  return (
    <GlobalStateContext.Provider
      value={{
        cities,
        users,
        loading,
        apiUrl,
        imageUrl,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => useContext(GlobalStateContext);

export default useGlobalState;
