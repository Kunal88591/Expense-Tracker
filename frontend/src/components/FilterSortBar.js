import React from 'react';
import '../styles/FilterSortBar.css';

function FilterSortBar({ categories, selectedCategory, onCategoryChange, sortOrder, onSortChange }) {
  return (
    <div className="filter-sort-bar">
      <div className="filter-group">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-filter">Sort by Date:</label>
        <select
          id="sort-filter"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSortBar;
