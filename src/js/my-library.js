import { refs } from './refs';
import { renderMovieCard } from './render-elements';
import { FilmApiService } from './api-service';
import { onLogoHomeClick } from './load-homepage';

refs.linkMyLibrary.addEventListener('click', myLibrary);
refs.watchedLibrary.addEventListener('click', onWatchedLibrary);
refs.queueLibrary.addEventListener('click', onQueueLibrary);

const filmApiService = new FilmApiService();

export function myLibrary() {
  refs.logoHome.addEventListener('click', onLogoHomeClick);
  refs.gallery.style.display = 'block';
  const libraryIsEmpty = `<li class ="empty-my-library"><p class="title-empty-my-library">Your library is empty</p><img class="icon-empty-my-library" src="https://img.freepik.com/free-photo/rows-red-seats-theater_53876-64711.jpg" alt ="not films here"></img></li>`;
  refs.gallery.innerHTML = libraryIsEmpty;
  refs.pagination.classList.add('visually-hidden');
  const queueFilms = localStorage.getItem('queue');
  const watchedFilms = localStorage.getItem('watched');

  if (!(queueFilms === null || queueFilms === '[]')) {
    onQueueLibrary();
  }

  if (!(watchedFilms === null || watchedFilms === '[]')) {
    onWatchedLibrary();
  }
}

export function onQueueLibrary() {
  refs.gallery.innerHTML = '';
  const queueFilms = localStorage.getItem('queue');
  if (queueFilms === null || queueFilms === '[]') {
    refs.gallery.style.display = 'block';
    const libraryIsEmpty = `<li class ="empty-my-library"><p class = "title-empty-my-library">Your movie queue is empty</p><img class="icon-empty-my-library" src="https://img.freepik.com/free-photo/rows-red-seats-theater_53876-64711.jpg" alt ="not films here"></img></li>`;
    refs.gallery.innerHTML = libraryIsEmpty;
  } else {
    try {
      refs.gallery.style.display = 'grid';
      const arrayQueueFilms = JSON.parse(queueFilms);
      const response = arrayQueueFilms.map(id => getFilmDataFromApi(id));
    } catch (error) {
      refs.gallery.style.display = 'block';
      const parseError = `<li style="text-align: center;">Failed to load library queue movies</li>`;
      refs.gallery.innerHTML = parseError;
    }
  }
}

export function onWatchedLibrary() {
  refs.gallery.innerHTML = '';
  const watchedFilms = localStorage.getItem('watched');
  if (watchedFilms === null || watchedFilms === '[]') {
    refs.gallery.style.display = 'block';
    const libraryIsEmpty = `<li class ="empty-my-library"><p class = "title-empty-my-library">Your library of watched movies is empty</p><img class="icon-empty-my-library" src="https://img.freepik.com/free-photo/rows-red-seats-theater_53876-64711.jpg" alt ="not films here"></img></li>`;

    refs.gallery.innerHTML = libraryIsEmpty;
  } else {
    try {
      refs.gallery.style.display = 'grid';
      const arrayWatchedFilms = JSON.parse(watchedFilms);
      const response = arrayWatchedFilms.map(id => getFilmDataFromApi(id));
    } catch (error) {
      refs.gallery.style.display = 'block';
      const parseError = `<li style="text-align: center;">Failed to load library watched movies</li>`;
      refs.gallery.innerHTML = parseError;
    }
  }
}

async function getFilmDataFromApi(id) {
  const response = await filmApiService.getMovieByID(id);
  const markup = renderMovieCard(response.data);
  refs.gallery.insertAdjacentHTML('afterbegin', markup);
  const genresInfo = document.querySelector('.movie-card__info');
  const genresCount = response.data.genres.length;
  let genresName = [];
  if (genresCount < 3) {
    for (let i = 0; i < genresCount; i += 1) {
      genresName.push(response.data.genres[i].name);
    }
  } else {
    for (let i = 0; i < 2; i += 1) {
      genresName.push(response.data.genres[i].name);
    }
    genresName.push('Other');
  }
  const genresList = genresName.join(', ');
  genresInfo.textContent = `${genresList} | ${response.data.release_date.slice(0, 4)}`;
}
