import React, { useEffect, useState } from 'react';
import { fetchMovieDetails, TMDB_IMAGE_BASE_URL, TMDB_BACKDROP_BASE_URL } from '../services/tmdbApi';

function Modal({ isOpen, movie, onClose, watchlist, onToggleWatchlist }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      loadMovieDetails();
    }
  }, [isOpen, movie]);

  const loadMovieDetails = async () => {
    setLoading(true);
    const details = await fetchMovieDetails(movie.id);
    setMovieDetails(details);
    setLoading(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const isInWatchlist = watchlist.some(m => m.id === movie.id);
  const backdropPath = movieDetails?.backdrop_path
    ? `${TMDB_BACKDROP_BASE_URL}${movieDetails.backdrop_path}`
    : null;

  return (
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>&times;</span>
        
        {loading ? (
          <div className="modal-loading">Ładowanie szczegółów...</div>
        ) : movieDetails ? (
          <div className="modal-body">
            {backdropPath && (
              <div className="modal-backdrop">
                <img src={backdropPath} alt={movieDetails.title} />
                <div className="modal-backdrop-overlay"></div>
              </div>
            )}
            
            <div className="modal-content-wrapper">
              <div className="modal-header">
                <h2>{movieDetails.title}</h2>
                {movieDetails.release_date && (
                  <span className="modal-year">
                    ({new Date(movieDetails.release_date).getFullYear()})
                  </span>
                )}
              </div>
              
              <div className="modal-meta">
                <span className="modal-rating">
                  ⭐ {movieDetails.vote_average?.toFixed(1)}/10
                </span>
                {movieDetails.runtime && (
                  <span className="modal-runtime">
                    ⏱ {movieDetails.runtime} min
                  </span>
                )}
              </div>
              
              {movieDetails.genres && movieDetails.genres.length > 0 && (
                <div className="modal-genres">
                  {movieDetails.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="modal-overview">{movieDetails.overview}</p>
              
              {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
                <div className="modal-cast">
                  <h3>Obsada:</h3>
                  <div className="cast-list">
                    {movieDetails.credits.cast.slice(0, 5).map(actor => (
                      <div key={actor.id} className="cast-member">
                        {actor.profile_path && (
                          <img
                            src={`${TMDB_IMAGE_BASE_URL}${actor.profile_path}`}
                            alt={actor.name}
                          />
                        )}
                        <div>
                          <p className="actor-name">{actor.name}</p>
                          <p className="character-name">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                className={`modal-watchlist-btn ${isInWatchlist ? 'active' : ''}`}
                onClick={() => onToggleWatchlist(movie)}
              >
                {isInWatchlist ? '★ Usuń z listy' : '☆ Dodaj do listy'}
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-error">Nie udało się załadować szczegółów filmu</div>
        )}
      </div>
    </div>
  );
}

export default Modal;
