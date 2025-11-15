import React from 'react';
import MovieCard from './MovieCard';

function MovieGrid({ movies, watchlist, onToggleWatchlist, onMovieClick }) {
  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          index={index}
          isInWatchlist={watchlist.some(m => m.id === movie.id)}
          onToggleWatchlist={onToggleWatchlist}
          onClick={onMovieClick}
        />
      ))}
    </div>
  );
}

export default MovieGrid;
