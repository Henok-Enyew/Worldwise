// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { setCities } = useCities();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log(searchParams);

  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");

  function handleAddCity(e) {
    e.preventDefault();
    const newCity = {
      cityName: cityName,
      country: "country",
      emoji: "🇵🇹",
      date,
      notes: notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
      id: 3466228,
    };

    setCities((cities) => [...cities, newCity]);
    navigate(-1);
  }

  return (
    <form className={styles.form} onSubmit={handleAddCity}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
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
