import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import {
  selectFavorites,
  selectMovies,
  removeMovie,
  addMovie,
  removeFavorite,
  addFavorite
} from '../movieList/MovieSlice'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchMovie } from './MovieApi';
import { FavoriteMovie } from '../movieList/MovieListTypes';
import { MovieDetailResponse, MovieDetails } from './MovieTypes';
import { View } from 'react-native';

//   Example-JIRA: movies-2 
//   Description: map the movies into the dynamic grid using Material UI's grid container and react-infinite-scroll-component
//   Grid: https://mui.com/material-ui/react-grid2/ 
//   scroller: https://www.npmjs.com/package/react-infinite-scroll-component

export function Movie() {


  const favorites: FavoriteMovie[] = useAppSelector(selectFavorites)
  const regMovies: FavoriteMovie[] = useAppSelector(selectMovies)
  const [hasData, setHasData] = useState(false)
  const [movieDetails, setMovieDetails] = useState({} as MovieDetails)
  const [width, setWidth] = useState(0)
  const [errorState, setErrorState] = useState(false)
  let apiCalled = false
  const dispatch = useAppDispatch()



  useEffect(() => {
    // Fetch items from cached state.
    if (!apiCalled) {
      apiCalled = true
      fetchMovieList()
    }
    setWidth(window.innerWidth)
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    }
  }, [errorState]);

  const fetchMovieList = () => {
    // initial render to grab the movie list and load it from api into redux state
    const currentWindow = window.location.pathname.split('/')
    fetchMovie(currentWindow[currentWindow.length - 1]).then((data: MovieDetailResponse) => {
      if (data.error == null && data.items.id != undefined) handleMovieDetails(data.items)
      else { setErrorState(true)}
    })
  }

  const resizeHandler = () => {
    setWidth(window.innerWidth)
  }

  const handleMovieDetails = (data: MovieDetails) => {
    // its in regular movies change its details and add it to the array while removing the original copy
    let regMovie = regMovies.find(mov => mov.id === data.id);
    let faveMovie = favorites.find(mov => mov.id === data.id);
    if (regMovie != undefined) {
      dispatch(removeMovie(regMovie))
      dispatch(addMovie({ ...regMovie, movieDetails: data }))
    }
    // its in favorite movies change its details and add it to the array while removing the original copy
    else if (faveMovie != undefined) {
      dispatch(removeFavorite(faveMovie))
      dispatch(addFavorite({ ...faveMovie, movieDetails: data }))
    }
    setMovieDetails(data)
    setHasData(true)
  }
  if (errorState) {
    return (
      <View>
        <text>Houston, we've got a problem</text>
    </View>
    )
  }
  return (
    <View>
      {hasData &&
      <View >
        <View >
          <img src={movieDetails.image} style={{ width: width > 800 ? '25rem' : '100%'}}/>
        </View>
        <View >
          <text  >{movieDetails.fullTitle}</text>
          <text >Plot</text>
          <text >{movieDetails.plot} </text>
          <text ><b>Awards:</b> {movieDetails.awards} </text>
          <text ><b>Stars:</b> {movieDetails.stars} </text>
          <text ><b>Writers:</b> {movieDetails.writers} </text>
          <text ><b>Directors:</b> {movieDetails.directors} </text>
          <text ><b>Budget:</b> {movieDetails.boxOffice?.budget} </text>
          <text ><b>Runtime:</b> {movieDetails.runtimeStr} Rated: {movieDetails.contentRating}</text>
        </View>
      </View>
    }
    </View>
  );

}

