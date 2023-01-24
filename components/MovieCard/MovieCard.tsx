

// JIRA: movie-3
// description Create a reusable movie card

import React from "react";
import { View, Text } from "react-native";
import { MovieCardData } from "../../features/movieList/MovieListTypes";

export default function MovieCard(props: MovieCardData) {
  // give the review count as 1.2k or 10.5M instead of a long number
  const simplifiedReviewCount = props.imDbRatingCount.split("")[0] + "." + props.imDbRatingCount.split("")[1] + (props.imDbRatingCount.split("").length > 6 ? "M" : "K")
  return (
    <View><Text>{props.title}</Text></View>
  );
}
