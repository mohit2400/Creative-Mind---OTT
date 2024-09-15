const apiKey = 'YOUR_API_KEY';  // Replace with your actual TMDb API key
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Utility function to fetch data from TMDb API
async function fetchMovies(endpoint) {
    try {
        const response = await fetch(`${baseUrl}${endpoint}?api_key=${apiKey}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Utility function to create movie card elements
function createMovieCard(item) {
    const title = item.title || item.name || 'Unknown Title';
    const posterPath = item.poster_path ? `${imageBaseUrl}${item.poster_path}` : 'path/to/placeholder-image.jpg';
    const overview = item.overview || 'No description available';
    const releaseDate = item.release_date || item.first_air_date || 'Unknown';

    return `
        <div class="ott__card">
            <img src="${posterPath}" alt="${title}" class="card__image" />
            <div class="card__content text-center">
                <h5 class="card__title my-0">${title}</h5>
                <p class="card__description text-pretty text-wrap text-truncate my-0">
                    ${overview}
                </p>
                <p class="card__release-date my-0">Release Date: ${releaseDate}</p>
                <button class="btn btn-secondary">Watch Now</button>
                <button class="btn btn-outline-secondary">Details</button>
            </div>
        </div>
    `;
}

// Function to render movies in a given container
async function renderMovies(endpoint, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const movies = await fetchMovies(endpoint);
    const moviesHtml = movies.slice(0, 20).map(createMovieCard).join('');
    container.innerHTML = moviesHtml;
}

// Fetch and render different movie categories when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Top Hits
    renderMovies('/movie/top_rated', 'top-hits-container');

    // Action Movies (Genre ID: 28)
    renderMovies('/discover/movie?with_genres=28', 'action-movies-container');

    // Drama Movies (Genre ID: 18)
    renderMovies('/discover/movie?with_genres=18', 'drama-movies-container');

    // Romance Movies (Genre ID: 10749)
    renderMovies('/discover/movie?with_genres=10749', 'romance-movies-container');

    // Horror Movies (Genre ID: 27)
    renderMovies('/discover/movie?with_genres=27', 'horror-movies-container');
});
