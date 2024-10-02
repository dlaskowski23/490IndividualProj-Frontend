import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHeader from '../components/menuHeader';
import Lottie from 'lottie-react';
import topMovieAnimation from '../lotties/popularMovies.json';
import landingIntro from '../lotties/landingIntro.json';
import actorIntro from '../lotties/actorAnimation.json';

function LandingPage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (film_id) => {
    axios.get(`http://localhost:3001/films/${film_id}`)
      .then(response => {
        console.log(response.data);
        setSelectedMovie(response.data); 
        setIsModalOpen(true);
      })
      .catch(error => console.error("Error fetching movie details:", error));
  };
  
  return (
    <div>
      <MenuHeader />
      <Top5Movies onMovieClick={handleMovieClick} />
      {isModalOpen && <MovieDetailsModal movie={selectedMovie} onClose={() => setIsModalOpen(false)} />}
      <Top5Actors />
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
    <div className="bg-gray-200 flex flex-col items-center justify-center p-5">
      <h1 className='text-5xl font-extrabold'>Welcome!</h1>
        <p className='md:m text-xl mt-2 bg-white rounded-lg shadow-lg font-semibold p-3'> This is your platform for seeing anything and everything
        about your favorite movies. Feel free to checkout the top 5
        movies right now, as well as, the top 5 actors! //Add something
        about oother features after
        </p>
      <div className='md:grid md:grid-cols-2 mt-5'>
        <div>
          <div className='p-2 '>
            <Lottie 
            animationData={landingIntro}
            loop={true} 
            style={{ height: '75%', width: '75%' }}
          />
          </div>
          
        </div>
        <div className="space-y-4">
          <h1 className='text-3xl text-center mt-3 font-extrabold mb-5'>Top 5 Movies</h1>
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
                className="bg-blue-500 text-white px-4 py-2 font-semibold outline outline-offset-4 outline-blue-500 rounded hover:bg-blue-600"
                onClick={() => onMovieClick(film.film_id)}
              >
                View Description
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Top5Actors = ({ onMovieClick }) => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/films/top-5')
      .then(response => setFilms(response.data))
      .catch(error => console.error("There was an error fetching the films!", error));
  }, []);

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center p-5">
      <div className='md:grid md:grid-cols-2 mt-5'>
        <div className="space-y-4">
          <h1 className='text-3xl text-center mt-3 font-extrabold mb-5'>Top 5 Actors</h1>
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
                className="bg-blue-500 text-white px-4 py-2 font-semibold outline outline-offset-4 outline-blue-500 rounded hover:bg-blue-600"
                onClick={() => onMovieClick(film.film_id)}
              >
                View Description
              </button>
            </div>
          ))}
        </div>
        <div>
          <div className='p-2 '>
            <Lottie 
            animationData={actorIntro}
            loop={true} 
            style={{ height: '100%', width: '100%' }}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full z-100 outline outline-offset-4 outline-white">
        <h2 className="text-2xl font-bold mb-4 text-center">{movie.title}</h2>
        <p className="mb-4"><strong>Description:</strong> {movie.description}</p>
        <p className="mb-4"><strong>Rental Count:</strong> {movie.rental_count}</p>
        <p className="mb-4"><strong>Release Year:</strong> {movie.release_year}</p>
        <p className="mb-4"><strong>Rating:</strong> {movie.rating}</p>
        <p className="mb-4"><strong>Actors:</strong> {movie.actors.join(', ')}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 outline outline-offset-2 ml-36 outline-red-500 text-white font-bold rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};




export default LandingPage;
