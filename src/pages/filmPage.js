import React, { useState } from 'react';
import axios from 'axios';
import MenuHeader from '../components/menuHeader';

import Lottie from 'lottie-react';
import searchAnimation from '../lotties/searchMovieAnimation.json';


function FilmsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('actor');
    const [filmResults, setFilmResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filmsPerPage] = useState(10);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);

    const handleFilmSearch = () => {
        let params = {};

        if (searchQuery.trim() === '') {
            console.log('No search term entered, fetching all movies.');

            axios.get(`http://localhost:3001/films`)
                .then(response => {
                    console.log("Backend response data (all films):", response.data);
                    setFilmResults(response.data);
                })
                .catch(error => {
                    console.error("Error fetching all films:", error);
                });
            return;
        }

        if (searchType === 'actor') {
            params.actor = searchQuery.trim();
        } else if (searchType === 'title') {
            params.query = searchQuery.trim();
        } else if (searchType === 'category') {
            params.category = searchQuery.trim();
        }

        console.log("Params being sent to the backend:", params);

        axios.get(`http://localhost:3001/films/search`, { params })
            .then(response => {
                console.log("Backend response data:", response.data);
                setFilmResults(response.data);
            })
            .catch(error => {
                console.error("Error fetching films:", error);
            });
    };

    const handleViewFilmDetails = (film_id) => {
        axios.get(`http://localhost:3001/films/${film_id}`)
            .then(response => {
                setSelectedFilm(response.data);
                setIsFilmModalOpen(true);
            })
            .catch(error => {
                console.error("Error fetching film details:", error);
            });
    };

    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    const currentFilms = filmResults.slice(indexOfFirstFilm, indexOfLastFilm);

    const totalPages = Math.ceil(filmResults.length / filmsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-200">
            <MenuHeader />
            <div className="container mx-auto px-4 py-10">
                <h2 className="text-4xl text-center font-bold mb-4">Search for a movie!</h2>
                <h3 className='font-semibold bg-gray-300 rounded-lg shadow-lg p-1 text-center'> 
                    The place to be when trying to find a movie, 
                    select what you want to search, either film title, 
                    actor name, or genre and enter it into the search box, 
                    and we will find the movie you're looking for!</h3>
                <div className="flex justify-center items-center">
                    <Lottie animationData={searchAnimation} loop={true} style={{ height: '200px', width: '200px' }} />
                </div>
                <div className="flex justify-center items-center space-x-4 mt-4">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="p-3 border border-violet-500 rounded-lg"
                    >
                        <option value="title">Film Title</option>
                        <option value="actor">Actor's Name</option>
                        <option value="category">Genre</option>
                    </select>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter film title, actor's name, or genre..."
                        className="p-3 border border-violet-500 rounded-lg w-96"
                    />

                    <button
                        onClick={handleFilmSearch}
                        className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600"
                    >
                        Search
                    </button>
                </div>

                {currentFilms.length > 0 ? (
                    <div className="mt-4">
                        <table className="min-w-full bg-white mt-4 rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-violet-500 text-left font-semibold text-white">
                                    <th className="py-3 px-4 border-b">Movie ID</th>
                                    <th className="py-3 px-4 border-b">Title</th>
                                    <th className="py-3 px-4 border-b">Rating</th>
                                    <th className="py-3 px-4 border-b">Release Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFilms.map(film => (
                                    <tr
                                        key={film.film_id}
                                        className="cursor-pointer hover:bg-violet-100"
                                        onClick={() => handleViewFilmDetails(film.film_id)}
                                    >
                                        <td className="py-3 px-4 border-b text-gray-600">{film.film_id}</td>
                                        <td className="py-3 px-4 border-b text-gray-600">{film.title}</td>
                                        <td className="py-3 px-4 border-b text-gray-600">{film.rating}</td>
                                        <td className="py-3 px-4 border-b text-gray-600">{film.release_year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
                            <div className="flex items-center">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg mr-2 ${currentPage === 1 ? 'bg-gray-300 outline outline-gray-400 text-black' : 'bg-violet-500 text-white hover:bg-violet-600'}`}
                                >
                                    Prev
                                </button>
                                <select
                                    value={currentPage}
                                    onChange={(e) => paginate(Number(e.target.value))}
                                    className="p-2 border border-violet-500 rounded-lg"
                                >
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <option key={index} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg ml-2 ${currentPage === totalPages ? 'bg-gray-300 text-black outline outline-gray-400' : 'bg-violet-500 text-white hover:bg-violet-600'}`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <p className="text-center text-gray-600">No films found.</p>
                    </div>
                )}

                {isFilmModalOpen && selectedFilm && (
                    <FilmDetailsModal
                        film={selectedFilm}
                        onClose={() => setIsFilmModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}

const FilmDetailsModal = ({ film, onClose }) => {
    if (!film) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg outline outline-offset-4 outline-white">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{film.title}</h2>
                <p className="mb-4 text-gray-600"><strong>Description:</strong> {film.description}</p>
                <p className="mb-4 text-gray-600"><strong>Release Year:</strong> {film.release_year}</p>
                <p className="mb-4 text-gray-600"><strong>Rating:</strong> {film.rating}</p>
                <p className="mb-4 text-gray-600"><strong>Genre:</strong> {film.category ? film.category : 'N/A'}</p>
                <p className="mb-4 text-gray-600"><strong>Actors:</strong> {film.actors ? film.actors.join(', ') : 'N/A'}</p>

                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 w-full"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default FilmsPage;