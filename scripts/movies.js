const apiKey = 'f2d8f9d3a0cc282910248a7c4ab509c1';
const apiUrl = 'https://api.themoviedb.org/3';

const genreSelect = document.getElementById('genreSelect');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const moviesList = document.getElementById('moviesList');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let currentPage = 1;
let currentQuery = '';
let currentGenre = '';
let currentSort = '';

async function loadGenres() {
    const res = await fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

async function loadMovies(loadMore = false) {
    let url;
    const params = new URLSearchParams({
        api_key: apiKey,
        language: 'en-US',
        page: currentPage
    });

    if (currentQuery) {
        url = `${apiUrl}/search/movie`;
        params.append('query', currentQuery);
    } else {
        url = `${apiUrl}/discover/movie`;
        if (currentGenre) params.append('with_genres', currentGenre);
        if (currentSort) params.append('sort_by', currentSort);
    }

    const res = await fetch(`${url}?${params.toString()}`);
    const data = await res.json();
    if (!loadMore) moviesList.innerHTML = '';
    displayMovies(data.results);
}

function displayMovies(movies) {
    console.log(movies);
    movies.forEach(movie => {
        if (!movie.poster_path) return;
        const card = document.createElement('div');
        card.classList.add('movie-card');
        const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${releaseYear}</p>
      <p>${movie.vote_average.toFixed(1)} ⭐</p>
      <a href="movie.html?id=${movie.id}" class="btnMovies">More Info</a>
    `;
        moviesList.appendChild(card);
    });
    addInfoBtn();
}

searchButton.addEventListener('click', () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    loadMovies();
});

genreSelect.addEventListener('change', () => {
    currentGenre = genreSelect.value;
    currentQuery = '';
    currentPage = 1;
    loadMovies();
});

sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    currentPage = 1;
    loadMovies();
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    loadMovies(true); // append, не перезаписываем
});

document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    loadMovies();
});

function addInfoBtn() {
    const infoBtn = document.querySelectorAll('.btnMovies');

    infoBtn.forEach(button => {
        button.addEventListener('click', async () => {
            const movieId = button.dataset.id;

            try {
                const res = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`);
                const movie = await res.json();
                console.log(movie);
                showModal(movie);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}
function showModal(movie) {
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min` : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const genres = movie.genres.map(g => g.name).join(', ');
    const countries = movie.production_countries.map(country => country.name).join(', ') || 'N/A';
    const backdropPath = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '';
    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
    const overview = movie.overview || 'No description available.';

    const modal = document.createElement('div');
    modal.classList.add('modalOverlay');
    modal.innerHTML = `
    <div class="modalWindow">
      <div class="modalBg" style="background-image: url('${backdropPath}')"></div>
      <div class="modal-wrapper">
        <span class="modal-close">&times;</span>
        <img src="${posterPath}" alt="${movie.title}" class="modalPoster">
        <div class="modalInfo">
            <h2>${movie.title}</h2>
            <p>Release Date: <span>${movie.release_date}</span></p>
            <p>Duration: <span> ${runtime} </span></p> 
            <p>Rating: <span> ${rating} ⭐ </span></p>
            <p>Genres: <span>${genres}</span></p>
            <p>Countries: <span>${countries}</span></p>
            <p>${overview}</p>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    setTimeout(()=>{
        modal.querySelector('.modalWindow').classList.add('appearance');
    },50)
}


