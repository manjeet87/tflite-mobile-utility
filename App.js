import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator, StackNavigator, createDrawerNavigator} from "react-navigation";
import { YellowBox } from 'react-native';

// This is to disable the warnings in yellow boxes.
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
import home_page from './src/pages/home_page';
import myYolo from './src/pages/myYolo'
import yolo_image from './src/pages/yolo_img'
//import picture_upload from './src/pages/picture_upload';
import image_picker_board from './src/pages/image_picker_board';
import image_picker_shelf from './src/pages/image_picker_shelf';
import MainLoginForm from './src/components/MainLoginForm';

import CameraApp from './src/pages/CameraApp';
//import DisplayAnImage from './src/pages/image_testing';
import SplashScreen from './src/pages/SplashScreen';

/*
This is the entry point of the app. It includes all the modules and pages upon which you want to navigate by clicking a 
button and include them inside Navigation constant as included. 
*/

// This are the global variables used to store the values.
global.params = {};
global.logIn = false;
global.logParam = '';


// navigation is the constant used inside render and it has been created using StackNavigator.
const Navigation = createStackNavigator({
  SplashScreen:{
      screen: SplashScreen, navigationOptions: { header: null }
  },
  MainForm:{
    screen: MainLoginForm, navigationOptions: { header: null }
  },
  home_page:{
      screen: home_page, navigationOptions: { headerStyle: { position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 }}
  },

  my_yolo:{
    screen: myYolo, navigationOptions: { headerStyle: { position: 'absolute', backgroundColor: 'transparent', zIndex: 50, top: 0, left: 0, right: 0 }}
  },

  image_picker_board:{
    screen: image_picker_board
  },

  image_picker_shelf:{
    screen: image_picker_shelf
  },
  yolo_image:{
    screen: yolo_image
  },

  CameraApp:{
    screen: CameraApp
  },
  
});

export default class App extends Component  {
  
  constructor(){
    super();
    // global.loginserver = "http://login-retailo.pagekite.me";
    // global.mainserver = "http://server-retailo.pagekite.me";
    // global.mainserver = "https://retailo-backend-dot-dogwood-keep-190311.appspot.com";
  }
  render(){
    console.disableYellowBox = true;
     return (
       <View style={styles.container}>
         <StatusBar
           backgroundColor="#1c313a"
           barStyle="light-content"
         />
         <Navigation/>
       </View>
     );
   }
 }

 const styles = StyleSheet.create({
   container : {
     backgroundColor : '#455a64',
     flex : 1,
     justifyContent : 'center'
   }
 });