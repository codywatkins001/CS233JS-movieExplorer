/*
Modified by: Cody Watkins
Date: 06/04/2025
Lab: 07
*/

import '../css/style.css';

const genreSelectEl = document.getElementById('genre');

async function fetchGenres() {
  const apiKey = api_key;
  const baseUrl = url;

  const endpoint = `${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`;
  console.log("Fetching from:", endpoint);
  
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.genres && data.genres.length > 0) {
      genreSelectEl.innerHTML += data.genres.map(genre => `
        <option value="${genre.id}">${genre.name}</option>
      `).join('');
    } else {
      genreSelectEl.innerHTML += `<option disabled>No genres found</option>`;
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
    genreSelectEl.innerHTML += `<option disabled>Error loading genres</option>`;
  }
}

fetchGenres();
