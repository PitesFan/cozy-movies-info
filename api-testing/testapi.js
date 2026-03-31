async function extractMovieInfo(movieName, apiKey) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieName)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

document.getElementById("btn").addEventListener("click", async () => {
  const apiKey = "a8d48019";
  const movieName = document.getElementById("movieInput").value.trim();
  const output = document.getElementById("output");
  const posterImg = document.getElementById("poster");

  if (!movieName) {
    output.textContent = "Please enter a movie title.";
    posterImg.style.display = "none";
    return;
  }

  const movieData = await extractMovieInfo(movieName, apiKey);

  if (!movieData || movieData.Response === "False") {
    output.textContent = "Movie not found.";
    posterImg.style.display = "none";
    return;
  }

  // ✅ Display text info
  output.textContent = `Title: ${movieData.Title}
Year: ${movieData.Year}
Genre: ${movieData.Genre}
Plot: ${movieData.Plot}`;

  // ✅ Always use the high‑quality JSON poster
  let posterUrl = movieData.Poster;

  if (posterUrl && posterUrl !== "N/A") {
    posterImg.src = posterUrl; // high-resolution Amazon poster
    posterImg.style.display = "block";
  } else {
    // If no poster, hide it
    posterImg.style.display = "none";
  }
});
