import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MovieList} from "./features/movieList/MovieList"
import { store } from './store';
import { Provider } from 'react-redux';

const Stack = createNativeStackNavigator();

export default App = () =>{
  return (
    <Provider store={store}>

    <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
          name="MovieList"
          component={MovieList}
          options={{title: 'Welcome'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}


// <Routes>
// <Route path="/" element={<PersistentDrawerLeft/>}>
//   <Route index element={<MovieList  />}/>
//   <Route path="/favorites" element={<MovieList  />}/>
//   <Route path="/movies/:id" element={<Movie />}/>
//   <Route path="*" element={<NoPage />} />
// </Route>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
