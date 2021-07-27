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

  if(localStorage.getItem(movie.Title+movie.Year)){
    console.log('movie is bookmarked')
    toggleMovieButton.textContent = 'Remove from my list';
  }
}


let addMovieToMyList =(movie) =>{
  let name = movie.Title+movie.Year;

  let content = document.createElement('div');
    content.setAttribute('class', 'movieInMyList');
    content.setAttribute('id', name+'myList'); //for easier deleting from movieInfo section
  let removeMovieBtn = document.createElement('button');
    removeMovieBtn.setAttribute('class', 'removeMovie');
    removeMovieBtn.textContent='Remove';

  
  //if movie doesn't have a star and exists in searchList, we add the star to it
  if(!document.getElementById(name+'star') && document.getElementById(name+'searchList')){
    let star = document.createElement('span'); //for searchList
      star.setAttribute('id', name+'star');
      star.innerHTML='&#11088';
    document.getElementById(name+'searchList').childNodes[3].append(star);  
  }   
  content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `;
  content.childNodes[5].append(removeMovieBtn);
    
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
    localStorage.setItem(data.Title+data.Year, JSON.stringify(data));
    //let retrievedData = localStorage.getItem(data.Title);
    //console.log(JSON.parse(retrievedData));
    e.target.textContent='Remove from my list';
    addMovieToMyList(data);
  }
  else if (e.target.textContent==='Remove'){

      let title = e.target.parentNode.id.replace('myList','') //movie name in local storage
      console.log(e.target.parentNode);
      localStorage.removeItem(title);

      if(movieInfo.children[0]){        
        let toggleMovieButton = document.getElementById('addOrRemoveMovie');
          toggleMovieButton.textContent = 'Add to my list';
      }
      if(document.getElementById(title+'star')) {
        console.log('removing star');
        document.getElementById(title+'star').remove();
      }
   //movieInfo.style.display='none';    
  }
  else {
    let title = movieInfo.children[0].innerText + movieInfo.children[1].innerText;
    console.log(title);
    localStorage.removeItem(title);
    e.target.textContent='Add to my list';
    document.getElementById(title+'myList').remove();
    if(document.getElementById(title+'star')){
      document.getElementById(title+'star').remove(); // only when movie is in the searchList
    }
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

  if(localStorage.getItem(movie.Title+movie.Year)){
    toggleMovieButton.textContent = 'Remove from my list';
  }
}

let showMoviesInSearchList = (movies) =>{
  
  let elements = document.querySelectorAll('div.movieInSearchList');
  
  if(elements.length>0)  
    for(el of elements){
      el.remove();
    }
  for(movie of movies){
    let content = document.createElement('div')
    let id = movie.imdbID; 

    content.setAttribute('class', 'movieInSearchList');
    content.setAttribute('id', movie.Title+movie.Year+'searchList');

    content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `
    if(localStorage.getItem(movie.Title+movie.Year)) {
      let star = document.createElement('span');
      star.setAttribute('id', movie.Title+movie.Year+'star');
      star.innerHTML='&#11088';
      content.childNodes[3].append(star)
    }
    content.addEventListener('click', () => showMovieInfo(id));
    searchList.append(content);
  }
};

let fetchRequest = async function(movie) {

  const response = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=6920da43`);
  //console.table(response);
  let data = await response.json();
  console.log(data);
  if(data.Response==='False'){
    alert(data.Error);
    return data;
  }
  return data.Search;
}

async function SearchAndDisplay(e){
  e.preventDefault();
  //console.log(e.target);
  let movieName = document.getElementById('movieName').value;
  console.log('searching: '+movieName);

  let moviesData = await fetchRequest(movieName);
  if(moviesData.Response==='False') return;
  showMoviesInSearchList(moviesData);
}

searchListBtn.addEventListener('click', (e) => toggleList(e));
myListBtn.addEventListener('click', (e) => toggleList(e));

searchMovieForm.addEventListener('submit', (e) => SearchAndDisplay(e));
