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
    const res = await fetch(`${apiUrl}/genre/tv/list?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

async function loadShows(loadMore = false) {
    let url;
    const params = new URLSearchParams({
        api_key: apiKey,
        language: 'en-US',
        page: currentPage
    });

    if (currentQuery) {
        url = `${apiUrl}/search/tv`;
        params.append('query', currentQuery);
    } else {
        url = `${apiUrl}/discover/tv`;
        if (currentGenre) params.append('with_genres', currentGenre);
        if (currentSort) params.append('sort_by', currentSort);
    }

    const res = await fetch(`${url}?${params.toString()}`);
    const data = await res.json();
    if (!loadMore) moviesList.innerHTML = '';
    displayShows(data.results);
}

function displayShows(shows) {
    shows.forEach(show => {
        if (!show.poster_path) return;
        const card = document.createElement('div');
        card.classList.add('movie-card');
        const releaseYear = show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A';
        card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
      <h3>${show.name}</h3>
      <p>${releaseYear}</p>
      <p>${show.vote_average.toFixed(1)} ⭐</p>
      <button class="btnMovies" data-id="${show.id}">Info</button>
    `;
        moviesList.appendChild(card);
    });
    addInfoBtn();
}

searchButton.addEventListener('click', () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    loadShows();
});

genreSelect.addEventListener('change', () => {
    currentGenre = genreSelect.value;
    currentQuery = '';
    currentPage = 1;
    loadShows();
});

sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    currentPage = 1;
    loadShows();
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    loadShows(true);
});

document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    loadShows();
});

function addInfoBtn() {
    const infoBtn = document.querySelectorAll('.btnMovies');

    infoBtn.forEach(button => {
        button.addEventListener('click', async () => {
            const showId = button.dataset.id;

            try {
                const res = await fetch(`${apiUrl}/tv/${showId}?api_key=${apiKey}&language=en-US`);
                const show = await res.json();
                showModal(show);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}

function showModal(show) {
    const rating = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';
    const genres = show.genres.map(g => g.name).join(', ');
    const countries = show.origin_country.join(', ') || 'N/A';
    const backdropPath = show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : '';
    const posterPath = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '';
    const overview = show.overview || 'No description available.';
    const seasonsCount = show.number_of_seasons ?? 'N/A';
    const episodesCount = show.number_of_episodes ?? 'N/A';

    const modal = document.createElement('div');
    modal.classList.add('modalOverlay');
    modal.innerHTML = `
    <div class="modalWindow">
      <div class="modalBg" style="background-image: url('${backdropPath}')"></div>
      <div class="modal-wrapper">
        <span class="modal-close">&times;</span>
        <img src="${posterPath}" alt="${show.name}" class="modalPoster">
        <div class="modalInfo">
            <h2>${show.name}</h2>
            <p>First Air Date: <span>${show.first_air_date}</span></p>
            <p>Seasons: <span>${seasonsCount}</span></p>
            <p>Episodes: <span>${episodesCount}</span></p>
            <p>Rating: <span>${rating} ⭐</span></p>
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
