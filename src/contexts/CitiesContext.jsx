import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "currentCity":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  // const [count, setCount] = useState(0);
  useEffect(function () {
    async function fetchCities() {
      try {
        // setLoading(true);
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        console.error("Couldn't fetch cities");
      } finally {
        // setLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      // setLoading(true);
      dispatch({ type: "loading" });

      const res = await fetch(`http://localhost:9000/cities/${id}`);
      const data = await res.json();
      // setCurrentCity(data);
      dispatch({ type: "currentCity", payload: data });
    } catch {
      console.error("Couldn't fetch cities");
    } finally {
      // setLoading(false);
    }
  }
  async function createCity(newCity) {
    try {
      // setLoading(true);
      dispatch({ type: "loading" });

      const res = await fetch(`http://localhost:9000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {},
        "Content-Type": "application/json",
      });
      const data = await res.json();
      // console.log(data);
      // setCities((cities) => [...cities, newCity]);
      dispatch({ type: "cities/created", payload: newCity });
      dispatch({ type: "currentCity", payload: data });

      // setCurrentCity(data);
    } catch {
      console.error("There was an error deleteing the city");
    } finally {
      // setLoading(false);
    }
  }
  async function deleteCity(id) {
    try {
      // setLoading(true);
      dispatch({ type: "loading" });

      await fetch(`http://localhost:9000/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      console.error("There was an error deleteing the city");
    } finally {
      // setLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        // setCities,
        // setLoading,
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
