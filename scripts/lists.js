const favoritesContainer = document.getElementById('favoritesContainer');
let titleList = document.querySelector('.titleList');
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

if (favorites.length === 0) {
    titleList.innerHTML = '<span>Yikes!</span> This place is ,<span>empty</span>.';
} else {
    titleList.innerHTML = '<span>Your</span> favorites <span>list</span>.';
    favorites.forEach(movie => {
        const movieLine = document.createElement('div');
        movieLine.classList.add('movieLine');

        movieLine.innerHTML = `
            <a href="movie.html?id=${movie.id}"><img src="${imageBaseUrl + movie.poster_path}" alt="${movie.title}"></a>
            <a href="movie.html?id=${movie.id}"><h3>${movie.title}</h3></a>
            <p>${movie.release_date}</p>
            <button class="remove-btn" data-id="${movie.id}">Delate</button> 
        `;
        favoritesContainer.appendChild(movieLine);
    });
}
favoritesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const movieId = e.target.getAttribute('data-id');
        removeFromFavorites(movieId);
    }
});
function removeFromFavorites(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(movie => movie.id !== parseInt(movieId));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    window.location.reload();
}
