import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, date, emoji, id, position } = city;
  const { lat, lng } = position;

  function handleDeleteCity(e) {
    e.preventDefault();

    deleteCity(id);
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? "cityItem--active" : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <times className={styles.date}>{formatDate(date)}</times>
        <button
          style={{ zIndex: 1000 }}
          className={styles.deleteBtn}
          onClick={handleDeleteCity}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
