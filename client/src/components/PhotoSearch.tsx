import React, { useState } from 'react';

interface PhotoSearchProps {
  tags: string[]; // The tags that will be filtered
  onSearch: (query: string) => void; // Function to handle the search action
}

const PhotoSearch: React.FC<PhotoSearchProps> = ({ tags, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State to store the current search query

  // Handle change in the input field
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update the search query state
  };

  // Handle form submission (search action)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission
    onSearch(searchQuery); // Trigger the search with the current query
  };

  return (
    <div className="photo-search">
      <form onSubmit={handleSearchSubmit}> {/* Use form to allow "Enter" key submission */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange} // Update query as user types
          placeholder="Search by AI tag..." // Placeholder for input field
        />
        <button type="submit">Search</button> {/* Button to trigger search */}
      </form>

      {/* Show the list of filtered tags if there are any */}
      {tags.length > 0 && (
        <div className="tags">
          <strong>Filtered Tags:</strong>
          <ul>
            {tags.map((tag, index) => (
              <li key={index}>{tag}</li> // Display each filtered tag
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PhotoSearch;
