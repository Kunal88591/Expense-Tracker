import React from 'react';

function FilterSortBar({ categories, selectedCategory, onCategoryChange, sortOrder, onSortChange }) {
  return (
    <div className="card mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Filters & Sorting</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sort by Date */}
        <div>
          <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Sort by Date
          </label>
          <select
            id="sort-filter"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="input-field"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>

        {/* Filter by Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Badge */}
      {selectedCategory && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filter:</span>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {selectedCategory}
            <button
              onClick={() => onCategoryChange(null)}
              className="text-blue-800 hover:text-blue-600 ml-2"
            >
              ✕
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

export default FilterSortBar;
