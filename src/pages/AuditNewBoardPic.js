import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert, Dimensions,BackHandler } from 'react-native';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator} from "react-navigation";
import Logo from '../components/logo';
import UpdateOutletList from '../components/UpdateBoardOutletList';

export default class AuditNewBoardPic extends Component {

    constructor(props){
        super(props);
        
        this.backPressed = this.backPressed.bind(this)
        this.state = {
            errorm:'',
            disabled:true,
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
    this.props.navigation.navigate('board_page')
    //Alert.alert("Yes!!!");
    return true;
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
    buttondisable(){

        let storeDetails;
        // loginDetails is a variable made by us to hold global.params value
        // this.anyError is a variable which will be true if any of the key is empty and hence will throw error.
        storeDetails = global.params;
        Object.keys(storeDetails).forEach((key)=>{
            if(!storeDetails[key]){
                this.state.disabled=true
                this.setState({});
                console.log("TrueTrueTrueTrueTrue!!!!!!!!")
            }else{
                this.state.disabled=false
                this.setState({});
            }
        });

    }

    pickerButton(navigate){
            return(

                

                <TouchableOpacity
                    onPress={()=> navigate('image_picker_board')} 
                    //disabled={this.state.disabled}
                    style={styles.btn}>
                    <Text style={styles.btnText}>Choose Photo</Text>
                </TouchableOpacity>
            )
    }
    

    render() {
        const { navigate } = this.props.navigation;
        return (

            <View style={styles.container}>

            

                <UpdateOutletList/>
                <View style={styles.btncontainer}>
                    {this.pickerButton(navigate)}
                </View>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container : {
      backgroundColor : 'white',
      flex : 1,
      alignItems: 'center',
      justifyContent: 'center'
      
    },
    btncontainer:{
        //justifyContent: 'space-between',
        alignItems: 'center',
        //flexDirection: 'row',
        justifyContent:'center',
        marginBottom: 0
      },
    btn: {
        width: Dimensions.get('window').width,
        height: 50,
        backgroundColor:'#b822c7',
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
  