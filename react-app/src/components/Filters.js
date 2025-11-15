import React, { useState } from 'react';

function Filters({ genres, onApplyFilters }) {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSort, setSelectedSort] = useState('popularity.desc');
  const [selectedYear, setSelectedYear] = useState('');

  const handleApply = () => {
    onApplyFilters({
      genre: selectedGenre,
      sort: selectedSort,
      year: selectedYear
    });
  };

  return (
    <div className="filters-section">
      <div className="filters-container">
        <div className="filter-group">
          <label>Gatunek:</label>
          <select
            className="filter-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Wszystkie</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sortuj:</label>
          <select
            className="filter-select"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="popularity.desc">Popularność (malejąco)</option>
            <option value="vote_average.desc">Ocena (malejąco)</option>
            <option value="release_date.desc">Data premiery (najnowsze)</option>
            <option value="title.asc">Tytuł (A-Z)</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Rok:</label>
          <select
            className="filter-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Wszystkie lata</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
        
        <button className="apply-filters-btn" onClick={handleApply}>
          Zastosuj filtry
        </button>
      </div>
    </div>
  );
}

export default Filters;
