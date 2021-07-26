const searchListBtn = document.getElementById('searchListButton');
const myListBtn = document.getElementById('myListButton');

let searchList = document.getElementById('searchList'); 
let myList = document.getElementById('myList');
let movieInfo = document.getElementById('movieInfo');

const searchMovieForm = document.getElementById('searchMovie');
let toggleMovieButton;
let removeMovieButton;

showMovieInfoFromLocalStorage = (movie) => {
  
  let toggleMovieButton;

  movieInfo.style.display='flex';
  movieInfo.innerHTML=`
    <p class='movieInfoElement'>${movie.Title}</p>
    <p class='movieInfoElement'> ${movie.Year}</p>
    <img class='movieInfoElement' src=${movie.Poster} alt=${movie.Title}>
    <p class='movieInfoElement'>Release: ${movie.Released}</p>
    <p class='movieInfoElement'>Genre: ${movie.Genre}</p>
    <p class='movieInfoElement'>Director: ${movie.Director}</p>
    <p class='movieInfoElement'>Actors: ${movie.Actors}</p>
    <p class='movieInfoElement'>Plot: <br> ${movie.Plot}</p>
    <button class='movieInfoElement' id='addOrRemoveMovie'>Add to my list</button>   
  `;
  toggleMovieButton = document.getElementById('addOrRemoveMovie');
  toggleMovieButton.addEventListener('click', (e)=> toggleMovie(e));

  if(localStorage.getItem(movieInfo.children[0].innerText)){
    toggleMovieButton.textContent = 'Remove from my list';
  }
}

/* 
let removeMovie= (content) => {
  content.remove();
}
 */
let showMyMovies=()=> {
  let movies = [];
  let keys = Object.keys(localStorage);

  let elements = document.querySelectorAll('div.movieInList');
  
  if(elements.length>0)  
    for(el of elements){
      el.remove();
    }

  for(key of keys){
    movies.push(JSON.parse(localStorage.getItem(key)) );
  }
  //let removeMovieButton;

  for(let movie of movies){
    let content = document.createElement('div');
    content.setAttribute('class', 'movieInList');
    content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
        <button id='removeMovie'>Remove</button>
    `

    /* removeMovieButton = document.getElementById('removeMovie');
    removeMovieButton.addEventListener('click', ()=> content.remove()); */

    content.addEventListener('click', () => showMovieInfoFromLocalStorage(movie));
    myList.append(content);
  } 
}

let toggleList = (e) =>{
  //console.log(e.target.id); // i need .target.id
  if(e.target.id === 'myListButton'){
    searchList.style.display = 'none';
    myList.style.display = 'flex';

    myListBtn.disabled=true;
    searchListBtn.disabled=false;
    showMyMovies();
  }
  else{
    myList.style.display = 'none';
    searchList.style.display='flex';

    searchListBtn.disabled=true;
    myListBtn.disabled=false;
  }

}

let toggleMovie =(e) => {
  
  if(e.target.textContent==='Add to my list'){
    console.log(movieInfo.children);
    let info = movieInfo.children;
    
    let data = {
      Title: info[0].innerText,
      Year: info[1].innerText,
      Poster: info[2].src,
      Released: info[3].innerText,
      Genre: info[4].innerText,
      Director: info[5].innerText,
      Actors: info[6].innerText,
      Plot: info[7].innerText,
    }
    localStorage.setItem(data.Title, JSON.stringify(data));
    //let retrievedData = localStorage.getItem(data.Title);
    //console.log(JSON.parse(retrievedData));
    e.target.textContent='Remove from my list';
  }
  else {
    let title = movieInfo.children[0].innerText;
    console.log(title);
    localStorage.removeItem(title);
    e.target.textContent='Add to my list';
  };
}

async function showMovieInfo(id){
  
  let response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=6920da43`);
  let movie = await response.json(); //need Title,Year,Poster,Released,Genre,Director,Actors,Plot

  movieInfo.style.display='flex';
  movieInfo.innerHTML=`
    <p class='movieInfoElement'>${movie.Title}</p>
    <p class='movieInfoElement'> ${movie.Year}</p>
    <img class='movieInfoElement' src=${movie.Poster} alt=${movie.Title}>
    <p class='movieInfoElement'>Release: ${movie.Released}</p>
    <p class='movieInfoElement'>Genre: ${movie.Genre}</p>
    <p class='movieInfoElement'>Director: ${movie.Director}</p>
    <p class='movieInfoElement'>Actors: ${movie.Actors}</p>
    <p class='movieInfoElement'>Plot: <br> ${movie.Plot}</p>
    <button class='movieInfoElement' id='addOrRemoveMovie'>Add to my list</button>   
  `;
  toggleMovieButton = document.getElementById('addOrRemoveMovie');
  toggleMovieButton.addEventListener('click', (e)=> removeMovie(e));

  if(localStorage.getItem(movieInfo.children[0].innerText)){
    toggleMovieButton.textContent = 'Remove from my list';
  }
}

let fetchRequest = async function(movie) {

  const response = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=6920da43`);
  //console.table(response);

  let data = await response.json();
  console.log(data);
  return data.Search;
}

let showMoviesList = (movies) =>{
  
  let elements = document.querySelectorAll('div.movieInList');
  
  if(elements.length>0)  
    for(el of elements){
      el.remove();
    }

  for(movie of movies){
    let content = document.createElement('div')
    let id = movie.imdbID; 

    content.setAttribute('class', 'movieInList');
    content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `
    content.addEventListener('click', () => showMovieInfo(id));
    searchList.append(content);
  }
};



async function SearchAndDisplay(e){
  e.preventDefault(); //prevents the form from autosubmitting
  //console.log(e.target);
  let movieName = document.getElementById('movieName').value;
  console.log(movieName);

  let moviesData = await fetchRequest(movieName);
  showMoviesList(moviesData);
}

searchListBtn.addEventListener('click', (e) => toggleList(e));
myListBtn.addEventListener('click', (e) => toggleList(e));

searchMovieForm.addEventListener('submit', (e) => SearchAndDisplay(e));
