const darkMode = document.getElementById("dark-mode");
const searchBtn = document.getElementById("search-btn");
const searchBar = document.getElementById("search-bar");
const sectionMovies = document.getElementById("section-movies");
const sectionSavedMovies = document.getElementById("section-savedMovies");
const emptyWatchlist = document.getElementById("empty-watchlist");
const beforeLoadSection = document.getElementById("beforeLoad-sect");
const deleteBtn = document.getElementById("delete-btn");
const searchBarDiv = document.getElementById("searchbar-div");
const searchIcon = document.getElementById("search-icon");
let plotText = "";
let iconStyleDark = ``;
let darkModeClass = ``;
let addBtnDarkmode = ``;
let isDarkMode = false;
let countIsDarkMode = 0;
let countSearchedMovies = 0;
let icon = "";
let dataName = "";
let saveMovies = [];

let page = document.body.id;
let savedMoviesData = JSON.parse(localStorage.getItem("savedMovies"));
isDarkMode = JSON.parse(localStorage.getItem("isDarkMode"));

if (savedMoviesData) {
  saveMovies = savedMoviesData;
}
switch (page) {
  case "watchlist-page":
    icon = "minus";
    dataName = "remove";
    savedMoviesData = JSON.parse(localStorage.getItem("savedMovies"));
    emptyWatchlistVisibility();
    document.addEventListener("click", (e) => {
      if (e.target.dataset.remove) {
        for (let i = 0; i < savedMoviesData.length; i++) {
          if (e.target.dataset.remove === savedMoviesData[i].imdbID) {
            savedMoviesData.splice(i, 1);
            localStorage.setItem(
              "savedMovies",
              JSON.stringify(savedMoviesData)
            );
            renderSavedMovies(savedMoviesData);
            emptyWatchlistVisibility();
          }
        }
      }
    });
    deleteBtn.addEventListener("click", () => {
      if (savedMoviesData.length > 0) {
        savedMoviesData.splice(0, savedMoviesData.length);
        localStorage.clear("savedMovies");
        renderSavedMovies(savedMoviesData);
        emptyWatchlistVisibility();
      }
    });
    changeToDarkMode();
    renderSavedMovies(savedMoviesData);

    darkMode.addEventListener("click", changeToDarkMode);
    break;
  case "search-page":
    icon = "plus";
    dataName = "add";
    searchBtn.addEventListener("click", getMovies);
    searchBar.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        getMovies();
      }
    });
    isDarkMode = JSON.parse(localStorage.getItem("isDarkMode"));
    changeToDarkMode();
    darkMode.addEventListener("click", changeToDarkMode);

    break;
}

function emptyWatchlistVisibility() {
  if (!savedMoviesData) {
    deleteBtn.classList.add("visible");
    emptyWatchlist.classList.remove("visible");
  } else if (savedMoviesData.length === 0) {
    deleteBtn.classList.add("visible");
    emptyWatchlist.classList.remove("visible");
  } else {
    deleteBtn.classList.remove("visible");
    emptyWatchlist.classList.add("visible");
  }
}

async function getMovies() {
  countSearchedMovies++;
  const searchedMovie = searchBar.value;
  if (searchedMovie) {
    searchBar.value = "";
    const response = await fetch(
      `http://www.omdbapi.com/?s=${searchedMovie}&apikey=fc1fef96`
    );
    const data = await response.json();
    let movies = data.Search;
    if (data.Response === "False") {
      sectionMovies.innerHTML = "";
      document.getElementById("section-movies").classList.add("visible");
      beforeLoadSection.classList.remove("visible");
      document.getElementById(
        "h2-beforeload"
      ).textContent = `Unable to find what you’re looking for. Please try another search.`;
    } else {
      document.getElementById("section-movies").classList.remove("visible");
      beforeLoadSection.classList.add("visible");
      renderMovie(movies);
    }
  }
}

function renderMovie(movies) {
  for (let i = 0; i < movies.length; i++) {
    sectionMovies.innerHTML = "";
    let movieInfo = {};
    fetch(`http://www.omdbapi.com/?t=${movies[i].Title}&apikey=fc1fef96`)
      .then((res) => res.json())
      .then((movieData) => {
        if (isDarkMode) {
          plotText = `plot-text-darkmode`;
          darkModeClass = `genre-tab-darkmode`;
          iconStyleDark = "icon-style-darkmode";
          addBtnDarkmode = `add-btn-darkmode`;
        } else {
          darkModeClass = ``;
          plotText = ``;
          iconStyleDark = ``;
          addBtnDarkmode = ``;
        }
        feedHtml(movieData);
        const itemKeysBoolean = [];
        itemKeysBoolean.unshift(`{${movieData.imdbID}: false}`);
        document.addEventListener("click", (e) => {
          if (
            e.target.dataset.add &&
            movieData.imdbID === e.target.dataset.add
          ) {
            movieData;
            if (itemKeysBoolean[0]) {
              movieInfo = {
                Title: movieData.Title,
                Poster: movieData.Poster,
                Year: movieData.Year,
                imdbID: movieData.imdbID,
                imdbRating: movieData.imdbRating,
                Runtime: movieData.Runtime,
                Genre: movieData.Genre,
                Plot: movieData.Plot,
              };
              saveMovies.unshift(movieInfo);
              localStorage.setItem("savedMovies", JSON.stringify(saveMovies));
              saveMovies;
              document
                .getElementById(`icon-${movieData.imdbID}`)
                .classList.add("rotate");
              document
                .getElementById(`btn-${movieData.imdbID}`)
                .classList.add("clicked-txt");
            } else {
              document
                .getElementById(`icon-${movieData.imdbID}`)
                .classList.remove("rotate");
              document
                .getElementById(`btn-${movieData.imdbID}`)
                .classList.remove("clicked-txt");
              saveMovies;
              let index = saveMovies.indexOf(movieInfo);
              saveMovies.splice(index, 1);
              localStorage.setItem("savedMovies", JSON.stringify(saveMovies));
            }
            itemKeysBoolean[0] = !itemKeysBoolean[0];
          }
        });
      });
  }
}

function feedHtml(data) {
  // Create main div element
  let mainDiv = document.createElement("div");
  mainDiv.className = "movie";

  // Create movie poster div
  let moviePosterDiv = document.createElement("div");
  moviePosterDiv.className = "movie-poster";

  // Create img element for movie poster
  let img = document.createElement("img");
  img.src = data.Poster;

  // Append img to movie poster div
  moviePosterDiv.appendChild(img);

  // Append movie poster div to main div
  mainDiv.appendChild(moviePosterDiv);

  // Create movie info div
  let movieInfoDiv = document.createElement("div");
  movieInfoDiv.className = "movie-info";

  // Create title div
  let titleDiv = document.createElement("div");
  titleDiv.className = "title";

  // Create h5 element for movie title
  let h5 = document.createElement("h5");
  h5.textContent = data.Title;

  // Create p element for IMDb rating
  let p = document.createElement("p");
  p.innerHTML = `<i class="fa-solid fa-star star-icon"></i> ${data.imdbRating}`;

  // Append h5 and p to title div
  titleDiv.appendChild(h5);
  titleDiv.appendChild(p);

  // Append title div to movie info div
  movieInfoDiv.appendChild(titleDiv);

  // Create genre tab div
  let genreTabDiv = document.createElement("div");
  genreTabDiv.className = "genre-tab " + darkModeClass;
  genreTabDiv.id = "genreTab";

  // Create p element for runtime and genre
  let p2 = document.createElement("p");
  p2.textContent = data.Runtime + " " + data.Genre;

  // Create button element for watchlist
  let button = document.createElement("button");
  button.dataset[dataName] = data.imdbID;
  button.id = "btn-" + data.imdbID;
  button.className = "add-btn " + addBtnDarkmode;

  // Create i element for watchlist icon
  let i = document.createElement("i");
  i.id = "icon-" + data.imdbID;
  i.className = `fa-solid fa-circle-${icon} icon-style transition ${iconStyleDark}`;

  // Set button text
  button.textContent = "Watchlist";
  button.prepend(i);

  // Append p2 and button to genre tab div
  genreTabDiv.appendChild(p2);
  genreTabDiv.appendChild(button);

  // Append genre tab div to movie info div
  movieInfoDiv.appendChild(genreTabDiv);

  // Create plot paragraph
  let plotParagraph = document.createElement("p");
  plotParagraph.className = "plot-text " + plotText;
  plotParagraph.id = "plot-text";
  plotParagraph.textContent = data.Plot;

  // Append plot paragraph to movie info div
  movieInfoDiv.appendChild(plotParagraph);

  // Append movie info div to main div
  mainDiv.appendChild(movieInfoDiv);
  if (document.body.id === "watchlist-page") {
    sectionSavedMovies.appendChild(mainDiv);
  } else {
    // Append main div to the main tag
    sectionMovies.appendChild(mainDiv);
  }
}

function renderSavedMovies(savedItems) {
  if (savedItems) {
    sectionSavedMovies.innerHTML = "";
    if (isDarkMode) {
      plotText = `plot-text-darkmode`;
      darkModeClass = `genre-tab-darkmode`;
      iconStyleDark = "icon-style-darkmode";
      addBtnDarkmode = `add-btn-darkmode`;
    } else {
      darkModeClass = ``;
      plotText = ``;
      iconStyleDark = ``;
      addBtnDarkmode = ``;
    }
    for (let i = 0; i < savedItems.length; i++) {
      feedHtml(savedItems[i]);
    }
  }
}

function changeToDarkMode() {
  isDarkMode = !isDarkMode;
  const genreTabEl = document.querySelectorAll("#genreTab");
  const plotTabEl = document.querySelectorAll("#plot-text");
  const iconStyleEl = document.querySelectorAll(".icon-style");
  const addBtnEl = document.querySelectorAll(".add-btn");

  if (document.body.id === "search-page") {
    if (countIsDarkMode === 0) {
      if (isDarkMode) {
        document.body.classList.add("dark-mode");
        searchBarDiv.classList.add("searchbar-div-darkmode");
        searchIcon.classList.add("search-icon-darkmode");
        searchBar.classList.add("searchbar-darkmode");
        searchBtn.classList.add("search-btn-darkmode");
        beforeLoadSection.classList.add("before-load-darkmode");

        darkMode.checked = true;
      } else {
        document.body.classList.remove("dark-mode");
        searchBarDiv.classList.remove("searchbar-div-darkmode");
        searchIcon.classList.remove("search-icon-darkmode");
        searchBar.classList.remove("searchbar-darkmode");
        searchBtn.classList.remove("search-btn-darkmode");
        beforeLoadSection.classList.remove("before-load-darkmode");
      }
    } else {
      document.body.classList.toggle("dark-mode");
      searchBarDiv.classList.toggle("searchbar-div-darkmode");
      searchIcon.classList.toggle("search-icon-darkmode");
      searchBar.classList.toggle("searchbar-darkmode");
      searchBtn.classList.toggle("search-btn-darkmode");
      beforeLoadSection.classList.toggle("before-load-darkmode");
      if (isDarkMode && genreTabEl != null) {
        genreTabEl.forEach((el) => el.classList.add("genre-tab-darkmode"));
        plotTabEl.forEach((el) => el.classList.add("plot-text-darkmode"));
        iconStyleEl.forEach((element) =>
          element.classList.add("icon-style-darkmode")
        );
        addBtnEl.forEach((element) =>
          element.classList.add("add-btn-darkmode")
        );
      } else if (!isDarkMode && genreTabEl != null) {
        genreTabEl.forEach((el) => el.classList.remove("genre-tab-darkmode"));
        plotTabEl.forEach((el) => el.classList.remove("plot-text-darkmode"));
        iconStyleEl.forEach((element) =>
          element.classList.remove("icon-style-darkmode")
        );
        addBtnEl.forEach((element) =>
          element.classList.remove("add-btn-darkmode")
        );
      }
    }
  } else if (document.body.id === "watchlist-page") {
    if (countIsDarkMode === 0) {
      if (isDarkMode) {
        document.body.classList.add("dark-mode");
        deleteBtn.classList.add("remove-btn-color");
        darkMode.checked = true;
      } else {
        document.body.classList.remove("dark-mode");
        deleteBtn.classList.remove("remove-btn-color");
      }
    } else {
      document.body.classList.toggle("dark-mode");
      deleteBtn.classList.toggle("remove-btn-color");
      if (isDarkMode && genreTabEl != null) {
        genreTabEl.forEach((el) => el.classList.add("genre-tab-darkmode"));
        plotTabEl.forEach((el) => el.classList.add("plot-text-darkmode"));
        iconStyleEl.forEach((element) =>
          element.classList.add("icon-style-darkmode")
        );
        addBtnEl.forEach((element) =>
          element.classList.add("add-btn-darkmode")
        );
      } else if (!isDarkMode && genreTabEl != null) {
        genreTabEl.forEach((el) => el.classList.remove("genre-tab-darkmode"));
        plotTabEl.forEach((el) => el.classList.remove("plot-text-darkmode"));
        iconStyleEl.forEach((element) =>
          element.classList.remove("icon-style-darkmode")
        );
        addBtnEl.forEach((element) =>
          element.classList.remove("add-btn-darkmode")
        );
      }
    }
  }

  localStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
  JSON.parse(localStorage.getItem("isDarkMode"));

  countIsDarkMode = 1;
}
