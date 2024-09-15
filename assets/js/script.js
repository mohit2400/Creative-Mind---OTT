const apiKey = "04c35731a5ee918f014970082a0088b1"; // Replace with your API key
const baseURL = "https://api.themoviedb.org/3";

// Comprehensive genre mapping from TMDb to common genres (Netflix/Amazon-like)
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romantic",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// List of genre IDs to include (common ones for filtering)
const requiredGenres = [28, 18, 35, 27, 16, 10749];

// Fetch movies or TV shows from the endpoint
async function fetchMovies(endpoint) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}?api_key=${apiKey}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
}

// Create a card element for the movie/TV show
function createCard(item, isMovie = true) {
  const title = isMovie ? item.title : item.name; // Use 'title' for movies, 'name' for TV shows
  const releaseDate = isMovie ? item.release_date : item.first_air_date; // Use 'release_date' for movies, 'first_air_date' for TV shows
  const genreIds = item.genre_ids || [];
  const genres =
    genreIds
      .map((id) => genreMap[id])
      .filter(Boolean)
      .join(", ") || "Unknown";

  return `
          <div class="ott__card">
            <img
              src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${title}" class="card__image"
            />
            <div class="card__content text-center">
              <h5 class="card__title my-0">${title}</h5>
              <p class="card__description text-pretty text-wrap text-truncate my-0">
                ${item.overview}
              </p>
              <p class="card__genre my-0"><b>Genre:</b> ${genres}</p>
              <p class="card__release-date my-0"><b>Release Date:</b> ${releaseDate}</p>
              <button class="btn btn-secondary">Watch Now</button>
              <button class="btn btn-outline-secondary">Details</button>
            </div>
          </div>
    `;
}

// Filter and limit the items based on genre and return a specified number of items
function filterByGenreAndLimit(items, genre, limit = 20) {
  let filteredItems = items;

  // Filter by specific genre if provided
  if (genre) {
    const genreId = Object.keys(genreMap).find((id) => genreMap[id] === genre);
    filteredItems = items.filter((item) =>
      item.genre_ids.includes(Number(genreId))
    );
  }

  // Limit the number of items
  return filteredItems.slice(0, limit);
}

// Render content for each section
async function renderContent({
  endpoint = "movie/popular", // Default endpoint
  genre = null, // Default: no genre filtering
  limit = 20, // Default: render up to 20 items
  containerId = "content-container", // The container to render into
  isMovie = true, // Default: assumes movie (change to false for TV shows)
} = {}) {
  const items = await fetchMovies(endpoint);

  // Filter and limit the items
  const filteredItems = filterByGenreAndLimit(items, genre, limit);

  // Render the filtered and limited content
  document.getElementById(containerId).innerHTML = filteredItems
    .map((item) => createCard(item, isMovie))
    .join("");
}

// Example usage
document.addEventListener("DOMContentLoaded", () => {
  // Popular Movies (default: 20 items)
  renderContent({
    endpoint: "movie/popular",
    containerId: "popular-movies-container",
    isMovie: true,
  });

  // New Releases with limit of 6 cards and filtered by Action genre

  // renderContent({
  //   endpoint: "movie/now_playing",
  //   genre: "Action",
  //   limit: 6,
  //   containerId: "new-releases-container",
  //   isMovie: true,
  // });
  renderContent({
    endpoint: "movie/now_playing",
    containerId: "new-releases-container",
    isMovie: true,
  });

  // TV Shows with limit of 6 cards, filtered by Comedy genre
  renderContent({
    endpoint: "tv/popular",
    containerId: "tv-shows-container",
    isMovie: false,
  });

  // Another example for Trending Movies, no genre filter, default limit 20
  renderContent({
    endpoint: "trending/movie/week",
    containerId: "trending-movies-container",
    isMovie: true,
  });
});