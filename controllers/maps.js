import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  AsyncStorage,
  Platform
} from 'react-native';
import MapView from 'react-native-maps';
var lat=0,lng=0;

class Maps extends Component {
  constructor() {
    super();
    this.state = {
      region: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      coordinate: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      }
    };
  }
  componentDidMount() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {

       stores.map((result, i, store) => {
         // get at each store's key/value so you can work with it
         let key = store[i][0];
         let value = store[i][1];
         if (key=='@praytimes:lat') {
            lat=value;
         }else if (key=='@praytimes:lng') {
            lng=value;
         }
        });
        this.setState({ coordinate: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng)
        } });
        this.setState({ region: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            latitudeDelta: 0.3922,
            longitudeDelta: 0.3421,
        } });
        if (Platform.OS === 'ios') {
          this.map.animateToRegion(this.state.region);
        }
      });
    });
  }
    render(){
        return (
          <MapView
            style={{flex:1}}
            ref={ref => { this.map = ref; }}
            initialRegion={this.state.region}
            showsUserLocation={true}
            loadingIndicatorColor='#80CBC4'
            onPress={(e) => {
                this.setState({ x: e.nativeEvent.coordinate });
                try {
                  AsyncStorage.setItem('@praytimes:lat', ''+e.nativeEvent.coordinate.latitude+'');
                  AsyncStorage.setItem('@praytimes:lng', ''+e.nativeEvent.coordinate.longitude+'');
                  this.setState({ coordinate: {
                      latitude: parseFloat(e.nativeEvent.coordinate.latitude),
                      longitude: parseFloat(e.nativeEvent.coordinate.longitude)
                  } });
                } catch (error) {
                  // Error saving data
                }
              }
            }
            >
            <MapView.Marker
              image={require('./../resources/images/mosque.png')}
              coordinate={this.state.coordinate}
            />
          </MapView>
       );
     }
}
module.exports =Maps;
