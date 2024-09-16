import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LandingPage() {
  return (
    <div>
      <Top5Movies />
    </div>
  );
}

const Top5Movies = () => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/films/top-5')
      .then(response => setFilms(response.data))
      .catch(error => console.error("There was an error fetching the films!", error));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ul className="text-lg">
        {films.map(film => (
          <li key={film.film_id} className="py-2">
            {film.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LandingPage;
