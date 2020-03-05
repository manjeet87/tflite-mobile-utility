import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import CameraApp from './CameraApp';


export default class picture_upload extends Component {

    constructor(props){
        super(props);
        this.state = {
        anyError: false,
    };
    }

    checkButton(navigate){
        let loginDetails;
        loginDetails = global.params;
        Object.keys(loginDetails).forEach((key)=>{
            if(!loginDetails[key]){
                this.anyError = true;
            }
        });

        if(this.anyError){
            Alert.alert('Please fill in all the details');
            return (
                navigate('login')
            );
        }
        else{
            return (
                navigate('image_picker')
            );
        }
    }

    render () {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                {this.checkButton(navigate)}  
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
  
