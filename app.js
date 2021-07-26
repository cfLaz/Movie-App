const searchListBtn = document.getElementById('searchListButton');
const myListBtn = document.getElementById('myListButton');

let searchList = document.getElementById('searchList'); 
let myList = document.getElementById('myList');
let movieInfo = document.getElementById('movieInfo');

const searchMovieForm = document.getElementById('searchMovie');
//let toggleMovieButton;
//let removeMovieButton;

showMovieInfoFromLocalStorage = (movie) => {
  console.log('showMovieInfoFromLocalStorage fired');
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
    <button class='movieInfoElement' id='addOrRemoveMovie'>Remove from my list</button>   
  `;
  toggleMovieButton = document.getElementById('addOrRemoveMovie');
  toggleMovieButton.addEventListener('click', (e)=> toggleMovie(e));

  if(localStorage.getItem(movieInfo.children[0].innerText)){
    console.log('movie is bookmarked')
    toggleMovieButton.textContent = 'Remove from my list';
  }
}


let addMovieToMyList =(movie) =>{
  
  let content = document.createElement('div');
    content.setAttribute('class', 'movieInMyList');
    content.setAttribute('id', movie.Title); //for easier deleting from movieInfo section
    let removeMovieBtn = document.createElement('button');
    removeMovieBtn.setAttribute('class', 'removeMovie');
    removeMovieBtn.textContent='Remove';

    content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `;
    content.append(removeMovieBtn);
    
    removeMovieBtn.addEventListener('click', (e)=> {
      e.stopPropagation();
      content.remove()
      toggleMovie(e);
    });
    content.addEventListener('click', () => showMovieInfoFromLocalStorage(movie));
    myList.append(content);
}

let showMyMovies=()=> {
  let movies = [];
  let keys = Object.keys(localStorage);
  //let removeMovieButton;
  let elements = document.querySelectorAll('div.movieInMyList');
  
  if(elements.length>0)  
    for(el of elements){
      el.remove();
    }
  for(key of keys){
    movies.push(JSON.parse(localStorage.getItem(key)) );
  }

  for(let movie of movies){
    addMovieToMyList(movie);
  } 
}

let toggleList = (e) =>{
  //console.log(e.target.id); // i need .target.id
  if(e.target.id === 'myListButton'){
    searchList.style.visibility = 'hidden'; //so that search result stays when we return (don't have to search again for the same movie title)
    myList.style.display = 'flex';

    myListBtn.disabled=true;
    searchListBtn.disabled=false;
    showMyMovies();
    movieInfo.style.display='none';       
  }
  else{
    myList.style.display = 'none';
    searchList.style.visibility='visible';

    searchListBtn.disabled=true;
    myListBtn.disabled=false;
    movieInfo.style.display='none';   
  }

}

let toggleMovie =(e) => {
  console.log('toggleMovie fired with button: '+e.target.textContent);
  if(e.target.textContent==='Add to my list'){
    //console.log(movieInfo.children);
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

    addMovieToMyList(data);
  }
  else if (e.target.textContent==='Remove'){
    if(movieInfo.children[0]){
      let title = movieInfo.children[0].innerText;
      //console.log(title);
      localStorage.removeItem(title);
  
      let toggleMovieButton = document.getElementById('addOrRemoveMovie');
      toggleMovieButton.textContent = 'Add to my list';
    }

   //movieInfo.style.display='none';    
  }
  else {
    let title = movieInfo.children[0].innerText;
    console.log(title);
    localStorage.removeItem(title);
    e.target.textContent='Add to my list';
    document.getElementById(title).remove();
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
  toggleMovieButton.addEventListener('click', (e)=> toggleMovie(e));

  if(localStorage.getItem(movieInfo.children[0].innerText)){
    toggleMovieButton.textContent = 'Remove from my list';
  }
}


let showMoviesList = (movies) =>{
  
  let elements = document.querySelectorAll('div.movieInSearchList');
  
  if(elements.length>0)  
    for(el of elements){
      el.remove();
    }

  for(movie of movies){
    let content = document.createElement('div')
    let id = movie.imdbID; 

    content.setAttribute('class', 'movieInSearchList');
    content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `
    content.addEventListener('click', () => showMovieInfo(id));
    searchList.append(content);
  }
};


let fetchRequest = async function(movie) {

  const response = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=6920da43`);
  //console.table(response);

  let data = await response.json();
  console.log(data);
  return data.Search;
}

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
