// TMDB API Configuration
const TMDB_API_KEY = '6af3116861d2942a3ffeff72071ba200';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Global variables
let allMovies = [];

// Fetch popular movies from TMDB
async function fetchPopularMovies() {
    const loading = document.getElementById('loading');
    const movieGrid = document.getElementById('movieGrid');
    
    try {
        loading.style.display = 'block';
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pl-PL&page=1`);
        
        if (!response.ok) {
            throw new Error('Nie udało się pobrać filmów');
        }
        
        const data = await response.json();
        allMovies = data.results;
        
        displayMovies(allMovies);
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error fetching movies:', error);
        loading.textContent = 'Błąd podczas ładowania filmów. Spróbuj odświeżyć stronę.';
        loading.style.color = 'var(--accent-color)';
    }
}

// Display movies in the grid
function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';
    
    movies.forEach((movie, index) => {
        const posterPath = movie.poster_path 
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/300x450/1a1a2e/eee?text=No+Image';
        
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const stars = getStarRating(movie.vote_average);
        
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.setAttribute('data-title', movie.title);
        movieCard.setAttribute('data-description', movie.overview || '');
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${posterPath}" alt="${movie.title}" loading="lazy">
            </div>
            <div class="movie-info">
                <h2 class="movie-title">${movie.title}</h2>
                <p class="movie-description">${movie.overview || 'Brak opisu'}</p>
                <div class="movie-rating">
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-score">${rating}/10</span>
                </div>
            </div>
        `;
        
        movieGrid.appendChild(movieCard);
    });
}

// Convert rating to stars
function getStarRating(rating) {
    if (!rating) return '☆☆☆☆☆';
    const stars = Math.round(rating / 2);
    return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
}

// Search movies from TMDB API
async function searchMovies(query) {
    if (!query.trim()) {
        displayMovies(allMovies);
        return;
    }
    
    try {
        const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pl-PL&query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('Błąd wyszukiwania');
        }
        
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
        // Fallback to local filtering if API fails
        filterMoviesLocally(query);
    }
}

// Fallback local filter
function filterMoviesLocally(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const filtered = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(term) || 
        (movie.overview && movie.overview.toLowerCase().includes(term))
    );
    displayMovies(filtered);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    // Fetch popular movies on load
    fetchPopularMovies();
    
    // Search with debounce
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchMovies(e.target.value);
        }, 500);
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            displayMovies(allMovies);
        }
    });
});
