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

function getStartYear(yearText) {
  const match = String(yearText || "").match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function getYearSortOrder() {
  const sortSelect = document.getElementById("watchlist-sort-year");
  return sortSelect ? sortSelect.value : "desc";
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

  const sortOrder = getYearSortOrder();
  const sortedMovies = [...movies].sort((a, b) => {
    const yearA = getStartYear(a.year);
    const yearB = getStartYear(b.year);

    if (sortOrder === "asc") {
      return yearA - yearB;
    }

    return yearB - yearA;
  });

  watchlistSection.innerHTML = sortedMovies
    .map(
      (movie) => `
      <div class="movie-card" data-imdb-id="${movie.imdbID}">
        <img class="movie-img" src="${movie.poster}" alt="${movie.title}" />
        <h3 class="movie-title light-gray">${movie.title} (${movie.year})</h3>
        <button class="secondary-button beige remove-watchlist-btn" data-imdb-id="${movie.imdbID}">Remove</button>
      </div>
    `,
    )
    .join("");

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

function setupWatchlistYearSort() {
  const sortSelect = document.getElementById("watchlist-sort-year");
  const sortDropdown = document.getElementById("watchlist-sort-dropdown");
  const sortTrigger = document.getElementById("watchlist-sort-trigger");
  const sortLabel = document.getElementById("watchlist-sort-label");
  const sortOptions = document.querySelectorAll(".watchlist-sort-option");

  if (!sortSelect || !sortDropdown || !sortTrigger || !sortLabel) {
    return;
  }

  function syncSortUi() {
    const selectedValue = sortSelect.value;

    sortOptions.forEach((optionButton) => {
      const isSelected = optionButton.dataset.value === selectedValue;
      const optionItem = optionButton.parentElement;

      if (optionItem) {
        optionItem.hidden = isSelected;
      }

      if (isSelected) {
        sortLabel.textContent = optionButton.textContent.trim();
      }
    });
  }

  function closeDropdown() {
    sortDropdown.classList.remove("is-open");
    sortTrigger.setAttribute("aria-expanded", "false");
  }

  sortTrigger.addEventListener("click", () => {
    syncSortUi();
    const isOpen = sortDropdown.classList.toggle("is-open");
    sortTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  sortOptions.forEach((optionButton) => {
    optionButton.addEventListener("click", () => {
      const selectedValue = optionButton.dataset.value;
      const selectedLabel = optionButton.textContent.trim();

      sortSelect.value = selectedValue;
      sortLabel.textContent = selectedLabel;
      syncSortUi();
      closeDropdown();
      renderWatchlist();
    });
  });

  document.addEventListener("click", (event) => {
    if (!sortDropdown.contains(event.target)) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
    }
  });

  syncSortUi();
}

window.getWatchlist = getWatchlist;
window.addMovieToWatchlist = addMovieToWatchlist;

document.addEventListener("DOMContentLoaded", () => {
  setupWatchlistYearSort();
  renderWatchlist();
});