const searchListBtn = document.getElementById('searchListButton');
const myListBtn = document.getElementById('myListButton');
const searchMovieForm = document.getElementById('searchMovie');

let searchList = document.getElementById('searchList'); 
let myList = document.getElementById('myList');

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
    content.setAttribute('class', 'movieInList');
    content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `
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
