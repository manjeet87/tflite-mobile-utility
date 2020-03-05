import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Button,
  Dimensions,
  Alert,
  NetInfo
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator} from "react-navigation";
import MySpinner from '../components/Spinner';
import Geolocation from 'react-native-geolocation-service';

/*
Variables inside constructor:
loading:- This is the variable we use to load the spinner when the user click submit button to submit the data.
submitOnce:- This is the variable we use to change the 'submit' to 'resubmit'.
ImageSource:- This is the variable to capture the path of the image rendered.  

Submit:- function that will be called when we click on submit or resubmit button to send the data
SubmitClick:- function that is used to change the button from 'submit' to 'resubmit'

SelectPhotoTapped:- this function was copied from the internet and it is used to select the image that we click or tapped 
from the gallery.

renderImage:- ( this was also copied ) after we select the image, to show that image on screen we use this function

*/


export default class image_picker_shelf extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          ImageSource: null,
          submitPressOnce: true,
          submitOnce: true,
          loading: false
        };
      }

      Submit(navigate) {
        if (this.state.ImageSource && this.state.submitOnce) {
          this.setState({loading: true});
          this.setState({ submitOnce: false })
          let localUri = this.state.ImageSource;
          let filename = localUri.split('/').pop();
          let local_data = global.params;
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          console.log(localUri,filename,type)
          let formData = new FormData();
          // Assume "image" is the name of the form field the server expects.
          formData.append('image', { uri: localUri, name: filename, type:'image/jpeg' });
          formData.append( 'BrandName', local_data['brandname'])
          formData.append('Location', local_data['location'])
          formData.append('OutletName', local_data['outletName'])
          formData.append('Category', local_data['cat']),
          formData.append('lat', local_data['lat']),
          formData.append('long', local_data['long'])
          // Create the config object for the POST
          const config = {
           method: 'POST',
           headers: {
             'Content-Type': 'multipart/form-data',
             "Authorization" : "Token e28cf8c22cba44e14f759a9efa0d7471f3ec73c2"
           },
           body: formData,
          }
          //prizmatics-dot-dogwood-keep-190311.appspot.com
          fetch(global.mainserver+'/shelfImage_upload/', config)
          .then((response) => {
            console.log('Response: ', response.status)
            if(response.status === 200){
              this.setState({ loading: false })
              Alert.alert('Image Submitted');
              const { goBack } = this.props.navigation;
              goBack(null)
              //navigate('home_page')
            }
            else if (response.status === 404){
              console.log("Inside status 404");
              Alert.alert('Page 404 Not Found Try after sometime');
              this.setState({ loading: false })
              this.setState({ submitPressOnce: false })
              this.setState({ submitOnce: true })
            }
            else{
              //Alert(response.status)
              Alert.alert('Image not submitted Resubmit');
              this.setState({ loading: false })
              this.setState({ submitPressOnce: false })
              this.setState({ submitOnce: true })  
            }
          }).catch((error) => {
            console.log("Inside catch");
            Alert.alert('Check your internet connection');
            //Alert.alert(error.response);
            this.setState({ loading: false })
            this.setState({ submitPressOnce: false })
            this.setState({ submitOnce: true })
        });
    }
    }


    /*
    This function changes the functionality upon submitting the data.
    */
 submitClick(navigate){
    if(this.state.loading){
      return <MySpinner size="large"/>;  
    }

    else if(this.state.submitPressOnce){
      return (
        <Button
            color="#1c313a"
            title="Submit"
            onPress={() => {this.Submit(navigate)}}
          />
      )
    }

    else {
      return (
        <Button
            color="#1c313a"
            title="Resubmit"
            onPress={() => {this.Submit(navigate)}}
          />
      )
    }
      
  }

  selectPhotoTapped(navigate) {
    const options = {
      quality: 1.0,
      maxWidth: 5000,
      maxHeight: 5000,
      storageOptions: {
        skipBackup: true
      }
    };

    let loginDetails;
    // loginDetails is a variable made by us to hold global.params value
    // this.anyError is a variable which will be true if any of the key is empty and hence will throw error.
    loginDetails = global.params;
    Object.keys(loginDetails).forEach((key)=>{
        if(!loginDetails[key]){
            this.anyError = true;
        }
    });

    if(this.anyError){
        Alert.alert('Please fill in all the details');
        return (
            navigate('audit_NewStore')
        );
    }

    else {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            freeStyleCropEnabled: true

          }).then(image => {
            console.log(image);
            let src =  image.path ;
            this.setState({ ImageSource: src});
          
        });
    }
  }

  renderImage(navigate) {
    return (
      <View>
        <Image
          source={{ uri: this.state.ImageSource }}
          style={styles.preview}
        />
        <View style={styles.btnconatiner}>
          <View style={styles.buttonContainer}>
          <Button
            color="#1c313a"
            title="Cancel"
            onPress={() => this.setState({ ImageSource: null })}
          />
          </View>

        <View style={styles.buttonContainer}>
          {this.submitClick(navigate)}
        </View>
        </View>
      
      </View>
    );
  }


  render() {
    const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>
              {this.state.ImageSource === null ? this.selectPhotoTapped(navigate) :
              this.renderImage(navigate)}
        </View>
      );
  }

}



const styles = StyleSheet.create({

  container: {

      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
  },
  preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width
  },
  btnconatiner:{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
  
  },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      height: 50
  }

});