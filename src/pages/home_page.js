import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Dimensions, AsyncStorage, Alert, BackHandler, Platform } from 'react-native';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator, createDrawerNavigator, DrawerItems, SafeAreaView} from "react-navigation";
import {CachedImage, CachedImageBackground} from "react-native-img-cache";
import LinearGradient from 'react-native-linear-gradient';

/*
clickLogout:- When we click on the icon of logout this function is called and entry from async storage is removed.
navigationOptions:- Included to customize the header of the page with home icon and logout icon.
render:- again the same function which will be included in every file
*/


export default class home_page extends Component {

    constructor(props){
        super(props);
        this.backPressed = this.backPressed.bind(this)
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleLogout: this.clickLogout.bind(this)});
        
    }

    componentWillMount() {
        console.log('Mount');
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
     }
     
    componentWillUnmount() {
        console.log('Unmount');
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        /*
         Alert.alert(
           'Exit App',
           'Do you want to exit?',
           [
             {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'Yes', onPress: () => BackHandler.exitApp()},
           ],
           { cancelable: false })
     */
     
     this.props.navigation.navigate('MainForm')
     //BackHandler.exitApp()
     return true;
    }

    /*
    Here if the user click on logout button, it will remove the loggedIn parameter from Async storage and again it will 
    become null. And it will navigate us to Login screen.
    */
    clickLogout() {
        const { navigate } = this.props.navigation;
        // navigate is a variable which will be used for propagation and is defined as is.
        global.logIn = false;
        AsyncStorage.removeItem('loggedIn');
        Alert.alert('Logout Success!');
        navigate('MainForm');
    }
    

    /*
    This code is for header of home_page.js It contains two images one for home icon and other for logout icon.
    */
    static navigationOptions = ({navigation}) =>({
        headerTitle: <Image style={{ width: 70, height: 25 }} source={require('../images/home.png')} resizeMode='contain'/>,
        headerLeft: null,			
      headerRight:<TouchableOpacity onPress={() => navigation.state.params.handleLogout()}>
      <Image style={{ width: 70, height: 25 }} source={require('../images/logout2.png')} resizeMode='contain'/></TouchableOpacity>
    });

    
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
           method: 'GET',
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


    render() {
        return (
            <View style={styles.container}>
                
                <TouchableOpacity
                onPress={()=> this.props.navigation.navigate('my_yolo')}
                style={[styles.btn1,styles.box, styles.box1]}>
                    <Image style={{width: 90, height: 70, marginVertical:10}}
                    source = {require('../images/shelf.png')} resizeMode='contain'/>
                    <LinearGradient colors={['#0200ff', '#00e9ff']} style={styles.btn}>
                        <Text style={styles.btnText}>YoloV3</Text>
                    </LinearGradient>
                </TouchableOpacity>
                

                <TouchableOpacity
                onPress={()=> this.props.navigation.navigate('board_page')}
                style={[styles.btn2, styles.box, styles.box2]}>
                    <Image style={{width: 90, height: 70, marginVertical:10}}
                    source = {require('../images/board_logo.png')} resizeMode='contain'/>
                    <LinearGradient colors={['#570be2', '#b822c7']} style={styles.btn}>
                        <Text style={styles.btnText}>ImageNet</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container : {
      flex : 1,
      flexDirection: 'column',      
    },

    backgroundImage: {
        position: 'absolute',
        flex: 1,
        alignSelf: 'stretch',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center'
    },

    btn: {
        alignSelf: 'stretch',
        width: 250,
        height: 50,
        backgroundColor:'#ff6347',
        borderRadius:5,
        marginVertical:12,
        paddingVertical:13,
        marginLeft: 35,
    },

    box: {
        height: '40%',
        width: '90%',
      },
    box1: {
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius:8,
        alignItems:'center',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop : 55,
        shadowColor: "#570be2",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.7,
        shadowRadius: 15,
        elevation: 14,
        borderWidth: 3,
        borderColor: '#0051ff'
      },

    box2: {
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius:8,
        alignItems:'center',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop : 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        borderWidth: 3,
        borderColor: '#570be2'
      },

    btn1: {
        backgroundColor:'white',
        alignSelf: 'stretch',
        width: 290,
        height: 50,
        borderRadius:5,
        marginTop:40,
        marginVertical:12,
        paddingVertical:13,
        marginLeft:18,

    },
    btn2: {
        backgroundColor:'#ff6347',
        alignSelf: 'stretch',
        width: 290,
        height: 50,
        borderRadius:5,
        marginTop:40,
        marginVertical:12,
        paddingVertical:13,
        marginLeft:18
    },
    btnText: {
        fontSize:16,
        //fontWeight:'500',
        fontFamily: 'Montserrat-Bold',
        color:'white',
        textAlign:'center',
        justifyContent: 'center'
    },
  });
