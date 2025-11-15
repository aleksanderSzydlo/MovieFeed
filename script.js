// TMDB API Configuration
const TMDB_API_KEY = '6af3116861d2942a3ffeff72071ba200';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Global variables
let allMovies = [];
let genres = [];
let currentTab = 'discover';
let watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];

// Fetch genres
async function fetchGenres() {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pl-PL`);
        const data = await response.json();
        genres = data.genres;
        
        const genreFilter = document.getElementById('genreFilter');
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

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
function displayMovies(movies, targetGrid = 'movieGrid') {
    const movieGrid = document.getElementById(targetGrid);
    movieGrid.innerHTML = '';
    
    if (movies.length === 0 && targetGrid === 'watchlistGrid') {
        movieGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Brak filmów na liście do obejrzenia.</p>';
        return;
    }
    
    movies.forEach((movie, index) => {
        const posterPath = movie.poster_path 
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/300x450/1a1a2e/eee?text=No+Image';
        
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const stars = getStarRating(movie.vote_average);
        const isBookmarked = watchlist.some(m => m.id === movie.id);
        
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.setAttribute('data-title', movie.title);
        movieCard.setAttribute('data-description', movie.overview || '');
        movieCard.setAttribute('data-movie-id', movie.id);
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${posterPath}" alt="${movie.title}" loading="lazy">
                <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-movie-id="${movie.id}">
                    ${isBookmarked ? '🔖' : '📑'}
                </button>
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
        
        // Click on card to show details
        movieCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('bookmark-btn')) {
                showMovieDetails(movie);
            }
        });
        
        // Bookmark button
        const bookmarkBtn = movieCard.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
        });
        
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

// Fetch movies with filters
async function fetchMoviesWithFilters() {
    const loading = document.getElementById('loading');
    const genreId = document.getElementById('genreFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    const year = document.getElementById('yearFilter').value;
    
    try {
        loading.style.display = 'block';
        
        let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pl-PL&sort_by=${sortBy}`;
        if (genreId) url += `&with_genres=${genreId}`;
        if (year) url += `&primary_release_year=${year}`;
        
        const response = await fetch(url);
        const data = await response.json();
        allMovies = data.results;
        
        displayMovies(allMovies);
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
        loading.style.display = 'none';
    }
}

// Show movie details in modal
async function showMovieDetails(movie) {
    const modal = document.getElementById('movieModal');
    const modalBody = document.getElementById('modalBody');
    
    modal.classList.add('active');
    
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=pl-PL&append_to_response=credits`);
        const details = await response.json();
        
        const backdropPath = details.backdrop_path 
            ? `${TMDB_BACKDROP_BASE_URL}${details.backdrop_path}`
            : `${TMDB_IMAGE_BASE_URL}${details.poster_path}`;
        
        const genresList = details.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('');
        const releaseYear = details.release_date ? new Date(details.release_date).getFullYear() : 'N/A';
        const runtime = details.runtime ? `${details.runtime} min` : 'N/A';
        const isBookmarked = watchlist.some(m => m.id === movie.id);
        
        modalBody.innerHTML = `
            <div class="modal-header" style="background-image: url('${backdropPath}')"></div>
            <div class="modal-details">
                <h2 class="modal-title">${details.title}</h2>
                <div class="modal-meta">
                    <div class="meta-item">
                        <strong>⭐</strong> ${details.vote_average.toFixed(1)}/10
                    </div>
                    <div class="meta-item">
                        <strong>📅</strong> ${releaseYear}
                    </div>
                    <div class="meta-item">
                        <strong>⏱️</strong> ${runtime}
                    </div>
                </div>
                <div class="modal-genres">
                    ${genresList}
                </div>
                <p class="modal-overview">${details.overview || 'Brak opisu filmu.'}</p>
                <div class="modal-actions">
                    <button class="action-btn btn-primary" id="modalBookmarkBtn">
                        ${isBookmarked ? '🔖 Usuń z listy' : '📑 Dodaj do listy'}
                    </button>
                    <button class="action-btn btn-secondary" onclick="closeModal()">Zamknij</button>
                </div>
            </div>
        `;
        
        // Bookmark button in modal
        document.getElementById('modalBookmarkBtn').addEventListener('click', () => {
            toggleWatchlist(movie);
            closeModal();
        });
    } catch (error) {
        console.error('Error fetching movie details:', error);
        modalBody.innerHTML = '<p style="padding: 40px; text-align: center;">Błąd podczas ładowania szczegółów filmu.</p>';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('movieModal');
    modal.classList.remove('active');
}

// Toggle watchlist
function toggleWatchlist(movie) {
    const index = watchlist.findIndex(m => m.id === movie.id);
    
    if (index > -1) {
        watchlist.splice(index, 1);
    } else {
        watchlist.push(movie);
    }
    
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
    
    // Update UI
    if (currentTab === 'discover') {
        displayMovies(allMovies);
    } else {
        displayWatchlist();
    }
}

// Display watchlist
function displayWatchlist() {
    displayMovies(watchlist, 'watchlistGrid');
}

// Tab switching
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'discover') {
        document.getElementById('discoverTab').classList.add('active');
        document.getElementById('filtersSection').style.display = 'block';
    } else {
        document.getElementById('forYouTab').classList.add('active');
        document.getElementById('filtersSection').style.display = 'none';
        displayWatchlist();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('movieModal');
    let searchTimeout;
    
    // Fetch initial data
    fetchGenres();
    fetchPopularMovies();
    
    // Search with debounce
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (currentTab === 'discover') {
                searchMovies(e.target.value);
            }
        }, 500);
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            if (currentTab === 'discover') {
                displayMovies(allMovies);
            }
        }
    });
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', () => {
        fetchMoviesWithFilters();
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Modal close
    modalClose.addEventListener('click', closeModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
