import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import TabsNav from './components/TabsNav';
import Filters from './components/Filters';
import MovieGrid from './components/MovieGrid';
import Modal from './components/Modal';
import { fetchPopularMovies, fetchGenres, searchMovies, applyFilters } from './services/tmdbApi';

function App() {
  const [allMovies, setAllMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentTab, setCurrentTab] = useState('discover');
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem('movieWatchlist')) || [];
  });
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load genres and movies on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const genreData = await fetchGenres();
      setGenres(genreData);
      
      const movieData = await fetchPopularMovies();
      setAllMovies(movieData);
      setDisplayedMovies(movieData);
      setLoading(false);
    };
    
    loadInitialData();
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setDisplayedMovies(allMovies);
      return;
    }
    
    const results = await searchMovies(query);
    setDisplayedMovies(results);
  };

  const handleApplyFilters = async (filterOptions) => {
    setLoading(true);
    const filteredMovies = await applyFilters(filterOptions);
    setDisplayedMovies(filteredMovies);
    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const toggleWatchlist = (movie) => {
    const isInWatchlist = watchlist.some(m => m.id === movie.id);
    
    if (isInWatchlist) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const moviesToDisplay = currentTab === 'discover' ? displayedMovies : watchlist;

  return (
    <div className="App">
      <Header onSearch={handleSearch} />
      
      <TabsNav currentTab={currentTab} onTabChange={handleTabChange} />
      
      <main className="container">
        {currentTab === 'discover' && (
          <Filters genres={genres} onApplyFilters={handleApplyFilters} />
        )}
        
        {loading ? (
          <div className="loading">Ładowanie filmów...</div>
        ) : (
          <>
            {currentTab === 'for-you' && watchlist.length === 0 ? (
              <div className="watchlist-info">
                <h2>Twoja Lista Do Obejrzenia</h2>
                <p>Kliknij ikonę zakładki na filmie, aby dodać go do swojej listy.</p>
              </div>
            ) : (
              <MovieGrid 
                movies={moviesToDisplay}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                onMovieClick={openModal}
              />
            )}
          </>
        )}
      </main>
      
      <Modal 
        isOpen={isModalOpen}
        movie={selectedMovie}
        onClose={closeModal}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />
      
      <footer>
        <div className="container">
          <p>&copy; 2025 Movie Feed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
