const searchMovie = document.getElementById('searchMovie');

let fetchRequest = async function(movie) {

  const response = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=6920da43`);
  //console.table(response);

  let data = await response.json();
  console.log(data);
  return data.Search;
}

let showMovieList = (movies) =>{
  
/*   if(document.querySelectorAll('div.movieInList')) {
    let el = document.querySelectorAll('div.movieInList');
    el.parentElement.removeChild(el);
  }
 */let elements = document.querySelectorAll('div.movieInList');
  if(elements.length>0)  
    for(el of elements){
      el.remove();
    }

  const list = document.getElementById('searchList'); 
  for(movie of movies){
    let content = document.createElement('div')
    content.setAttribute('class', 'movieInList');
    content.innerHTML=`
        <img src=${movie.Poster} alt=${movie.Title}>
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
    `
    list.append(content);
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

searchMovie.addEventListener('submit', (e) => SearchAndDisplay(e));