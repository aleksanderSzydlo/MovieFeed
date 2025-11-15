const TMDB_API_KEY = '6af3116861d2942a3ffeff72071ba200';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Fetch genres
export async function fetchGenres() {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pl-PL`
    );
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

// Fetch popular movies
export async function fetchPopularMovies() {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pl-PL&page=1`
    );
    
    if (!response.ok) {
      throw new Error('Nie udało się pobrać filmów');
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

// Search movies
export async function searchMovies(query) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pl-PL&query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error('Błąd wyszukiwania');
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

// Apply filters
export async function applyFilters({ genre, sort, year }) {
  try {
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pl-PL`;
    
    if (genre) {
      url += `&with_genres=${genre}`;
    }
    
    if (sort) {
      url += `&sort_by=${sort}`;
    }
    
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Błąd filtrowania');
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error applying filters:', error);
    return [];
  }
}

// Fetch movie details
export async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pl-PL&append_to_response=credits,videos`
    );
    
    if (!response.ok) {
      throw new Error('Nie udało się pobrać szczegółów filmu');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}
