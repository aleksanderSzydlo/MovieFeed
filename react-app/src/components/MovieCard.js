import React from 'react';
import { TMDB_IMAGE_BASE_URL } from '../services/tmdbApi';

function MovieCard({ movie, index, isInWatchlist, onToggleWatchlist, onClick }) {
  const posterPath = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/300x450/1a1a2e/eee?text=No+Image';
  
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const stars = getStarRating(movie.vote_average);
  
  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    onToggleWatchlist(movie);
  };

  return (
    <div
      className="movie-card"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onClick(movie)}
    >
      <button
        className={`bookmark-btn ${isInWatchlist ? 'active' : ''}`}
        onClick={handleWatchlistClick}
        aria-label={isInWatchlist ? 'Usuń z listy' : 'Dodaj do listy'}
      >
        {isInWatchlist ? '★' : '☆'}
      </button>
      
      <div className="movie-poster">
        <img src={posterPath} alt={movie.title} loading="lazy" />
      </div>
      
      <div className="movie-info">
        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-description">
          {movie.overview || 'Brak opisu'}
        </p>
        <div className="movie-rating">
          <span className="rating-stars">{stars}</span>
          <span className="rating-score">{rating}/10</span>
        </div>
      </div>
    </div>
  );
}

function getStarRating(rating) {
  if (!rating) return '☆☆☆☆☆';
  const stars = Math.round(rating / 2);
  return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
}

export default MovieCard;
