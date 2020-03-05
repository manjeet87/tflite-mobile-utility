import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Home from './images_from_server';

export default class UploadPicture extends Component {
    render () {
        return (
            <View style={styles.container}>
                <Home/>   
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container : {
      flex : 1,
      alignItems: 'center',
      justifyContent : 'center',
      backgroundColor: '#455a64'
    }
  });