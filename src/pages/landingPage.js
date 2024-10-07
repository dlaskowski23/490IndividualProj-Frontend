import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHeader from '../components/menuHeader';

import Lottie from 'lottie-react';
import topMovieAnimation from '../lotties/popularMovies.json';
import landingIntro from '../lotties/landingIntro.json';
import actorIntro from '../lotties/actorAnimation.json';
import actorList from '../lotties/actorListAnimation.json';

function LandingPage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);

  const [selectedActor, setSelectedActor] = useState(null);
  const [selectedActorFilms, setSelectedActorFilms] = useState([]);
  const [isActorModalOpen, setIsActorModalOpen] = useState(false);

  const handleMovieClick = (film_id) => {
    axios.get(`http://localhost:3001/films/${film_id}`)
      .then(response => {
        setSelectedMovie(response.data); 
        setIsMovieModalOpen(true);
      })
      .catch(error => console.error("Error fetching movie details:", error));
  };

  const handleActorClick = (actor_id) => {
    axios.get(`http://localhost:3001/films/actors/${actor_id}/top-films`)
      .then(response => {
        setSelectedActor(response.data.actor);
        setSelectedActorFilms(response.data.films);
        setIsActorModalOpen(true);
      })
      .catch(error => console.error("Error fetching actor details:", error));
  };
  
  return (
    <div className="min-h-screen bg-gray-200">
      <MenuHeader />
      <div className="container mx-auto px-12 py-5">
        <p className="text-xl text-center bg-gray-300 rounded-lg shadow-lg font-semibold p-6 mb-10">
          This is your platform for seeing anything and everything about your favorite movies. 
          Feel free to check out the top 5 movies right now, as well as the top 5 actors. Looking for 
          a movie? Checkout the films page!
        </p>
        
        <div className="flex justify-between items-start gap-10">
          <div className="flex flex-col items-center outline outline-offset-8 outline-gray-300 p-2 rounded-md w-1/2">
            <div className="mb-8">
              <Lottie animationData={landingIntro} loop={true} style={{ height: '300px', width: '300px' }} />
            </div>
            <Top5Movies onMovieClick={handleMovieClick} />
          </div>

          <div className="flex flex-col outline outline-offset-8 rounded-md outline-gray-300 p-2 items-center w-1/2">
            <div className="mb-8">
              <Lottie animationData={actorIntro} loop={true} style={{ height: '300px', width: '300px' }} />
            </div>
            <Top5Actors onActorClick={handleActorClick} />
          </div>
        </div>
      </div>

      {isMovieModalOpen && <MovieDetailsModal movie={selectedMovie} onClose={() => setIsMovieModalOpen(false)} />}
      {isActorModalOpen && <ActorDetailsModal actor={selectedActor} films={selectedActorFilms} onClose={() => setIsActorModalOpen(false)} />}
    </div>
  );
}

const Top5Movies = ({ onMovieClick }) => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/films/top-5')
      .then(response => setFilms(response.data))
      .catch(error => console.error("There was an error fetching the films!", error));
  }, []);

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-3xl text-center font-extrabold mb-5">Top 5 Movies</h1>
      {films.map(film => (
        <div key={film.film_id} className="bg-white flex items-center justify-between p-3 space-x-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="h-16 w-20 flex-shrink-0 flex items-center justify-center">
              <Lottie 
                animationData={topMovieAnimation}
                loop={true} 
                style={{ height: '200%', width: '200%' }}
              />
            </div>
            <h2 className="text-md font-bold">{film.title}</h2>
          </div>
          <button 
            className="bg-violet-500 text-white px-4 py-2 font-semibold outline outline-offset-4 outline-violet-500 rounded hover:bg-violet-600"
            onClick={() => onMovieClick(film.film_id)}
          >
            View Description
          </button>
        </div>
      ))}
    </div>
  );
};

const Top5Actors = ({ onActorClick }) => {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/films/actors/top-5')
      .then(response => setActors(response.data))
      .catch(error => console.error("There was an error fetching the actors!", error));
  }, []);

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-3xl text-center font-extrabold mb-5">Top 5 Actors</h1>
      {actors.map(actor => (
        <div key={actor.actor_id} className="bg-white flex items-center justify-between p-4 rounded-lg shadow-lg">
          <div className="h-14 w-16 flex-shrink-0 flex items-center justify-center">
              <Lottie 
                animationData={actorList}
                loop={true} 
                style={{ height: '200%', width: '200%' }}
              />
            </div>
          <div>
            <h2 className="text-lg font-semibold">{actor.first_name} {actor.last_name}</h2>
            <p className="text-sm text-gray-600">Appears in {actor.movie_count} movies!</p>
          </div>
          <button 
            className="bg-violet-500 text-white px-4 py-2 font-semibold outline outline-offset-4 outline-violet-500 rounded hover:bg-blue-600"
            onClick={() => onActorClick(actor.actor_id)}
          >
            View Top Films
          </button>
        </div>
      ))}
    </div>
  );
};

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg outline outline-offset-4 outline-white">
        <h2 className="text-2xl font-bold mb-4 text-center">{movie.title}</h2>
        <p className="mb-4"><strong>Description:</strong> {movie.description}</p>
        <p className="mb-4"><strong>Rental Count:</strong> {movie.rental_count}</p>
        <p className="mb-4"><strong>Release Year:</strong> {movie.release_year}</p>
        <p className="mb-4"><strong>Rating:</strong> {movie.rating}</p>
        <p className="mb-4"><strong>Genre:</strong> {movie.category ? movie.category : 'N/A'}</p>
        <p className="mb-4"><strong>Actors:</strong> {movie.actors.join(', ')}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ActorDetailsModal = ({ actor, films, onClose }) => {
  if (!actor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg outline outline-offset-4 outline-white">
        <h2 className="text-2xl font-bold mb-4 text-center">{actor.first_name} {actor.last_name}</h2>
        <h3 className="text-xl font-semibold mb-2">Top 5 Rented Films:</h3>
        <ul className="list-disc pl-6 mb-4">
          {films.map(film => (
            <li key={film.film_id}>
              <strong>{film.title}</strong> (Rental Count: {film.rental_count})
            </li>
          ))}
        </ul>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LandingPage;