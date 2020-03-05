import React, {Component} from 'react';
import { 
    StyleSheet,
    Text,
    View, 
    TextInput, Switch,
    TouchableOpacity, 
    Button,
    Dimensions, 
    Alert, 
    Image, 
    ImageBackground,
    TouchableHighlight,
    AsyncStorage,
    BackHandler,
    ScrollView,
    KeyboardAvoidingView} from 'react-native';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator} from "react-navigation";
import {CachedImage, CachedImageBackground} from "react-native-img-cache";
import MySpinner from './Spinner';
import LinearGradient from 'react-native-linear-gradient';

/*
The very first thing is to import the components to use them as done above.

The main function of this class is to take the values from the user i.e. username and password in the variables 
email and pass respectively and send the data to django api where authentication will take place.
We have one more state loading which is set to true when the person press login button and it will load the spinner
and disable the login button.

fetch:- function which is used to hit the django api and get back response from there.

componentDidMount, componentWillMount:- lifecycle methods called automatically 

Login:- function which is called when we hit the login button inside.

updateValue:- when we fill the form, and update the text inside it this function will be called.

storelogin:- to store the value of loggedIn param in async storage.

render: function which is called inside class and includes all the other components.

The last thing is styling to style the components.
*/

export default class MainLoginForm extends Component {

    constructor (props){
        
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.state = {
            email:'',
            pass:'',
            error: '',
            loading: false,
            loggedIn: false,
            submitPressed: false,
            showPassword: false,
        };

        this.backPressed = this.backPressed.bind(this);
    }

    // Backpressed is a function which is made by us and backhandler is built in function.

    componentWillMount() {
        console.log('mount');
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }
    
    componentWillUnmount() {
        console.log('unmount');
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
     BackHandler.exitApp()
     return true;
    }

    /* If the user is logged in successfully then we store the value in loggedIn parameter and set it to true. 
    This function is called inside response from API.
    */
    async storeLogin(logParam){
        try {
            await AsyncStorage.setItem('loggedIn', JSON.stringify(logParam))
        } catch( error ){
            console.log('something went wrong: ', error.message)
        }

    }

    
    updateValue(text, field) {
        if (field === 'email'){
            this.setState({
                email: text,
            });
        }

        else if (field === 'pass'){
            this.setState({
                pass:text,
            });
        }
    }

    Login(navigate) {
        
        if((this.state.email === '') || (this.state.pass === '')){
            Alert.alert("Please fill in all details!")
            return
        }
        this.setState({error: '', loading: true});
        //this.setState({submitPressed: true});
        console.log(JSON.stringify({
            'email_or_username': this.state.email,
            'password': this.state.pass
        }))
        
        fetch(global.mainserver + '/users/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization" : "Token e28cf8c22cba44e14f759a9efa0d7471f3ec73c2"
            },
            body: JSON.stringify({
                'source': 'mobile_app',
                'email_or_username': this.state.email,
                'password': this.state.pass
            })
          }).then((response) => {
            return response.json();
          }).then((data) => {
              console.log(data);
              let json_data = JSON.parse(data);
              //global.authToken = json_data['token'];
              if(json_data['status'] === 'success'){
                this.setState({
                    // email: '',
                    // pass: '',
                    loading: false,
                    error: '',
                    loggedIn: true
                })
                this.storeLogin(this.state.loggedIn);
                global.logIn = this.state.loggedIn;
              Alert.alert('Login Successful');
              navigate('home_page')
          }
          else{
            this.setState({loading: false})
            Alert.alert('Username or password is incorrect.')   
          }
          })
          .catch((error) => {
            //this.setState({submitPressed:false})
            this.setState({loading:false})
            Alert.alert('Connection Error! Check Internet Connection.')
            return
          });

        }

        loginButton(navigate) {
            if(this.state.loading){
                return (
                    <MySpinner size="large"/>
                );
            }
            return (
            <TouchableOpacity
                onPress={()=>this.Login(navigate)}>
                <LinearGradient colors={['#570be2', '#b822c7']} style={styles.btn}>
                    <Text style={styles.btnText}>Login</Text>
                </LinearGradient>
            </TouchableOpacity>
            );
        }

    submitNext(navigate){
        if(global.logIn===true){
            return(
                navigate('home_page')
            );
        }
        Alert.alert('You are not logged in');

    }

    handlePress(evt){
        console.log(`x coord = ${evt.nativeEvent.locationX}`);
        //Alert.alert("HI!!");
    }

    toggleSwitch() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                
                <View style = {styles.content}>
                    <Image onPress={(evt) => this.handlePress(evt)}
                    style={styles.logoimage}
                    source = {require('../images/logo-03.png')}
                    />
                    <Text onPress={(evt) => this.handlePress(evt)}
                    style = {styles.logo}>USER LOGIN</Text>
                    
                    <View style = {styles.inputContainer}>
                        
                        <TextInput underlineColorAndroid = 'transparent' style = {[styles.input, this.state.submitPressed && styles.inputAlt]} 
                            placeholder = 'Username orrr Email' onChangeText = {(text) => this.updateValue(text, 'email')}>
                        </TextInput>

                        <View style = {styles.textBoxBtnHolder}>

                            <TextInput secureTextEntry = {!this.state.showPassword} underlineColorAndroid = 'transparent' style = {[styles.input, this.state.submitPressed && styles.inputAlt]} 
                                placeholder = 'Password' onChangeText={(text) => this.updateValue(text, 'pass')}>
                            </TextInput>
                            <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.toggleSwitch }>
                            <Image source = { ( this.state.showPassword ) ? require('../images/password-hide.png') : require('../images/password-show.png') } style = { styles.btnImage } />
                            </TouchableOpacity>
                        </View>

                        <Switch
                            onValueChange={this.toggleSwitch}
                            value={!this.state.showPassword}
                        /> 
                        
                        <Text style={styles.errorTextStyle}>
                            {this.state.error}
                        </Text>

                        {this.loginButton(navigate)}
                    </View>

                    
                    <Text style={{color:'#570be2', fontSize:10, fontFamily: 'Montserrat-Light' ,marginRight:20, marginTop:100}}>
                        Already Logged in?
                    </Text>
                    <TouchableOpacity onPress={() => this.submitNext(navigate)}>
                        <Text style={{color:'#570be2', fontSize:20, fontFamily: 'Montserrat-Bold',marginRight:20}}>Next</Text>
                    </TouchableOpacity>

                </View>    
            
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container : {
      flex: 1 
    },
    backgroundImage: {
        position: 'absolute',
        flex: 1,
        alignSelf: 'stretch',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center'
    },
    content: {
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    visibilityBtn:
    {
        position: 'absolute',
        right: 3,
        height: 16,
        width: 14,
        padding: 5
    },
  textBoxBtnHolder:
  {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  btnImage:
  {
    resizeMode: 'contain',
    height: '100%',
    width: '100%'
  },

    logoimage: {
        width: 100,
        height: 150,
        resizeMode: 'contain'
    },

    logo: {
        color: 'black',
        fontSize: 32,
        marginBottom: 20,
        fontFamily: 'Montserrat-Bold',
    },
    inputContainer: {
        margin:2,
        marginBottom:0,
        padding:20,
        paddingBottom:10,
        marginTop: 0,
        alignSelf:'stretch',
        
    },
    input: {
        fontSize:16,
        height:50,
        padding:10,
        alignSelf: 'stretch',
        marginBottom:10,
        borderRadius:5,
        backgroundColor:'rgba(255, 255, 255, 1)',
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 24,
        color: 'black',
        //borderColor: '#570be2',
        //borderWidth: 0.5
    },

    inputAlt: {
        fontSize:16,
        height:50,
        padding:10,
        marginBottom:10,
        borderRadius:5,
        backgroundColor:'rgba(255, 255, 255, 1)',
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    
    btn: {
        alignSelf: 'stretch',
        width: 320,
        height: 50,
        backgroundColor:'#ff6347',
        borderRadius:5,
        marginVertical:12,
        paddingVertical:13,
        //shadowColor: '#570be2',
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.5,
        //shadowRadius: 16,
        //elevation: 24,
    },

    btnText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center',
    },

    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
      }
  });