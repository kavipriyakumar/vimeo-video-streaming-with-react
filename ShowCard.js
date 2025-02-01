import React from 'react';

const ShowCard = ({ show }) => (
  <div className="show-card">
    <img
      src={show.image?.medium || 'https://via.placeholder.com/210x295'}
      alt={show.name}
      className="show-image"
    />
    <div className="show-details">
      <h3>{show.name}</h3>
      <p>Language: {show.language}</p>
      <p>Genres: {show.genres.join(', ') || 'N/A'}</p>
      <p>Rating: {show.rating.average || 'N/A'}</p>
      <a href={show.officialSite} target="_blank" rel="noreferrer">
        Visit Official Site
      </a>
    </div>
  </div>
);

export default ShowCard;
