/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { PropTypes,Component } from 'react';
var home=require('./controllers/home');
var settings=require('./controllers/settings');
var maps=require('./controllers/maps');

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} from 'react-native';

class Nav extends Component {
  render() {
    return (
      <NavigatorIOS
        ref='nav'
        style={styles.nav}
        barTintColor='#004D40'
        titleTextColor='#80CBC4'
        tintColor='#80CBC4'
        initialRoute={{
          component: home,
          title: 'مواقيت الصلاة' ,
          rightButtonTitle: 'الاعدادات',
          tintColor:'#80CBC4',
          onRightButtonPress: () => this._handleNavigationRequest(1),
        }}
      />
    );
  }
  _handleNavigationRequest(index) {
    if (index==1) {
      this.refs.nav.push({
            component: settings,
            title: 'الاعدادات',
            rightButtonTitle:'الخرائط',
            tintColor:'#80CBC4',
            onRightButtonPress: () => this._handleNavigationRequest(2)
      });
    }else if (index==2) {
      this.refs.nav.push({
            component: maps,
            title: 'الخرائط',
            rightButtonTitle: 'حفظ',
            tintColor:'#80CBC4',
            onRightButtonPress: () => this._handleNavigationRequest(3)
      });
    }else if (index==3) {
      this.refs.nav.pop();
    }
  }
}

var styles = StyleSheet.create({
  nav : {
      flex :1
  }
});


AppRegistry.registerComponent('PrayerTimes', () => Nav);
