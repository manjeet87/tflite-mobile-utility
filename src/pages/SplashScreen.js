import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, StatusBar, AsyncStorage, Image } from 'react-native';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator, StackNavigator, createDrawerNavigator} from "react-navigation";
import LinearGradient from 'react-native-linear-gradient';
import MainLoginForm from '../components/MainLoginForm';
import board_page from './board_page';

export default class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
      }
      /* When the user is not logged in and we fetch the item from async storage, it will give null and the state set for 
      loggedin parameter will be null.
      If the user is loggedin then the loggedin parameter will be true. And it will redirect us to home page.
      */
      componentDidMount() {
        this.timeoutHandle = setTimeout(()=>{
            AsyncStorage.getItem('loggedIn').then((value)  => {
                this.setState({ loggedIn: JSON.parse(value)});
              
              });
       }, 1500);
      }

      /* Mainform:- This is the main login screen which is called if the state for loggedin parameter is null. 
      */
      splashFunction(navigate){
          if(this.state.loggedIn===null){
              return(
                  navigate('home_page')
              );
          }
          else if(this.state.loggedIn===true){
              return(
                  navigate('home_page')
              )
          }
          else{
              console.log('Once inside splash')
              return(
                <View style = {styles.container}>
                <Text style={styles.text}>Tflite Mobile Utility</Text>
                <Image
                    style={{width: 200, height: 50, marginVertical:200}}
                    source={require('../images/logo_prizmatics.png')}
                    resizeMode='contain'
                />
                </View>
              );
          }
      }



    render(){
        const {navigate} = this.props.navigation;
        return(
            <LinearGradient colors={['#570be2', '#b822c7']} style={styles.container}>
                {this.splashFunction(navigate)}
            </LinearGradient>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color:'white',
        fontSize:26,
        fontWeight:'600',
        alignItems: 'center'
    }
});