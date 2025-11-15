// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const movieCards = document.querySelectorAll('.movie-card');

    // Search filter function
    const filterMovies = (searchTerm) => {
        const term = searchTerm.toLowerCase().trim();

        movieCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const description = card.getAttribute('data-description').toLowerCase();
            
            // Check if search term matches title or description
            if (title.includes(term) || description.includes(term)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    };

    // Event listener for search input
    searchInput.addEventListener('input', (e) => {
        filterMovies(e.target.value);
    });

    // Optional: Clear search on Escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterMovies('');
        }
    });
});
