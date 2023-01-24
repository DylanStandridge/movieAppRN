import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';

import {
  fetchMovies
} from './MovieListApi';
import {
  addFavorite,
  addMovie,
  addMovies,
  removeFavorite,
  removeMovie,
  selectFavorites,
  selectMovies
} from './MovieSlice'
import MovieCard from '../../components/MovieCard/MovieCard';
import { FavoriteMovie, Movie, MovieListing, MovieResponse } from './MovieListTypes';
import { useAppDispatch, useAppSelector } from '../../hooks';

//   Example-JIRA: movies-2 
//   Description: map the movies into the dynamic grid using Material UI's grid container and React-Pagination
//   MUI: https://mui.com/material-ui

export function MovieList() {

  // used in react app to determine if its the favorite page with reuse of component
  const [isFavoriteList, setIsFavoriteList] = useState( false)


  // an array to map the full return of the api into react state so we can combine with favorites
  // pageCount render the total pages for pagination
  const [pageCount, setPageCount] = useState(0);
  // current items to display from pagination results (or search results)
  const [currentItems, setCurrentItems] = useState(([] as FavoriteMovie[]));
  // boolean to tell ui not to paginate when returning full results
  const [searching, setSearching] = useState(false)
  // offset is use to determine which indices to render into current items
  const [itemOffset, setItemOffset] = useState(0);
  const favorites: FavoriteMovie[] = useAppSelector(selectFavorites)
  const regMovies: FavoriteMovie[] = useAppSelector(selectMovies)
  let [movies, setMovies] = useState([] as MovieListing[]);
  const [hasData, setHasData] = useState(false);
  let apiCalled = false
  const dispatch = useAppDispatch()
  // used to set items per page loaded




  useEffect(() => {
    // Fetch items from cached state.
    if (regMovies.length === 0 && favorites.length === 0 && !apiCalled) {
      apiCalled = true
      fetchMovieList()
    }
    
    //if we arent searching the data then render as pagination
    if ((!searching && [...regMovies, ...favorites].length > 0) || isFavoriteList) {
      setHasData(true)
      if (isFavoriteList) {
        setCurrentItems([...favorites]);
      }
      else {
        setCurrentItems([...favorites, ...regMovies]);
      }
    }
  }, [ searching, favorites, regMovies, hasData]);

  const fetchMovieList = () => {
    // initial render to grab the movie list and load it from api into redux state
    let regItems: FavoriteMovie[] = [];
    fetchMovies().then((data: MovieResponse) => {
      if (data.error == undefined || data.error?.message == ''){
      (data.items as Movie[]).forEach((element: Movie) => {
        regItems.push({ ...element, isFavorite: false, movieDetails: null })
      })
      dispatch(addMovies(regItems))
    }
    })

  }

  const favoriteAMovie = (movId: string) => {
    let indOfFave: number | null = null
    const faveMov: FavoriteMovie | undefined = [...regMovies, ...favorites].find((curMov) => {
      if (curMov.id === movId) {
        return curMov
      }
    })
    if (faveMov) {
      // if its not currently a favorite add it and remove from reg movies
      if (!faveMov.isFavorite) {
        dispatch(addFavorite(faveMov))
        dispatch(removeMovie(faveMov))
      }
      else {
        // get rid of it from the fave movies list and add to reg movies
        dispatch(removeFavorite(faveMov as FavoriteMovie))
        dispatch(addMovie(faveMov))
      }
    }
  }

  const searchMovies = (movieString: string) => {
    let searchedMovies = [...favorites, ...regMovies].filter((mov) => mov.fullTitle.toLowerCase().includes(movieString.toLowerCase()))
    if (movieString !== '') {
      setSearching(true)
      setCurrentItems(searchedMovies)
    }
    else {
      setSearching(false)
    }
  }

  // render each individual item in the movie list and determine if its a favorite
  const Item = (props: MovieListing) => {
    return (
      <View >
        <MovieCard image={props.image} id={props.id} title={props.title} year={props.year} imDbRating={props.imDbRating} imDbRatingCount={props.imDbRatingCount} favoriteMovie={props.favoriteMovie} isFavorite={props.isFavorite} />
      </View>
    )
  }

  const GridRender = () => {
    // this is the grid container which allows us to dynamically render 
    console.log(currentItems)
    return (
      // <ScrollView >
      //   {currentItems.map((item: FavoriteMovie) => <Item key={item.rank} {...item} favoriteMovie={favoriteAMovie} />)}
        <FlatList
        data={currentItems.sort((a, b) =>  ((a.year - b.year) && (a.fullTitle - b.fullTitle)))}
        renderItem={({item}) => <Text >{item.fullTitle}</Text>}
      />

      // </ScrollView>
    )
  }


  return (
    <GridRender/>
  );

}

