const WATCHLIST_STORAGE_KEY = "cozy_movies_watchlist";

function getWatchlist() {
  const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveWatchlist(movies) {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(movies));
}

function addMovieToWatchlist(movie) {
  if (!movie || !movie.imdbID) {
    return false;
  }

  const movies = getWatchlist();
  const alreadyExists = movies.some((item) => item.imdbID === movie.imdbID);

  if (alreadyExists) {
    return false;
  }

  movies.push(movie);
  saveWatchlist(movies);
  return true;
}

function removeMovieFromWatchlist(imdbID) {
  const movies = getWatchlist();
  const updatedMovies = movies.filter((movie) => movie.imdbID !== imdbID);

  saveWatchlist(updatedMovies);
  return updatedMovies;
}

function renderWatchlist() {
  const watchlistSection = document.querySelector("#watchlist .section-grid");

  if (!watchlistSection) {
    return;
  }

  const movies = getWatchlist();

  if (movies.length === 0) {
    watchlistSection.innerHTML =
      '<p class="light-gray">Your watchlist is empty. Go to search and add a movie.</p>';
    return;
  }

  const removeButtons = watchlistSection.querySelectorAll(
    ".remove-watchlist-btn",
  );

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      removeMovieFromWatchlist(button.dataset.imdbId);
      renderWatchlist();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupWatchlistYearSort();
  renderWatchlist();
});
