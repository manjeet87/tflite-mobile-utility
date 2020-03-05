import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, StatusBar, TouchableOpacity, Alert, Dimensions,BackHandler } from 'react-native';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator} from "react-navigation";
import Logo from '../components/logo';
import UpdateStoreList from '../components/UpdateStoreDetail';
import Tflite from 'tflite-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import MySpinner from '../components/Spinner';

let tflite = new Tflite();

const height = 350;
const width = 350;
const blue = "#25d5fd";
const mobile = "MobileNet";
const ssd = "SSD MobileNet";
const yolo = "Tiny YOLOv2";


export default class myYolo extends Component {

    constructor(props){
        super(props);
        this.backPressed = this.backPressed.bind(this)
        this.state = {
            model: null,
            source: null,
            imageHeight: height,
            imageWidth: width,
            recognitions: [],
            results: false,
            loading:false
          };
    }
    
    /*
    There are two options 'Take Photo' or 'Choose Photo' inside their respective functions. Right now i have called upon the
    pickerButton function since it gives two functionality either to choose from gallery ( for testing purpose from gallery )
    or take from camera.
    But when the app will be given to use in real time we need to remove the functionality to pick from gallery. At that time
    one need to use cameraButton function as it disables the pick from gallery option. And is more UI friendly.
    One just need to change the name of the function to reverse the functionality inside render.
    */
    componentWillMount() {
        console.log('Mount');
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
   }
 
    componentWillUnmount() {
        console.log('Unmount');
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
    this.props.navigation.navigate('home_page')
    //Alert.alert("Yes!!!");
    return true;
   }

  Submit() {
    if (this.state.results) {
      this.setState({loading: true});
      
      // let mainserver = 'http://172.19.1.48:8000'
      let mainserver = 'http://192.168.0.104:8000'
      let localUri = this.state.source['uri'];
      let filename = localUri.split('/').pop();
      let local_data = this.state.recognitions;
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let iWidth = this.state.imageWidth;
      let iHeight = this.state.imageHeight;
      console.log(localUri,filename,type)
      let formData = new FormData();
      // Assume "image" is the name of the form field the server expects.
      formData.append('image', { uri: localUri, name: filename, type:'image/jpeg', width: iWidth, height: iHeight });
      formData.append( 'data', JSON.stringify(local_data));
      // formData.append( 'uri', filename);
      formData.append('model', this.state.model);

      // formData.append('OutletName', local_data['outletName'])
      // formData.append('Category', local_data['cat']),
      // formData.append('lat', local_data['lat']),
      // formData.append('long', local_data['long'])
      // Create the config object for the POST
      const config = {
       method: 'POST',
       headers: {
          'Content-Type': 'multipart/form-data'
          //"Authorization" : "Token e28cf8c22cba44e14f759a9efa0d7471f3ec73c2"
       },
       body: formData,
      }
      //prizmatics-dot-dogwood-keep-190311.appspot.com
      console.log("here!!!");
      console.log(formData,"endddd");
      fetch(mainserver+'/submit_object/', config)
      .then((response) => {
        console.log('Response: ', response.status)
        if((response.status === 201) || (response.status === 200)){
          this.setState({ loading: false })
          Alert.alert('Image Submitted');
          const { goBack } = this.props.navigation;
          // return();
          // goBack(null)
          //navigate('home_page')
        }
        else if (response.status === 404){
          console.log("Inside status 404");
          Alert.alert('Page 404 Not Found Try after sometime');
          this.setState({ loading: false })
        }
        else{
          //Alert(response.status)
          Alert.alert('Image not submitted Resubmit');
          this.setState({ loading: false }) 
        }
      }).catch((error) => {
        console.log("Inside catch");
        console.log(error);
        console.log("catch log ends!!")
        console.log(response)
        Alert.alert('Check your internet connection');
        //Alert.alert(error.response);
        this.setState({ loading: false })
        });
    }
  }

    selectPhotoTapped() {
        const options = {
        quality: 1.0,
        maxWidth: 5000,
        maxHeight: 5000,
        storageOptions: {
            skipBackup: true
        }
        };

        
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            freeStyleCropEnabled: true

            }).then(image => {
                console.log("image selected!!");
                console.log(image);
                let src =  image.path ;
                let w = image.width
                let h = image.height
                this.setState({ 
                source: { uri: src },
                imageHeight: h * width / w,
                imageWidth: width,
                results:false
                });
            
            });
    }

    cameraButton(navigate){
            return(
                <TouchableOpacity
                    onPress={()=> navigate('CameraApp')} 
                    style={styles.btn}>
                    <Text style={styles.btnText}>Take Photo</Text>
                </TouchableOpacity>
            );
    }

    pickerButton(navigate){
            return(
                <TouchableOpacity
                    onPress={()=> this.selectPhotoTapped()} 
                    style={styles.btn}>
                    <Text style={styles.btnText}>Choose Image</Text>
                </TouchableOpacity>
            )
    }

    yolo_detect(){
        console.log("Inside Yolo!!")
        this.setState({model:'Yolo',loading:true});
        console.log(this.state.model)
        console.log("Inside Yolo22!!")
        var modelFile = 'models/yolov2_tiny.tflite';
        var labelsFile = 'models/yolov2_tiny.txt';
        tflite.loadModel({
            model: modelFile,
            labels: labelsFile,
          },
            (err, res) => {
              if (err)
                console.log("ERRORR!!!",err);
              else
                console.log(res);
        });
        const mod = this.state.model;
        const source = this.state.source;
        const imageHeight = this.state.imageHeight;
        const imageWidth = this.state.imageWidth;
        const path = source['uri']
        console.log(mod,source,imageHeight,imageWidth,path)
        tflite.detectObjectOnImage({
            path,
            model: 'YOLO',
            imageMean: 0.0,
            imageStd: 255.0,
            threshold: 0.4,
            numResultsPerClass: 5,
          },
            (err, res) => {
              if (err){
                console.log("ERRORR!!!",err);
                this.setState({results:false})
              }
                
              else{
                console.log(res);
                this.setState({ 
                    recognitions: res,
                    results: true,
                    loading:false
                 });
              }
            });
    }

    renderResults() {
        const { model, recognitions, imageHeight, imageWidth } = this.state;
        console.log(model, recognitions, imageHeight, imageWidth )
        
            return recognitions.map((res, id) => {
              var left = res["rect"]["x"] * imageWidth;
              var top = res["rect"]["y"] * imageHeight;
              var width = res["rect"]["w"] * imageWidth;
              var height = res["rect"]["h"] * imageHeight;
              return (
                <View key={id} style={[styles.box, { top, left, width, height }]}>
                  <Text style={{ color: 'white', backgroundColor: blue }}>
                    {res["detectedClass"] + " " + (res["confidenceInClass"] * 100).toFixed(0) + "%"}
                  </Text>
                </View>
              )
            });
                       
      }
    

    render() {
        const { navigate } = this.props.navigation;
        const { model, source, imageHeight, imageWidth,results } = this.state;
        var modelFile = 'models/ssd_mobile.tflite';
        var labelsFile = 'models/yolov2_tiny.txt';
        return (
            <View style={styles.container}>
                {this.state.status && <MySpinner size="large"/>}
                <View style={styles.btncontainer}>
                    {this.pickerButton(navigate)}
                </View>
                <View style={
                    [styles.imageContainer, {
                    height: imageHeight,
                    width: imageWidth,
                    borderWidth: source ? 0 : 2
                    }]} 
                    onPress={navigate('yolo_img')}>
                    {
                    source ?
                        <Image source={source} style={[{
                        height: imageHeight, width: imageWidth,
                        }, resizeMode="contain" ]}/> :
                        <Text style={styles.text}>Select Picture</Text>
                    }
                    {
                    results ?
                    <View style={styles.boxes}>
                        {this.renderResults()}
                    </View> :
                    <Text style={styles.text}>Select Picture</Text>
                    }
                </View>
                <View style={styles.container2}>
                        <View style={styles.container3}>
                        <TouchableOpacity
                            onPress={()=> this.yolo_detect()} 
                            style={styles.btn}>
                            <Text style={styles.btnText}>Yolo Detect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=> this.Submit()} 
                            style={styles.btn}>
                            <Text style={styles.btnText}>Submit Results</Text>
                        </TouchableOpacity>
                        </View>
                
                </View>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container2 : {
        backgroundColor : 'white',
        flex : 1,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent: 'center'
        
      },
    container : {
      backgroundColor : 'white',
      flex : 1,
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center'
      
    },
    text: {
        color: blue
    },

    box: {
        position: 'absolute',
        borderColor: blue,
        borderWidth: 2,
      },

    boxes: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    imageContainer: {
        borderColor: blue,
        borderRadius: 5,
        alignItems: "center"
      },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    container3:{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 0
      },
    btn: {
        width: '40%',
        height: 50,
        backgroundColor:'#0051ff',
        justifyContent:'center',
        alignItems:'center',
    },

    btnText: {
        fontSize:16,
        fontWeight:'500',
        color:'white',
        textAlign:'center',
    }
  });
  