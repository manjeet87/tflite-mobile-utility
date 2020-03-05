import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  TouchableHighlight,
  Image,
  Text,
  Button,
  Alert
} from 'react-native';
import Camera  from 'react-native-camera';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator} from "react-navigation";
import ImageResizer from 'react-native-image-resizer';
import MySpinner from '../components/Spinner';

/*
Variables inside constructor:-
path:- variable to capture the path of clicked image/
resizedImageUri: images taken from camera were very large in size and not able to load them when retrieving from database
, so need to change the size of the image.

Submit:- function that will be called when we click on submit or resubmit button to send the data
SubmitClick:- function that is used to change the button from 'submit' to 'resubmit'

resize:- function to reduce the size of the image

checkButton:- this button is used to check if we have already selected all the values from the picker or we have missed 
something and an alert box will appear.

renderCamera:- this function is to open the camera when take photo option is clicked

takePhoto:- this function is called inside renderCamera to take the photo and capture the image and path of the image 
inside the variable path

renderImage:- this function is used to show the image on the screen that is clicked by the camera

After that you will get two option either to submit the image or cancel it.
*/

export default class CameraApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null,
      resizedImageUri: '',
      submitPressOnce: true,
      submitOnce: true,
      loading: false
    };
  }

  Submit(navigate) {
    if (this.state.resizedImageUri && this.state.submitOnce) {
      this.setState({loading: true});
      this.setState({ submitOnce: false })
      // Create the form data object
      //console.log( this.state.ImageSource );
      let localUri = this.state.resizedImageUri;
      console.log(this.state.resizedImageUri);
      //let localUriNew = localUri.replace(/_/g, '-');
      //console.log(localUriNew);
      let filename = localUri.split('/').pop();
      //let filenameNew = 'image-' + filename;
      //console.log('new filename: ',filenameNew);
      //console.log('type of filename: ',typeof(filename))
      let local_data = global.params;
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      //console.log(type)
      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "image" is the name of the form field the server expects
      formData.append('image', { uri: localUri, name: filename, type:'image/jpeg' });
      formData.append( 'Name', local_data['name'])
      formData.append('Location', local_data['location'])
      formData.append('OutletName', local_data['outletName'])
      console.log(formData);
      // Create the config object for the POST
      const config = {
       method: 'POST',
       headers: {
         'Content-Type': 'multipart/form-data'
       },
       body: formData,
      }

      fetch('https://172.20.10.5:8002/image', config)
      .then((response) => {
        console.log('Response: ', response.status)
        if(response.status === 200){
          this.setState({ loading: false })
          Alert.alert('Image Submitted');
          navigate('home_page')
        }
        else if (response.status === 404){
          console.log("Inside status 404");
          Alert.alert('Page 404 Not Found Try after sometime')
          this.setState({ submitPressOnce: false })
          this.setState({ loading: false })
        }
        else{
          Alert.alert('Image not submitted Resubmit');
          this.setState({ submitPressOnce: false })  
          this.setState({ loading: false })
        }
      }).catch((error) => {
        console.log("Inside catch");
        //Alert.alert(error)
        Alert.alert('Check your internet connection');
        this.setState({ submitPressOnce: false })
        this.setState({ submitOnce: true })
        this.setState({ loading: false })
        //console.error(error);
    });
}
}

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

  resize(){
    ImageResizer.createResizedImage(this.state.path, 375, 500, 'JPEG', 80)
    .then(({uri}) => {
      this.setState({
        resizedImageUri: uri,
      });
    }).catch((err) => {
      console.log(err);
      return Alert.alert('Unable to resize the photo',
        'Check the console for full the error message');
    });
  }

  takePicture() {
    console.log('inside take picture');
    this.camera.capture()
    .then((data) => {
      console.log(data);
      this.setState({ path: data.path })
      this.resize()
      //console.log(data.path)
    })
    .catch(err => console.error(err));
}

renderCamera() {
    console.log('Inside render camera');
    return (
      <View>
      <Camera
      captureTarget={Camera.constants.CaptureTarget.disk}
      ref={(cam) => {
        this.camera = cam;
      }}
      style={styles.preview}
      aspect={Camera.constants.Aspect.fill}
    >
      <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE IMAGE]</Text>
    </Camera>
    </View>
    );
}
  

  renderImage(navigate) {
    return (
      <View>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <View style={styles.btnconatiner}>
        <View style={styles.buttonContainer}>
        <Button
          color="#1c313a"
          title="Cancel"
          onPress={() => this.setState({ path: null })}
        />
        </View>

        <View style={styles.buttonContainer}>
          {this.submitClick(navigate)}
        </View>
        </View>
      
      </View>
    );
  }

  checkButton(navigate){
    // loginDetails is a variable made by us to hold global.params value
    // this.anyError is a variable which will be true if any of the key is empty and hence will throw error.
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
              navigate('audit_NewStore')
            );
      }

    else{
      console.log(this.state.path);
      if(this.state.path){
        return(
          this.renderImage(navigate)
        );
      }
      else{
        return(
          this.renderCamera()
        );
      }
    }

  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}> 
        {this.checkButton(navigate)}
      </View>
    );
  }
};

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
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  btnconatiner:{
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 50
  }
});