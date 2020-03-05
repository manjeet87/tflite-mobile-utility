import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View, Image, BackHandler,
         ImageBackground, Dimensions, ScrollView, TouchableOpacity, 
         RefreshControl, Alert, AsyncStorage } from "react-native";
import { StackNavigation, TabNavigation, createStackNavigator, DrawerNavigator} from "react-navigation";
import MySpinner from '../components/Spinner';
import {CachedImage, ImageCacheProvider} from 'react-native-cached-image';

export default class list_board extends Component {

  constructor(props){
    super(props);
    
    this.backPressed = this.backPressed.bind(this)
    this.state = {
      data: [],
      refreshing: false,
      tokenVal: '',
      response_status:'',
      loading:false,

    };
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
this.props.navigation.navigate('store_page')
//Alert.alert("Yes!!!");
return true;
}

  /*
  
  componentDidMount: it will be called automatially
  fetchData:- this is a function which will be called inside componentDidMount
  _onRefresh:- function that is called when we pull the screen downwards for refreshing and fetching the updating data

  */

  componentDidMount() {
    this.fetchData();
  }
  
  fetchData = async () => {
     this.setState({loading:true})
     await fetch(global.mainserver+"/my_shelf_images", {
      method: 'GET',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Token e28cf8c22cba44e14f759a9efa0d7471f3ec73c2"
      }
    }).then((response) => {

        console.log("Response: ", response)
        this.setState({response_status:response['status']})
        console.log(this.state.response_status)
        //console.log("Response total: ",response)
        if(this.state.response_status === 200){
            return response.json();
        }
    }).then((data) => {
        if(this.state.response_status === 200){

          this.setState({loading:false})
          console.log(typeof(data));
          let json_data = JSON.parse(data);
          console.log(typeof(json_data));
          console.log(json_data);
          this.setState({ data: json_data.links });
          if (json_data.links.length === 0){
            Alert.alert("No record found!");
            this.props.navigation.navigate("store_page")
          }

        }else{

          this.setState({loading:false})
          Alert.alert('Server Connection Error. Service unavailable.')
          this.props.navigation.navigate('store_page')
        }
    }).catch((error) => {
      console.log("Error here!")
      this.setState({loading:false})
      Alert.alert("Connection Error! Check Internet Connection.");
      this.props.navigation.navigate('store_page')
    });
      //const json = await response.json();
      //this.setState({ data: json.data });
  }

  _onRefresh() {
      this.setState({refreshing:true})
      this.fetchData().then(() =>{
          this.setState({refreshing:false})
      });
  }

  
  renderImage(navigate, item) {

    console.log("Inside ImageRenderFuncion!!!!!!!Here!!!!!")
    console.log(item)
		return (
      <View style={styles.imgcontainer}>
        <View>
          <CachedImage
            source={{ uri: item.imageurl }}
            resizeMode='contain'
            style={styles.img_preview}
            onPress= {()=> navigate('detail_screen',item)}
          />
          {/* <View style={styles.btnconatiner}>
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
          </View> */}
        
        </View>
      </View>
		);
  }	


  render() {
    //console.log(this.state.data)
    const { navigate } = this.props.navigation;
    return (
	  <View style={styles.container}>
      <FlatList
          data={this.state.data}
          renderItem={({ item }) =>
          <TouchableOpacity onPress= {()=> this.props.navigation.navigate('detail_screen_shelf', {item})}>
                <ImageBackground style = {styles.image} source={{uri: item.imageurl}} resizeMode='cover' blurRadius={0.8}> 
                        <Text style= {styles.text}>{item.clicktime}</Text> 
                        <Text style= {styles.text}>{item.store_name}, {item.city}</Text>
                        <Text style= {styles.text}>{item.status}</Text>
                </ImageBackground>
          </TouchableOpacity>        
          // <TouchableOpacity onPress= {()=> this.props.navigation.navigate('detail_screen', {item})}></TouchableOpacity>
            }

          refreshControl={
            <RefreshControl
            refreshing = {this.state.refreshing}
            onRefresh = {this._onRefresh.bind(this)}
            />
          }
      />
      {this.state.loading &&
        <MySpinner size="large"/>}

    </View>
    );
  }
}

  const styles = StyleSheet.create({
    scrollContainer: {
      flex:1,
    },
    container: {
      marginTop: 15,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5FCFF"
    },
    imgcontainer: {

      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
  },
  img_preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
},

    image: {
        width: Dimensions.get('window').width - 20,
        height: 150,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        borderRadius: 10,
        marginBottom: 30,
        //shadowOffset: { width: 0, height: 0 },
        //shadowColor: 'black',
        //shadowOpacity: 0.5,
        //shadowRadius: 16,
        //elevation: 24,
    },
  
    TextonTop: {
        height: 150,
        width: Dimensions.get('window').width - 20,
        alignItems: 'center',
        justifyContent:'center', 
        backgroundColor: 'rgba(0,0,0,0.40)',
		},
		
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.80)',
        textAlign:'right',    
    },
  });
  