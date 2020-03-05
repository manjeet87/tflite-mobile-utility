import React, {Component} from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';


export default class MySpinner extends Component{
    render(){
        return(
            <View style={{ flex: 1 }}>
               <Spinner visible={true} textContent={"Loading.."} textStyle={{color: '#FFF'}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    spinnerStyle:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
})