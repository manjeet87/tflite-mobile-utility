import React, {Component} from 'react';
import { 
    StyleSheet,
    Text,
    View,
    AsyncStorage, 
    TextInput, 
    TouchableOpacity, 
    Button,
    Dimensions, 
    Alert, 
    Image, 
    TouchableHighlight,
    Picker,
    BackHandler,
    PermissionsAndroid, NetInfo } from 'react-native';
import Camera from 'react-native-camera';
import { StackNavigation, TabNavigation, createStackNavigator, createSwitchNavigator, createDrawerNavigator, SafeAreaView} from "react-navigation";
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import MySpinner from './Spinner';

export default class UpdateStoreList extends Component {

    constructor (props){        
        super(props);
        global.params=[]
        this.state = {
            brandname:'',
            location:'',
            outlet:'',
            latitude: null,
            longitude: null,
            anyError: false,
            dataOutletName:[],
            dataLocation:[],
            dataBrandName:[],
            errorm:'',
            loading:false,
            response_status:0,
            brand_outletjson:{}
        };
    }

    /*
    Inside componentDidMount we call the function Geolocation.getCurrentPosition() which is builtin function which gives
    us the coordinates of current location. When this function is called it might not fetch the coordinates in very first 
    attempt. So an additional button 'update outlet list' is embedded which will call the same function and update the outlet
    list. 

    componentDidMount:- function that is called automatically as soon as this class is used.

    getCordinates:- function which is called when we click on 'updateOutletList' button.

    submit:- After selecting all the values from the picker submit function is called so that all the values will be saved
    in global variable. 

    */
    componentDidMount() {
        // const granted = PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //     {
        //       'title': 'Retailo App',
        //       'message': 'Example App access to your location '
        //     }
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED){

        // }
        // Geolocation.getCurrentPosition(
        //     (position) => {
        //         this.setState({
        //             latitude: position.coords.latitude,
        //             longitude: position.coords.longitude,
        //             error: null,
        //           });
        //     },
        //     (error) => {
        //         // See error code charts below.
        //         this.setState({errorm:error.message});
        //         console.log(error.code, error.message);
        //     },
        //     { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
        // );
        // console.log(this.state.latitude)
        // console.log(this.state.longitude)
    }

    async getCordinates() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'RetailoAudit',
                'message': 'Request for access to your location.'
            }
        );
        console.log("Status: ",granted, PermissionsAndroid.RESULTS.GRANTED)
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED){
            console.log(granted)
            Geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                      },() => {console.log(this.state.latitude),
                               this.getAddress()});
                },
                
                (error) => {
                    // See error code charts below.
                    this.setState({errorm:error.message});
                    console.log(error.code, error.message);
                },
                //{ enableHighAccuracy: true, timeout: 3000, maximumAge: 10000 }
            );

        }
    }
    getAddress(){
        //this.setState({});
        console.log("Heeeeeeere")
        console.log(this.state.latitude);
        console.log(this.state.longitude);
        
        if(this.state.latitude===null || this.state.longitude===null) {
            Alert.alert("GPS Position Error. Try Again!");
        }
        else {
            console.log("Heere")
            this.setState({error: '', loading: true});
            fetch(global.mainserver+'/nearby_stores/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization" : "Token e28cf8c22cba44e14f759a9efa0d7471f3ec73c2"
                //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: JSON.stringify({
                    'latitude': this.state.latitude,
                    'longitude': this.state.longitude,
                    'cat': 'Shelf'
                })
            }).then((response) => {
                this.setState({response_status:response['status']})
                console.log(this.state.response_status)
                //console.log("Response total: ",response)
                if(this.state.response_status === 200){
                    return response.json();
                }

            }).then((data) => { 
                // <!DOCTYPE ....
                console.log(data)
                console.log(typeof(data))
                if(this.state.response_status === 200){

                    this.setState({loading:false})
                    let json_data = JSON.parse(data);
                    console.log(typeof(json_data))
                    console.log(json_data.outlets_list['brands']);
                    this.state.dataOutletName = json_data.outlets_list['outlets']
                    this.state.dataLocation = json_data.outlets_list['area']
                    this.state.brand_outletjson = json_data.outlets_list['brands']
                    this.state.dataBrandName = ["Maggi"]
                    // this.setState({dataOutletName:json_data.outlets_list['outlets']})
                    // this.setState({dataLocation:json_data.outlets_list['area']})
                    // this.setState({brand_outletjson:json_data.outlets_list['brands']})
                    
                    console.log("Hello",this.state.brand_outletjson, typeof(this.state.brand_outletjson))
                    
                    console.log("HiHi",this.state.dataBrandName)
                    this.setState({});
                    
                    Alert.alert('Outlet list updated');
                }
                else{
                    //console.log(json_data['loc_data']);
                    this.setState({loading:false})
                    Alert.alert('Server Connection Error. Service unavailable.')
                }
            }).catch((error) => {
                this.setState({loading:false})
                //console.error(error);
                Alert.alert("Connection Error! Check Internet Connection.")
            });
        }
    }

    /*
    The values selected from picker are stored in global variable in global.params and we access the same variable 
    when sending the image along with the data in image_picker.js
    */
    submit() {
        // collection is a local variable used to hold the states 
        // global.params is a global variable
        let collection = {}
        collection.lat = this.state.latitude,
        collection.long = this.state.longitude,
        collection.brandname = this.state.brandname,
        collection.location = this.state.location,
        collection.outletName = this.state.outlet,
        collection.user_id = '12345',
        collection.cat = 'Shelf',
        global.params = collection;
    }   

    onOutletValueChange(value){
        this.state.outlet = value; 
        console.log("Inside")  
        this.setState({});
        console.log("Here Iam",this.state.outlet)
        let outlet = this.state.outlet.toString()
        try{
            if (this.state.outlet === ''){
                this.state.dataBrandName = ['LG']
                console.log(this.state.dataBrandName)
            }else{
                console.log(this.state.brand_outletjson[value])
                this.state.dataBrandName = this.state.brand_outletjson[outlet]
            }
            this.setState({})
            console.log("deeeta",this.state.dataBrandName)
        }
        catch{
            //this.state.dataBrandName = global.dt[outlet]
            this.setState({})
            console.log("data",this.state.outlet, outlet)
        }
        
    }

    render() {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#0200ff', '#00e9ff']} style={[styles.box, styles.box1]}>
                    <Text style={styles.logoText}>
                        STORE DETAIL
                    </Text>

                    <TouchableOpacity
                    onPress={()=>this.getCordinates()} 
                    style={styles.btn}>
                        <Text style={styles.btnText}>Update Store List</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={{marginTop:25}}>
                <View style={styles.inputBoxPicker}>
                <Picker
                    style={{color:'#a29895'}}
		            selectedValue={this.state.location}
		            onValueChange={(itemValue,itemIndex) => this.setState({location:itemValue})}>
		            <Picker.Item label="Location" value=""/>
		            {this.state.dataLocation.map((item, key)=>(
                    <Picker.Item label={item} value={item} key={key} />)
                    )}
		        </Picker>
                </View>

                <View style={styles.inputBoxPicker}>
                <Picker
                    style={{color:'#a29895'}}
                    selectedValue={this.state.outlet}
                    onValueChange={(value, index) => this.onOutletValueChange(value)}>
                    <Picker.Item label="Outlet Name" value=""/>
                    {this.state.dataOutletName.map((item, key)=>(
                    <Picker.Item label={item} value={item} key={key} />)
                    )}
                </Picker>
                </View>

                <View style={styles.inputBoxPicker}>
                <Picker
                    style={{color:'#a29895'}}
		            selectedValue={this.state.brandname}
		            onValueChange={(itemValue,itemIndex) => this.setState({brandname:itemValue})}>
		            <Picker.Item label="Brand Name" value=""/>
		            {this.state.dataBrandName.map((item, key)=>(
                    <Picker.Item label={item} value={item} key={key} />)
                    )}
		        </Picker>
                </View>
                </View>
                
                {this.submit()}

                {this.state.loading &&
                 <MySpinner size="large"/>}
            
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container : {
      flexGrow : 1, 
      justifyContent: 'center',
      alignItems:'center',
    },

    box: {
        height: '40%',
        width: 325,
      },

    box1: {
        backgroundColor: '#ff6347',
        justifyContent: 'center',
        borderRadius:8,
        alignItems:'center',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop : 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
      },

    inputBoxPicker: {
        width: 300,
        height: 50,
        borderRadius:0,
        paddingHorizontal:16,
        marginVertical:12,
        //borderRadius:8,
        backgroundColor:'rgba(255, 255, 255, 1)',
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 12,
    },

    inputBox:{
        width: 300,
        height:50,
        backgroundColor:'rgba(255, 255, 255, 0.3)',
        borderRadius:0,
        paddingHorizontal:16,
        fontSize:16,
        color:'#ffffff',
        marginVertical:12

    },

    btn: {
        width: 270,
        height: 50,
        backgroundColor:'white',
        borderRadius:5,
        marginVertical:12,
        paddingVertical:13,
        marginTop: 40,
    },

    btnText: {
        fontSize:16,
        fontWeight:'500',
        color:'#a29895',
        textAlign:'center'
    },
    
    logoText :{
        marginVertical: 15,
        fontSize:24,
        fontWeight:'500',
        color: 'rgba(255, 255, 255, 0.7)'
    }
  });
