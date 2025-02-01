import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [videos, setVideos] = useState([]); // List of videos
  const [selectedVideo, setSelectedVideo] = useState(null); // Currently selected video
  const [error, setError] = useState(''); // Error message for API calls
  const [searchTerm, setSearchTerm] = useState(''); // Search term for videos

  const ACCESS_TOKEN = '12e8bf1d871aac4df82f01d30218dc7b'; // Replace with your Vimeo access token

  // Default videos (using Vimeo video IDs provided)
  const defaultVideos = [
    { id: '1048869506', title: 'Video 1' },
    { id: '1048984535', title: 'Video 2' },
    { id: '1031913241', title: 'Video 3' },
    { id: '1044536755', title: 'Video 4' },
    { id: '1046443161', title: 'Video 5' },
    { id: '346721734', title: 'Video 6' },
    { id: '615781592', title: 'Video 7' },
    { id: '565911430', title: 'Video 8' },
  ];

  // Fetch video details for default videos from Vimeo API using video ID
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoDetails = await Promise.all(
          defaultVideos.map(async (video) => {
            const response = await axios.get(`https://api.vimeo.com/videos/${video.id}`, {
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            });
            return response.data;
          })
        );
        setVideos(videoDetails); // Set the videos from the API response
        setError('');
      } catch (err) {
        setError('Failed to fetch videos. Please check your access token.');
        console.error('Error fetching videos:', err.response?.data || err.message);
      }
    };

    fetchVideos();
  }, []);

  // Fetch public videos based on search term
  useEffect(() => {
    if (!searchTerm) return; // Don't fetch videos if searchTerm is empty

    const fetchSearchVideos = async () => {
      try {
        const response = await axios.get('https://api.vimeo.com/videos', {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
          params: {
            query: searchTerm, // Search query
            per_page: 6, // Number of results to return
          },
        });

        if (response.data.data.length > 0) {
          setVideos(response.data.data); // Set the videos from the API response
          setError('');
        } else {
          setError('No videos found.');
        }
      } catch (err) {
        setError('Failed to fetch videos. Please check your access token.');
        console.error('Error fetching videos:', err.response?.data || err.message);
      }
    };

    fetchSearchVideos();
  }, [searchTerm]);

  return (
    <div className="app">
      {/* Main Content */}
      <div className="content">
        <i><h1>VIMEO THE STREAMING APP</h1></i>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
          />
        </div>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Video Player - Displayed when a video is selected */}
        {selectedVideo ? (
          <div className="video-player">
            <iframe
              title={selectedVideo.name}
              src={`https://player.vimeo.com/video/${selectedVideo.uri.split('/')[2]}?autoplay=1`}
              frameBorder="0"
              width="100%"
              height="400px"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
            <h2>{selectedVideo.name}</h2>
            <button onClick={() => setSelectedVideo(null)}>Back to Video List</button>
          </div>
        ) : (
          // Default Video Cards - Displayed when no video is selected
          <div className="video-list">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div
                  key={video.uri}
                  className="video-card"
                  onClick={() => setSelectedVideo(video)} // Set selected video on click
                >
                  <img
                    src={video.pictures?.sizes[2]?.link || 'https://via.placeholder.com/210x118'}
                    alt={video.name}
                    className="thumbnail"
                  />
                  <h3>{video.name}</h3> {/* Display title only */}
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
