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
        <h1 className="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <rect x="2" y="3" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 9h20M9 3v6M15 3v6" stroke="currentColor" strokeWidth="2"/>
            <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
            <circle cx="17" cy="14" r="1.5" fill="currentColor"/>
          </svg>
          Movie Feed
        </h1>
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
