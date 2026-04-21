const API_KEY = "a8d48019";

async function fetchMovieByTitle(title) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;
  const response = await fetch(url);
  return response.json();
}

function setupSearchPage() {
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-btn");
  const resultImage = document.getElementById("result-img");
  const resultTitle = document.getElementById("result-title");
  const resultDescription = document.getElementById("result-description");

  if (
    !searchInput ||
    !searchButton ||
    !resultImage ||
    !resultTitle ||
    !resultDescription ||
    !resultGenre ||
    !resultRuntime ||
    !resultLanguage ||
    !resultActors ||
    !addToWatchlistButton
  ) {
    return;
  }

  addToWatchlistButton.disabled = true;
  const searchedSection = document.getElementById("searched-section");

  if (searchedSection) {
    searchedSection.classList.remove("is-visible");
  }

  async function handleSearch() {
    const title = searchInput.value.trim();

    if (!title) {
      if (searchedSection) {
        searchedSection.classList.remove("is-visible");
      }

      resultTitle.textContent = "Enter a movie title";
      resultDescription.textContent = "Please type a title and press Find.";
      resultImage.src = "";
      resultImage.alt = "";
      resultGenre.textContent = "-";
      resultRuntime.textContent = "-";
      resultLanguage.textContent = "-";
      resultActors.textContent = "-";
      addToWatchlistButton.disabled = true;
      lastMovie = null;
      return;
    }

    searchInput.value = "";

    if (searchedSection) {
      searchedSection.classList.add("is-visible");
    }

    const movieData = await fetchMovieByTitle(title);

    if (!movieData || movieData.Response === "False") {
      resultTitle.textContent = "Movie not found";
      resultDescription.textContent = "Try another movie title.";
      resultImage.src = "";
      resultImage.alt = "";
      resultGenre.textContent = "-";
      resultRuntime.textContent = "-";
      resultLanguage.textContent = "-";
      resultActors.textContent = "-";
      addToWatchlistButton.disabled = true;
      lastMovie = null;
      return;
    }

    addToWatchlistButton.disabled = false;
    lastMovie = {
      imdbID: movieData.imdbID,
      title: movieData.Title,
      year: movieData.Year,
      poster:
        movieData.Poster && movieData.Poster !== "N/A"
          ? movieData.Poster
          : "images/rec1.webp",
    };
  }

  searchButton.addEventListener("click", handleSearch);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });

  addToWatchlistButton.addEventListener("click", () => {
    if (!lastMovie || typeof window.addMovieToWatchlist !== "function") {
      return;
    }

    const added = window.addMovieToWatchlist(lastMovie);

    if (added) {
      addToWatchlistButton.textContent = "Added";
      setTimeout(() => {
        addToWatchlistButton.textContent = "Add to watchlist";
      }, 1200);
    } else {
      addToWatchlistButton.textContent = "Already in watchlist";
      setTimeout(() => {
        addToWatchlistButton.textContent = "Add to watchlist";
      }, 1200);
    }
  });
}

document.addEventListener("DOMContentLoaded", setupSearchPage);