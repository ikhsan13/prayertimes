/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ListView,
  AsyncStorage,
  InteractionManager,
  ActivityIndicator,
  AppState
} from 'react-native';
var prayTimes = require('./../utilities/PrayTimes.js');
var times;
var lat=0,lng=0;
var calc='MWL',asr='Standard',dst=false,timezone='0';
var ds;
class Home extends Component {
  constructor() {
    super();
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    times=[];
    this.state = {
      currentAppState: AppState.currentState,
      renderPlaceholderOnly: true,
      dataSource: ds.cloneWithRows(times),
      region: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        latitudeDelta: 0.000,
        longitudeDelta: 0.000,
      },
      coordinate: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      }
    };
  }

  componentWillReceiveProps(){
    // update times after settings
    this.componentDidMount();
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
          this.setState({ coordinate: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng)
          } });
          this.setState({ region: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              latitudeDelta: 0.000,
              longitudeDelta: 0.000
          } });
          //Calculation Method
          if (calc!=null) {
            prayTimes.prayTimes.setMethod(calc);
          }
          //Daylight Saving Time
          let daySaveTime=dst?1:0;

          //asr methods
          if (asr!=null) {
            prayTimes.prayTimes.adjust( {asr: asr} );
          }

          //
          times=prayTimes.prayTimes.getTimes(new Date(), [parseFloat(lat), parseFloat(lng)], parseInt(timezone),daySaveTime,'24h');
          this.setState({ dataSource: ds.cloneWithRows(times)});

          //
          this.timer=setInterval(() => {
                this.updateTime();
              }, 1000);
        });
      });
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  updateTime(){
    if (this.timer) {

        var currentdate =  new Date();
        let date =currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear();
        let time=currentdate.getHours() + ":"
                    + (currentdate.getMinutes()<10?('0'+currentdate.getMinutes()):currentdate.getMinutes()) + ":"
                    + (currentdate.getSeconds()<10?('0'+currentdate.getSeconds()):currentdate.getSeconds());
        this.setState({ date: date });
        this.setState({ time: time });
        var next='';
        for (x in times) {
            let time =times[x].split(':');
            let isha =times['isha'].split(':');
            let midnight =times['midnight'].split(':');

            if (time[0]=='00' && (currentdate.getHours()>isha[0] || (currentdate.getHours()==isha[0] && currentdate.getMinutes()>isha[1]))) {
              next='midnight';
              break;
            }
            if (currentdate.getHours()>isha[0]) {

            }
            if (time[0]>currentdate.getHours() || (time[0]==currentdate.getHours() && time[1]>=currentdate.getMinutes())) {
              if (next!='') {
                let other =times[next].split(':');
                if (other[0]>time[0] && other[0]>time[0]) {
                  next=x;
                }
              }else{
                next=x;
              }
            }
        }
        this.setState({ next: next });
        this.setState({renderPlaceholderOnly: false});
      }
  }
  onRegionChange(region) {
    this.state = {region:region};
  }
  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }
    return(<View style={{flex: 1,flexDirection: 'column'}}>
                <View style={{backgroundColor:'rgba(245, 252, 255, 1)',margin:10,marginTop:80,marginBottom:2,padding:4,borderRadius:5}}>
                  <Text style={{textAlign:'center',fontWeight:'bold',color: '#004D40',fontSize:26,padding:10}}>
                     {this.state.time}
                  </Text>
                  <Text style={{textAlign:'center',fontWeight:'400',color: '#80CBC4',fontSize:20}}>
                     {this.state.date}
                  </Text>
                </View>
                <ListView
                  enableEmptySections={true}
                  automaticallyAdjustContentInsets={false}
                  style={{flex:1,backgroundColor:'rgba(245, 252, 255, 1)',margin:10,marginTop:2,paddingBottom:4,paddingTop:0,borderRadius:5}}
                  dataSource={this.state.dataSource}
                  renderRow={(rowData,sectionID,number) =>
                  {
                    if(number==this.state.next){

                      return(
                          <TouchableHighlight>
                            <View style={{flex: 1, flexDirection: 'row',borderRadius:10,backgroundColor:'rgba(0, 77, 64, 0.84)',height:60,margin:10,marginBottom:0}}>
                              <Text style={{flex:1,color: '#fff',fontVariant:['small-caps'],padding:10,fontWeight:'bold',fontSize:30,textAlign:'center'}}>
                               {number}
                              </Text>
                              <Text style={{flex:1,color: '#80CBC4',padding:12,fontSize:30,textAlign:'center'}}>
                               {rowData}
                              </Text>
                            </View>
                          </TouchableHighlight>
                      );
                    }else{
                      return(
                          <TouchableHighlight>
                            <View style={{flex: 1, flexDirection: 'row',height:65}}>
                              <Text style={{flex:1,color: '#004D40',fontVariant:['small-caps'],padding:20,fontWeight:'800',fontSize:18,textAlign:'center'}}>
                               {number}
                              </Text>
                              <Text style={{flex:1,color: '#80CBC4',padding:20,fontSize:16,textAlign:'center'}}>
                               {rowData}
                              </Text>
                            </View>
                          </TouchableHighlight>
                      );
                    }
                  }
                  }
                />
            </View>);
  }
  _renderPlaceholderView() {
    return (
          <ActivityIndicator
            style={[styles.loading]}
            color="#004D40"
            size="large"
          />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loading: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  }
});
module.exports =Home;
