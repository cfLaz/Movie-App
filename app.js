const searchListBtn = document.getElementById("searchListButton");
const myListBtn = document.getElementById("myListButton");

let searchList = document.getElementById("searchList");
let myList = document.getElementById("myList");
let movieInfo = document.getElementById("movieInfo"); //more details for chosen movie

const searchMovieForm = document.getElementById("searchMovie");

let showMovieInfoFromLocalStorage = (movie) => {
  //for displaying in myList, don't have to pull from omdbapi again
  console.log("showMovieInfoFromLocalStorage fired");
  let toggleMovieButton;

  movieInfo.style.display = "flex";
  movieInfo.innerHTML = `
    <p class='movieInfoElement'>${movie.Title}</p>
    <p class='movieInfoElement'> ${movie.Year}</p>
    <img class='movieInfoElement' src=${movie.Poster} alt=${movie.Title}>
    <p class='movieInfoElement'><span>Release:</span> ${movie.Released}</p>
    <p class='movieInfoElement'><span>Genre:</span> ${movie.Genre}</p>
    <p class='movieInfoElement'><span>Director:</span> ${movie.Director}</p>
    <p class='movieInfoElement'><span>Actors:</span> ${movie.Actors}</p>
    <p class='movieInfoElement'><span>Plot: </span><br> ${movie.Plot}</p>
    <button class='movieInfoElement' id='addOrRemoveMovie'>Remove from my list</button>   
  `;
  toggleMovieButton = document.getElementById("addOrRemoveMovie");
  toggleMovieButton.addEventListener("click", (e) => toggleMovie(e, movie));

  if (localStorage.getItem(movie.Title + movie.Year)) {
    toggleMovieButton.textContent = "Remove from my list";
    toggleMovieButton.setAttribute("type", "button");
  }
};

let addMovieToMyList = (movie) => {
  //called once when we click on Add to my list, in toggleMovie(), or multiple times in showMyMovies() when we click on My favourite movies
  let name = movie.Title + movie.Year;

  //if movie doesn't have a star and exists in searchList, we add the star to it
  if (
    !document.getElementById(name + "star") &&
    document.getElementById(name + "searchList")
  ) {
    let star = document.createElement("span"); //for searchList
    star.setAttribute("id", name + "star");
    star.innerHTML = "&#11088";
    document.getElementById(name + "searchList").childNodes[3].append(star);
  }

  let content = document.createElement("div");
  content.setAttribute("class", "movieInMyList");
  content.setAttribute("id", name + "myList"); //for easier deleting from movieInfo section

  let removeMovieBtn = document.createElement("button");
  removeMovieBtn.setAttribute("class", "removeMovie");
  removeMovieBtn.textContent = "Remove";

  content.innerHTML = `
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `;
  content.childNodes[5].append(removeMovieBtn);

  removeMovieBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    content.remove();
    toggleMovie(e, movie);
  });
  content.addEventListener("click", () => showMovieInfoFromLocalStorage(movie));
  myList.append(content);
};

let showMyMovies = () => {
  let movies = [];
  let keys = Object.keys(localStorage);

  let elements = document.querySelectorAll("div.movieInMyList");

  if (elements.length > 0)
    //so we don't show same movie more than once
    for (el of elements) {
      el.remove();
    }
  for (key of keys) {
    movies.push(JSON.parse(localStorage.getItem(key)));
  }
  for (let movie of movies) {
    addMovieToMyList(movie);
  }
};

let toggleList = (e) => {
  //console.log(e.target.id); // i need .target.id
  if (e.target.id === "myListButton") {
    searchList.style.visibility = "hidden"; //so that search result stays when we return (don't have to search again for the same movie title)
    myList.style.display = "flex";

    myListBtn.disabled = true;
    searchListBtn.disabled = false;
    showMyMovies();
    movieInfo.style.display = "none";
  } else {
    myList.style.display = "none";
    searchList.style.visibility = "visible";

    searchListBtn.disabled = true;
    myListBtn.disabled = false;
    movieInfo.style.display = "none";
  }
};

let toggleMovie = (e, movie) => {
  //3 cases because we have 3 different buttons for adding and/or removing (actually 2 buttons but one changes its textContent so it's treated different )
  console.log("toggleMovie fired with button: " + e.target.textContent);

  if (e.target.textContent === "Add to my list") {

    let data = {
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Released: movie.Released,
      Genre: movie.Genre,
      Director: movie.Director,
      Actors: movie.Actors,
      Plot: movie.Plot,
    };
    localStorage.setItem(movie.Title + movie.Year, JSON.stringify(data));

    e.target.setAttribute("type", "button");
    e.target.textContent = "Remove from my list";
    //console.log(data);
    addMovieToMyList(data);
  } 
  else if (e.target.textContent === "Remove") {
    let title = e.target.parentNode.parentNode.id.replace("myList", ""); //movie name for local storage
    //console.log(e.target.parentNode.parentNode);
    localStorage.removeItem(title);

    if (movieInfo.children[0]) {
      //if movieInfo is opened while myList is opened
      let toggleMovieButton = document.getElementById("addOrRemoveMovie");
      toggleMovieButton.textContent = "Add to my list";
      toggleMovieButton.removeAttribute("type");
    }
    if (document.getElementById(title + "star")) {
      console.log("removing star");
      document.getElementById(title + "star").remove();
    }
  } else {
    //when removing movie from myList from movieInfo section
    let title = movie.Title + movie.Year;
    console.log(title);

    localStorage.removeItem(title);
    if(document.getElementById(title + "myList") )
      document.getElementById(title + "myList").remove();
    
    e.target.textContent = "Add to my list";
    e.target.removeAttribute("type");

    if (document.getElementById(title + "star")) {
      document.getElementById(title + "star").remove(); // only when movie is in the searchList
    }
  }
};

async function showMovieInfo(id) {
  //when selecting from searchList

  let response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=6920da43`);
  let movie = await response.json(); //need Title,Year,Poster,Released,Genre,Director,Actors,Plot

  if(movie.Poster==="N/A"){
    movie.Poster="noImage.jpg";
  }
  movieInfo.style.display = "flex";
  movieInfo.innerHTML = `
    <p class='movieInfoElement'>${movie.Title}</p>
    <p class='movieInfoElement'> ${movie.Year}</p>
    <img class='movieInfoElement' src=${movie.Poster} alt=${movie.Title}>
    <p class='movieInfoElement'><span>Release: </span> ${movie.Released}</p>
    <p class='movieInfoElement'><span>Genre: </span>${movie.Genre}</p>
    <p class='movieInfoElement'><span>Director: </span>${movie.Director}</p>
    <p class='movieInfoElement'><span>Actors: </span>${movie.Actors}</p>
    <p class='movieInfoElement'><span>Plot: </span><br> ${movie.Plot}</p>
    <button class='movieInfoElement' id='addOrRemoveMovie'>Add to my list</button>   
  `;
  toggleMovieButton = document.getElementById("addOrRemoveMovie");
  toggleMovieButton.addEventListener("click", (e) => toggleMovie(e, movie));
  

  if (localStorage.getItem(movie.Title + movie.Year)) {
    toggleMovieButton.textContent = "Remove from my list";
    toggleMovieButton.setAttribute("type", "button");
  }
}

let showMoviesInSearchList = (movies) => {
  let elements = document.querySelectorAll("div.movieInSearchList");

  if (elements.length > 0)
    for (el of elements) {
      el.remove();
    }

  for (movie of movies) {
    let content = document.createElement("div");
    let id = movie.imdbID;

    content.setAttribute("class", "movieInSearchList");
    content.setAttribute("id", movie.Title + movie.Year + "searchList");

    if(movie.Poster==="N/A"){
      movie.Poster="noImage.jpg";
    }
    content.innerHTML = `
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `;
    if (localStorage.getItem(movie.Title + movie.Year)) {
      //add star if movie is saved in our list
      let star = document.createElement("span");
      star.setAttribute("id", movie.Title + movie.Year + "star");
      star.innerHTML = "&#11088";
      content.childNodes[3].append(star);
    }
    content.addEventListener("click", () => showMovieInfo(id));
    searchList.append(content);
  }
};

let fetchRequest = async function (movie) {
  const response = await fetch(
    `http://www.omdbapi.com/?s=${movie}&apikey=6920da43`
  );
  //console.table(response);
  let data = await response.json();
  console.log(data);
  if (data.Response === "False") {
    alert(data.Error);
    return data;
  }
  return data.Search;
};

async function searchAndDisplay(e) {
  e.preventDefault();

  let movieName = document.getElementById("movieName").value;
  console.log("searching: " + movieName);
  let moviesData = await fetchRequest(movieName);

  if (moviesData.Response === "False") return;
  showMoviesInSearchList(moviesData);
}

searchListBtn.addEventListener("click", (e) => toggleList(e));
myListBtn.addEventListener("click", (e) => toggleList(e));

searchMovieForm.addEventListener("submit", (e) => searchAndDisplay(e));
