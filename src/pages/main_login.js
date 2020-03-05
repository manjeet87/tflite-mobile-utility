import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator} from "react-navigation";
import MainLoginForm from '../components/MainLoginForm';

export default class main_login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <MainLoginForm/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      backgroundColor : '#455a64',
      flex : 1,
      alignItems: 'center',
      justifyContent: 'center',
      
    }
  });
