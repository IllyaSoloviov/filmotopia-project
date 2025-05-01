const apiKey = 'f2d8f9d3a0cc282910248a7c4ab509c1';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const movieDetails = document.getElementById('movieDetails');

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
console.log(movieId);
if (movieId) {
    loadMovies(movieId);
}


async function loadMovies(id) {
    try {
        const res = await fetch(`${apiUrl}/movie/${id}?api_key=${apiKey}&language=en-US`);
        const movie = await res.json();
        console.log(movie);
        const trailerRes = await fetch(`${apiUrl}/movie/${id}/videos?api_key=${apiKey}&language=en-US`);
        const trailerData = await trailerRes.json();
        console.log(trailerData)
        const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

        displayMovies(movie, trailer);
    } catch (error){
        console.error(error);
    }
}

function displayMovies(movie, trailer) {
    const backdropPath = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '';
    movieDetails.innerHTML = `
<div class="backGroundMovie" style="background-image: url('${backdropPath}')"></div>
<div class="posterMovie">
<img src="${imageBaseUrl + movie.poster_path}" alt="${movie.title}" style="max-width: 300px;">
</div>
<div class="infoMovie">
<h1>${movie.title}</h1>
<p><em>${movie.tagline || ''}</em></p>
<p><strong>Release Date: </strong> ${movie.release_date}</p>
<p><strong>Runtime: </strong> ${movie.runtime} minutes</p>
<p><strong>Genres: </strong> ${movie.genres.map(g => g.name).join(', ')}</p>
<p><strong>Rating: </strong> ${movie.vote_average} (${movie.vote_count} votes)</p>
<p><strong>Overview: </strong><br> ${movie.overview}</p>
</div>
<div class="trailerMovie">
 ${trailer ? `
        <h2>Trailer</h2>
        <iframe 
            src="https://www.youtube.com/embed/${trailer.key}" 
            frameborder="0" allowfullscreen>
        </iframe>
    ` : '<p>No trailer found.</p>'}
</div>       
    `;
}

