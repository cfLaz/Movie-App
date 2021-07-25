const searchMovie = document.getElementById('searchMovie');

let fetchRequest = async function(movie) {

  const response = await fetch(`http://www.omdbapi.com/?t=${movie}&apikey=6920da43`);
  console.log(response);

  let data = await response.json();
  console.log(data);
  return data;
}

async function SearchAndDisplay(e){
  e.preventDefault(); //prevents the form from autosubmitting
  //console.log(e.target);
  let movie = document.getElementById('movie').value;
  console.log(movie);

  let movieData = await fetchRequest(movie);

  
}

searchMovie.addEventListener('submit', (e) => SearchAndDisplay(e));