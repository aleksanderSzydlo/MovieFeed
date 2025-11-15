import React, { useState } from 'react';

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  let searchTimeout;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      onSearch('');
    }
  };

  return (
    <header>
      <div className="container">
        <h1 className="logo">🎬 Movie Feed</h1>
        <div className="search-container">
          <input
            type="text"
            id="searchInput"
            placeholder="Szukaj filmów..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
