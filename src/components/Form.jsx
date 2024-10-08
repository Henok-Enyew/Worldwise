// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
import useURLPosition from "../hooks/useURLPosition";
import Spinner from "./Spinner";
import Message from "./Message";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { setCities } = useCities();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");
  const navigate = useNavigate();

  const { mapLat, mapLng } = useURLPosition();

  useEffect(
    function () {
      if (!mapLat && !mapLng) return;

      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That ain't even a city yo, Click somewhere else 😑 "
            );
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
          setCityName(data.city || data.locality || "");
          console.log(data);
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [mapLat, mapLng]
  );

  function handleAddCity(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji: emoji,
      date,
      notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
      id: Date.now(),
    };
    setCities((cities) => [...cities, newCity]);
    navigate("/app/cities");
  }

  if (isLoadingGeocoding) return <Spinner />;
  if (!mapLat && !mapLng)
    return <Message message="Start by clicking on the map 😊" />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={styles.form} onSubmit={handleAddCity}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={handleAddCity}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
