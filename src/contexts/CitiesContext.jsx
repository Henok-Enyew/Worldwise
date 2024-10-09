import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  // const [count, setCount] = useState(0);
  useEffect(function () {
    async function fetchCities() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        console.error("Couldn't fetch cities");
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:9000/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      console.error("Couldn't fetch cities");
    } finally {
      setLoading(false);
    }
  }
  async function createCity(newCity) {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:9000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {},
        "Content-Type": "application/json",
      });
      const data = await res.json();
      console.log(data);
      setCities((cities) => [...cities, newCity]);

      setCurrentCity(data);
    } catch {
      console.error("There was an error deleteing the city");
    } finally {
      setLoading(false);
    }
  }
  async function deleteCity(id) {
    try {
      setLoading(true);
      await fetch(`http://localhost:9000/cities/${id}`, {
        method: "DELETE",
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      console.error("There was an error deleteing the city");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        setCities,
        setLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was called outside");
  return context;
}
export { useCities, CitiesProvider };
