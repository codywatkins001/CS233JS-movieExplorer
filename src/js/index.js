/*
Modified by: Cody Watkins
Date: 06/04/2025
Lab: 07
*/

import '../css/style.css';

const genreSelectEl = document.getElementById('genre');

async function fetchGenres() {
  const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${bearer_token}`
    }
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (data.genres && data.genres.length > 0) {
      genreSelectEl.innerHTML += data.genres.map(genre => `
        <option value="${genre.id}">${genre.name}</option>
      `).join('');
    } else {
      genreSelectEl.innerHTML += `<option disabled>No genres found</option>`;
    }
  } catch (err) {
    console.error("Error fetching genres:", err);
    genreSelectEl.innerHTML += `<option disabled>Error loading genres</option>`;
  }
}

fetchGenres();
