const searchListBtn = document.getElementById('searchListButton');
const myListBtn = document.getElementById('myListButton');

let searchList = document.getElementById('searchList'); 
let myList = document.getElementById('myList');
let movieInfo = document.getElementById('movieInfo');
const searchMovieForm = document.getElementById('searchMovie');

let toggleList = (e) =>{
  //console.log(e.target.id); // i need .target.id
  if(e.target.id === 'myListButton'){
    searchList.style.display = 'none';
    myList.style.display = 'flex';

    myListBtn.disabled=true;
    searchListBtn.disabled=false;
  }
  else{
    myList.style.display = 'none';
    searchList.style.display='flex';

    searchListBtn.disabled=true;
    myListBtn.disabled=false;
  }

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
  `
}

let fetchRequest = async function(movie) {

  const response = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=6920da43`);
  //console.table(response);

  let data = await response.json();
  console.log(data);
  return data.Search;
}

let showMovieList = (movies) =>{
  
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
  showMovieList(moviesData);
}

searchListBtn.addEventListener('click', (e) => toggleList(e));
myListBtn.addEventListener('click', (e) => toggleList(e));

searchMovieForm.addEventListener('submit', (e) => SearchAndDisplay(e));
