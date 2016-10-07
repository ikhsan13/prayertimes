/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { PropTypes,Component } from 'react';
import Home from './controllers/home';
import Settings from './controllers/settings';
import Maps from './controllers/maps';

import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Navigator,
  TouchableOpacity,
  BackAndroid
} from 'react-native';
var dismissKeyboard = require('./utilities/dismissKeyboard');

var nav;
var _route;
const routes = [
   {title: 'مواقيت الصلاة',component: Home,index: 0},
   {title: 'الاعدادات',component: Settings, index: 1},
   {title: 'الخرائط',component: Maps,index: 2},
 ];
class Nav extends Component {
  constructor() {
    super();
    _route=routes[0];
    BackAndroid.addEventListener('hardwareBackPress', function() {
       if (_route.index==0 ) {
         return false;
       }else{
         nav.pop();
         _route=routes[_route.index-1];
         return true;
       }
    });
  }
  componentDidMount(){
    nav=this.nav;
  }
  render() {
    return (
      <Navigator
        ref={ref => { this.nav = ref; }}
        renderScene={(route, navigator) =>{
          if (route.index==0) {
            return (<Home />);
          }else if (route.index==1) {
            return(<Settings />);
          }else if (route.index==2) {
            return(<Maps />);
          }
        }
        }
        initialRoute={routes[0]}
        initialRouteStack={routes}
        navigationBar={
           <Navigator.NavigationBar
             style={styles.navBar}
             routeMapper={{
               LeftButton: (route, navigator, index, navState) =>
                {
                  if (route.index==0) {
                    return (null);
                  }else if (route.index==1) {
                    return (<TouchableOpacity
                      onPress={() => {
                        _route=routes[0];
                        dismissKeyboard();
                        navigator.pop();                      }}
                      style={styles.navBarRightButton}>
                      <Image source={require('./resources/images/ic_arrow_back_white_24dp.png')} style={{width:30,height:30,margin:12}} />
                    </TouchableOpacity>);
                  }else if (route.index==2) {
                   return ( <TouchableOpacity
                      onPress={() => {
                        _route=routes[1];
                        navigator.pop();
                      }}
                      style={styles.navBarRightButton}>
                      <Image source={require('./resources/images/ic_arrow_back_white_24dp.png')} style={{width:30,height:30,margin:12}} />
                    </TouchableOpacity>);
                  }
               },
               RightButton: (route, navigator, index, navState) =>
                 {
                   if (route.index==0) {

                    return (
                       <TouchableOpacity
                         onPress={() => {
                           _route=routes[1];
                           navigator.push(routes[1]);
                         }}
                         style={styles.navBarRightButton}>
                         <Text style={[styles.navBarText, styles.navBarButtonText]}>
                         {routes[1].title}
                         </Text>
                       </TouchableOpacity>
                     );
                   }else if (route.index==1) {
                     return (<TouchableOpacity
                       onPress={() => {
                         _route=routes[2];
                         navigator.push(routes[2]);
                       }}
                       style={styles.navBarRightButton}>
                       <Text style={[styles.navBarText, styles.navBarButtonText]}>
                       {routes[2].title}
                       </Text>
                     </TouchableOpacity>);
                   }else if (route.index==2) {
                    return ( <TouchableOpacity
                       onPress={() => {
                         _route=routes[1];
                         navigator.jumpBack();
                       }}
                       style={styles.navBarRightButton}>
                       <Text style={[styles.navBarText, styles.navBarButtonText]}>
                       حفظ
                       </Text>
                     </TouchableOpacity>);
                   }
               },
               Title: (route, navigator, index, navState) =>
                 { return (
                   <Text style={[styles.navBarText, styles.navBarTitleText]}>
                   {route.title}
                   </Text>); },
             }}
           />
        }
      />
    );
  }
}

var styles = StyleSheet.create({
  nav : {
      backgroundColor:'#004D40'
  },
  navBar: {
    backgroundColor: '#004D40',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 16,
  },
  navBarTitleText: {
    color: '#80CBC4',
    fontWeight: '500',
    marginVertical: 16,
    width:200,
    textAlign:'center'
  },
  navBarRightButton: {
    paddingRight: 14,
  },
  navBarButtonText: {
    color: '#80CBC4',
  }
});


AppRegistry.registerComponent('PrayerTimes', () => Nav);
