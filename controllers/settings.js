import React, { Component } from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ReactNative from 'react-native';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  AsyncStorage,
  Picker,
  Switch,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
var lat=0,lng=0;
var calc='MWL',asr='Standard',dst=false,timezone='0';
class Settings extends Component {
    constructor() {
      super();
      this.state = {
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
           }else if (key=='@praytimes:calc') {
              calc=value;
           }else if (key=='@praytimes:asr') {
              asr=value;
           }else if (key=='@praytimes:dst') {
              dst=(value=='true')?true:false;
           }else if (key=='@praytimes:timezone') {
              timezone=value;
           }
          });
          this.setState({
             coordinate: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng)
            },
            calc:calc,
            asr:asr,
            dst:dst,
            timezone:timezone
         });
        });
      });
    }
    render(){

        return (
          <View style={{flex:1,margin:10,marginTop:80,marginBottom:2}}>
            <ScrollView ref='scrollView' automaticallyAdjustContentInsets={false} style={{padding:0}}>
              <View style={{padding:0}}>
                <View style={styles.row}>
                  <Text style={styles.label}>
                   طريقة الحساب
                  </Text>
                  <Picker
                    selectedValue={this.state.calc}
                    onValueChange={(calc) =>{
                      this.setState({calc: calc});
                      try {
                        AsyncStorage.setItem('@praytimes:calc', calc);
                        this.setState({ calc: calc });
                      } catch (error) {
                        // Error saving data
                      }
                    }
                    }>
                    <Picker.Item label="Muslim World League" value="MWL" />
                    <Picker.Item label="Islamic Society of North America" value="ISNA" />
                    <Picker.Item label="Egyptian General Authority of Survey" value="Egypt" />
                    <Picker.Item label="Umm al-Qura University, Makkah" value="Makkah" />
                    <Picker.Item label="University of Islamic Sciences, Karachi" value="Karachi" />
                    <Picker.Item label="Institute of Geophysics, University of Tehran" value="Tehran" />
                    <Picker.Item label="Shia Ithna Ashari (Ja`fari)" value="Jafari" />
                  </Picker>
                </View>
                <View style={styles.row}>
                   <Text style={styles.label}>
                   حساب العصر
                   </Text>
                   <Picker
                     selectedValue={this.state.asr}
                     onValueChange={(asr) =>{
                         this.setState({asr: asr});
                         try {
                           AsyncStorage.setItem('@praytimes:asr', asr);
                           this.setState({ asr: asr });
                         } catch (error) {
                           // Error saving data
                         }
                       }
                     }>
                     <Picker.Item label="Shafii, Maliki, Jafari and Hanbali (shadow factor = 1)" value="Standard" />
                     <Picker.Item label="Hanafi school of tought (shadow factor = 2)" value="Hanafi" />
                   </Picker>
                 </View>
                <View style={styles.row}>
                   <Text style={styles.label}>
                   التوقيت الصيفى
                   </Text>
                   <Switch
                      onValueChange={(dst) =>{
                         this.setState({dst: dst});
                         try {
                           AsyncStorage.setItem('@praytimes:dst', ''+dst);
                           this.setState({ dst: dst });
                         } catch (error) {
                           // Error saving data
                         }
                         }
                       }
                      style={{margin: 10}}
                      value={this.state.dst} />
                 </View>
                <View style={styles.row}>
                   <Text style={styles.label} >
                   التوقيت
                   </Text>
                   <TextInput
                      ref='time'
                      blurOnSubmit={true}
                      onFocus={this.inputFocused.bind(this,'time',true)}
                      onBlur={this.inputFocused.bind(this,'time',false)}
                      onSubmitEditing={this.inputFocused.bind(this,'time',false)}
                      style={{height: 40,textAlign:'right',padding:10}}
                      placeholder="+ 0"
                      keyboardType="numeric"
                      value={this.state.timezone}
                      onChangeText={(timezone) =>{
                         this.setState({timezone: timezone});
                         try {
                           AsyncStorage.setItem('@praytimes:timezone', timezone);
                           this.setState({ timezone: timezone });
                         } catch (error) {
                           // Error saving data
                         }
                       }
                     }
                    />
                    <KeyboardSpacer/>

                 </View>
              </View>
            </ScrollView>
          </View>
       );
     }
     // Scroll a component into view. Just pass the component ref string.
    inputFocused (refName,isFocused) {
      setTimeout(() => {
        let scrollResponder = this.refs.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          ReactNative.findNodeHandle(this.refs[refName]),
          isFocused?100:0, //additionalOffset
          true
        );
      }, 50);
    }
}
var styles = StyleSheet.create({
  label : {
      color :'#004D40',
      textAlign :'right',
      fontSize:20,
      backgroundColor:'rgba(245, 252, 255, 1)',
      marginBottom:2,
      padding:4,
      borderRadius:5
  }
  ,
  row :{
    alignItems:'stretch',
    margin:10,
  }
});
module.exports =Settings;
