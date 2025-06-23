import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [gifs, setGifs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const API_KEY = 'lRViRqPGywjQVtvdxFwev0NqwkiRO7eq';
  const LIMIT = 25;

  // Fetch trending GIFs on initial load
  useEffect(() => {
    fetchTrendingGifs();
  }, []);

  const fetchTrendingGifs = async (loadMore = false) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${LIMIT}&offset=${loadMore ? offset : 0}`
      );
      
      if (loadMore) {
        setGifs(prev => [...prev, ...response.data.data]);
      } else {
        setGifs(response.data.data);
        setOffset(0);
      }
      
      setOffset(prev => loadMore ? prev + LIMIT : LIMIT);
    } catch (error) {
      console.error('Error fetching trending GIFs:', error);
    }
    setLoading(false);
  };

  const searchGifs = async (loadMore = false) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=${LIMIT}&offset=${loadMore ? offset : 0}`
      );
      
      if (loadMore) {
        setGifs(prev => [...prev, ...response.data.data]);
      } else {
        setGifs(response.data.data);
        setOffset(0);
      }
      
      setOffset(prev => loadMore ? prev + LIMIT : LIMIT);
      setIsSearchMode(true);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchGifs();
    }
  };

  const handleLoadMore = () => {
    if (isSearchMode) {
      searchGifs(true);
    } else {
      fetchTrendingGifs(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchMode(false);
    setOffset(0);
    fetchTrendingGifs();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo" onClick={clearSearch}>GIPHY</h1>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search all the GIFs and Stickers"
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </div>
          </form>
        </div>
      </header>

      <main className="main-content">
        <div className="content-header">
          <h2>{isSearchMode ? `Search Results for "${searchTerm}"` : 'Trending GIFs'}</h2>
          {isSearchMode && (
            <button onClick={clearSearch} className="clear-search-btn">
              Back to Trending
            </button>
          )}
        </div>

        <div className="gifs-grid">
          {gifs.map((gif) => (
            <div key={gif.id} className="gif-item">
              <img
                src={gif.images.fixed_width.url}
                alt={gif.title}
                loading="lazy"
                className="gif-image"
              />
              <div className="gif-overlay">
                <p className="gif-title">{gif.title}</p>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading GIFs...</p>
          </div>
        )}

        {gifs.length > 0 && !loading && (
          <div className="load-more-container">
            <button onClick={handleLoadMore} className="load-more-btn">
              Load More
            </button>
          </div>
        )}

        {gifs.length === 0 && !loading && isSearchMode && (
          <div className="no-results">
            <p>No GIFs found for "{searchTerm}". Try a different search term.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
