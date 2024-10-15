// import { createContext, useContext, useEffect, useReducer } from "react";

// const CitiesContext = createContext();
// const LOCAL_STORAGE_KEY = "citiesData"; // Key for local storage

// const initialState = {
//   cities: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [],
//   isLoading: false,
//   currentCity: {},
//   error: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "loading":
//       return { ...state, isLoading: true };
//     case "city/loaded":
//       return { ...state, isLoading: false, currentCity: action.payload };
//     case "cities/loaded":
//       return { ...state, isLoading: false, cities: action.payload };
//     case "city/created":
//       return {
//         ...state,
//         isLoading: false,
//         cities: [...state.cities, action.payload],
//       };
//     case "city/deleted":
//       return {
//         ...state,
//         isLoading: false,
//         cities: state.cities.filter((city) => city.id !== action.payload),
//       };
//     case "rejected":
//       return {
//         ...state,
//         isLoading: false,
//         error: action.payload,
//       };
//   }
// }

// // Reducer function remains unchanged...

// function CitiesProvider({ children }) {
//   const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
//     reducer,
//     initialState
//   );

//   // Function to save cities data to local storage
//   function saveCitiesToLocalStorage(cities) {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cities));
//   }

//   async function getCity(id) {
//     if (Number(id) === currentCity.id) return;

//     dispatch({ type: "loading" });
//     const city = cities.find((city) => city.id == id);
//     if (city) {
//       console.log(city);
//       dispatch({ type: "city/loaded", payload: city });
//     } else {
//       dispatch({
//         type: "rejected",
//         payload: "City not found",
//       });
//     }
//   }

//   async function createCity(city) {
//     dispatch({ type: "loading" });
//     const newCity = { ...city, id: Date.now() };
//     const updatedCities = [...cities, { id: Date.now(), ...newCity }];
//     saveCitiesToLocalStorage(updatedCities);
//     dispatch({ type: "city/created", payload: newCity });
//   }

//   async function deleteCity(id) {
//     dispatch({ type: "loading" });
//     const updatedCities = cities.filter((city) => city.id !== id);
//     saveCitiesToLocalStorage(updatedCities);
//     dispatch({ type: "city/deleted", payload: id });
//   }

//   return (
//     <CitiesContext.Provider
//       value={{
//         cities,
//         isLoading,
//         currentCity,
//         error,
//         getCity,
//         createCity,
//         deleteCity,
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// function useCities() {
//   const context = useContext(CitiesContext);
//   if (context === undefined)
//     throw new Error("CitiesContext was called outside");
//   return context;
// }

// export { useCities, CitiesProvider };
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";
// const BASE_URL = "https://6706d47ba0e04071d22863aa.mockapi.io/worldwise";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    dispatch({ type: "loading" });
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error fetching cities",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error getting city",
        });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: newCity });
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleteing the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
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
