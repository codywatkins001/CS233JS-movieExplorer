import 'bootstrap/dist/css/bootstrap.min.css';

class TMDBClient {
  constructor(apiUrl, bearerToken) {
    this.apiUrl = apiUrl;
    this.bearerToken = bearerToken;
    this.genreSelectEl = document.getElementById('genre');
    this.yearInputEl = document.getElementById('year');
    this.searchBtn = document.getElementById('search-btn');
    this.resultsEl = document.getElementById('results');
  }

  async fetchGenres() {
    const endpoint = `${this.apiUrl}/genre/movie/list?language=en`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      }
    };

    try {
      const res = await fetch(endpoint, options);
      const data = await res.json();

      if (data.genres && data.genres.length > 0) {
        this.genreSelectEl.innerHTML += data.genres.map(genre =>
          `<option value="${genre.id}">${genre.name}</option>`
        ).join('');
      } else {
        this.genreSelectEl.innerHTML = `<option disabled>No genres found</option>`;
      }
    } catch (err) {
      console.error('Error fetching genres:', err);
      this.genreSelectEl.innerHTML = `<option disabled>Error loading genres</option>`;
    }
  }

  async fetchMovies(genreId, year) {
    const params = new URLSearchParams();

    if (genreId) params.append('with_genres', genreId);
    if (year) params.append('year', year);

    //sort option or language, etc.
    params.append('sort_by', 'popularity.desc'); //example sort by popularity descending

    const endpoint = `${this.apiUrl}/discover/movie?${params.toString()}`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      }
    };

    this.resultsEl.innerHTML = `<p>Loading movies...</p>`;

    try {
      const res = await fetch(endpoint, options);
      const data = await res.json();

      this.renderMovies(data.results);
    } catch (err) {
      console.error('Error fetching movies:', err);
      this.resultsEl.innerHTML = `<p>Error loading movies.</p>`;
    }
  }

  renderMovies(movies) {
  if (!movies || movies.length === 0) {
    this.resultsEl.innerHTML = `<p>No movies found.</p>`;
    return;
  }

  this.resultsEl.innerHTML = movies.map(movie => `
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
      <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}"class="card-img-top" alt="${movie.title}">
        <div class="card-body">
          <h5 class="card-title">${movie.title} (${new Date(movie.release_date).getFullYear() || 'N/A'})</h5>
          <p class="card-text">${movie.overview}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Rating: ${movie.vote_average}</small>
        </div>
      </div>
    </div>
  `).join('');
}


  setupEventListeners() {
    this.searchBtn.addEventListener('click', () => {
      const genreId = this.genreSelectEl.value;
      const year = this.yearInputEl.value.trim();
      this.fetchMovies(genreId, year);
    });
  }

  async init() {
    await this.fetchGenres();
    this.setupEventListeners();
  }
}

const url = 'https://api.themoviedb.org/3';
const bearer_token = BEARER_TOKEN;

const client = new TMDBClient(url, bearer_token);
client.init();
