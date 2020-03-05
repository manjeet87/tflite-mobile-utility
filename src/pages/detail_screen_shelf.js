import React, { Component } from "react";
import { FlatList, StyleSheet, View, Alert, Text, Image,Button, ImageBackground, Dimensions, 
	TouchableOpacity,
	TouchableHighlight,
	ScrollView,
	BackHandler } from "react-native";
import DrawerNavigator from 'react-navigation';
import Modal from 'react-native-modalbox';
import Slider from 'react-native-slider';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {CachedImage, ImageCacheProvider} from 'react-native-cached-image';

var screen = Dimensions.get('window');

export default class detail_screen_shelf extends React.Component {

		/*
		This class will be called when we click on small images and want to get the complete information of that image.
		*/
	
	constructor(props){
		super(props);
		this.backPressed = this.backPressed.bind(this)
		this.state = {
			errorm:'',
			isOpen: false,
			isDisabled: false,
			swipeToClose: true,
			sliderValue: 0.3,
			valid_data:false,
			result:'',
			loading:false,
			response_status:'',
			shelf:[],
			level:[],

			tableHead: ['Brand', 'SKU', 'Count', 'ShelfSpace'],
			tableData: [
				['1', '2', '3','4'],
				['a', 'b', 'c','4'],
				['1', '2', '3','4'],
				['a', 'b', 'c','4']
			]
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
	
	componentDidMount() {
		this.load_details();
	  }
	
	backPressed = () => {
		this.props.navigation.navigate('doc_shelf')
		//Alert.alert("Yes!!!");
		return true;
	   }

	onClose() {
	console.log('Modal just closed');
	}

	onOpen() {
	console.log('Modal just opened');
	}

	onClosingState(state) {
	console.log('the open/close of the swipeToClose just changed');
	}

	renderList() {
		var list = [];
	
		for (var i=0;i<50;i++) {
		  list.push(<Text style={{color: "black",fontSize: 22}} key={i}>Elem {i}</Text>);
		}
	
		return list;
	}

	load_details(){
		const { navigation } = this.props;
		const itemId = navigation.getParam('item')
		console.log("And Hereis!!");

		this.setState({error: '', loading: true});
		fetch(global.mainserver+'/get_shelf_details/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				"Authorization" : "Token e28cf8c22cba44e14f759a9efa0d7471f3ec73c2"
			//'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: JSON.stringify({
				'image_id': itemId.image_id,
				'from': 'mobile'
			})
		}).then((response) => {
			global.status = response['status'];
			console.log(global.status)
			console.log("Response total: ")
			if(global.status === 200){
				return response.json();
			}

		}).then((data) => { 
			// <!DOCTYPE ....
			console.log(data)
			console.log(typeof(data))
			if(global.status === 200){

				this.setState({loading:false})
				console.log("Printing Status!")
				if (data === '"unprocess"'){
					this.setState({result:'File is Unprocessed'})
					console.log("status: ",data)
				} 
				else if(data === '"None"'){
					this.setState({result: 'No Object found'})
					console.log("status: ",data)
				}
				

				else{
					let json_data = JSON.parse(data);
				    console.log(typeof(json_data))
					console.log(json_data.data);
					this.setState({result: 'found'})
					
					let tabledt = []
					let leveldt = []
					for (key in json_data.data){
						console.log(key,json_data.data[key])
						tabledt.push(json_data.data[key]);
						leveldt.push(key);
					}

					this.setState({valid_data:true, shelf:tabledt,level:leveldt});
					console.log("qwer.. ");
					console.log("qwer.. ",this.state.shelf)
				}
				
				//this.state.dataLocation = json_data.outlets_list['area']
				//this.setState({dataOutletName:json_data.outlets_list['outlets']})
				//this.setState({dataLocation:json_data.outlets_list['area']})
				//this.setState({brand_outletjson:json_data.outlets_list['brands']})
				
				
				
				
				// Alert.alert('Outlet list updated');
			}
			else{
				//console.log(json_data['loc_data']);
				this.setState({loading:false})
				Alert.alert('Server Connection Error. Service unavailable.')
			}
		}).catch((error) => {
			this.setState({loading:false})
			console.error(error);
			Alert.alert("Error."+error.message)
		});
		
	}

	
	renderTable(){
		console.log("Here!!")
		if (this.state.result !== 'found'){
			return(
				<View style={{width: screen.width, padding: 10}}>
				      <Text style={styles.text}>Status: {this.state.result}</Text>
				</View>
			)
		}
		let shelfdt = this.state.shelf.reverse();
		let len = this.state.shelf.length
		const state = this.state;

		console.log("Shelf Data: ",shelfdt)
		return shelfdt.map((shelfblock,key) => {
			table = []
			var i = 0
			rowdt = []
			global.level=len - key
		    for (var row in shelfblock){
				rowdt = []
				console.log("Block Dt: ",row, shelfblock[row])
				 rowdt.push(shelfblock[row]['brand'])
				 rowdt.push(shelfblock[row]['SKU'])
				 rowdt.push(shelfblock[row]['count'])
				 rowdt.push(shelfblock[row]['Space'])
				 console.log(rowdt)
				 table.push(rowdt)
			}

			return(
				<View style={{width: screen.width, padding: 10}}>
				    <View style={styles.popup_listbox} >
					     <Text style={styles.text}>Shelf {global.level}</Text>
					</View>
					<View style={styles.tablecontainer}>
						<Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
						<Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
						<Rows data={table} textStyle={styles.text}/>
						</Table>
					</View>
				</View>
			)
		});

	}

	
	render() {
		/* 2. Get the param, provide a fallback value if not available */
		// itemId is the constant which holds the parameter of current clicked image
		const { navigation } = this.props;
		const itemId = navigation.getParam('item')
		console.log("Its rendering!!");
		console.log(itemId);
		//const state = this.state;

		return (
			<View style={styles.container}>
				{/* <View style={styles.image_container}> */}
				<TouchableHighlight onPress={() => this.refs.modal6.open()}>
					<CachedImage style={{width: Dimensions.get('window').width, height: 500,alignSelf: 'stretch',}} 
					source={{uri: itemId.imageurl}} resizeMode='contain'/>
				</TouchableHighlight>

				<View style={styles.firstbox} >        
					<Text style= {styles.text1}> <Text style={{ fontWeight: 'bold' }}>Store Name:</Text> {itemId.store_name}</Text>
					<Text style= {styles.text1}> <Text style={{ fontWeight: 'bold' }}>Location:</Text> {itemId.area}, {itemId.city}</Text>
				</View>
				<View style={styles.secondbox}>
					<Text style= {styles.text1}> <Text style={{ fontWeight: 'bold' }}>Status:</Text> {itemId.status}</Text>
					{/* <Text style= {styles.text1_diff2}>Found:- {itemId.loi}</Text> */}
				</View>  
			
				<Modal
					style={[styles.modal, styles.modal1]}
					ref={"modal1"}
					swipeToClose={this.state.swipeToClose}
					onClosed={this.onClose}
					onOpened={this.onOpen}
					onClosingState={this.onClosingState}>
					<Text style={styles.text}>Basic modal</Text>
					<Button onPress={() => this.load_details(itemId)} 
							style={styles.btn} title = "Hello">
							</Button>
				</Modal>

				<Modal 
					style={[styles.modal, styles.modal4]} 
					position={"bottom"} ref={"modal6"} 
					swipeToClose={this.state.swipeToClose}
					swipeArea={30}
					onClosed={this.onClose}
					onOpened={this.onOpen}>
					<View style={styles.popup_firstbox} >
						<Text style={styles.text}>Processed Details</Text>
					</View>
					
					<ScrollView>
						{this.renderTable()}
					</ScrollView>
				</Modal>
						
				{/* </View> */}
			</View>
		);
	}
}


const styles = StyleSheet.create({
container : {
	backgroundColor : '#F5FCFF',
	flex : 1,
	alignItems: 'center',
	justifyContent: 'center',
	
	},
image_container:{
	margin: 0,
	width:Dimensions.get('window').width,
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "#F5FCFF",
		
},
modal: {
    justifyContent: 'center',
    alignItems: 'center'
},

modal4: {
	height: 300,
	borderRadius:5,
	backgroundColor:"#C5F0F6",
  },
//   Bottom Drawn Table Styling
  tablecontainer: { flex: 1, padding: 16, paddingTop: 30, borderRadius:25,backgroundColor: '#C5F0F6' },
  head: {  height: 33,  backgroundColor: '#f1f8ff'  },
  wrapper: { flexDirection: 'row', borderRadius:20 },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: {  height: 28  },
  text: { textAlign: 'center' },

btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

text1: {
	textAlign: 'left'
},
	

text1_diff2: {
	justifyContent: 'flex-end',
	alignItems: 'flex-end',
	color: '#000',
	fontSize: 15,
	fontWeight: '500'
},

firstbox: {
		marginTop:5,
		backgroundColor:"#87ceeb",
		marginBottom:0,
		width: 300, 
		borderRadius: 4,
		padding: 5
	},
secondbox: {
		backgroundColor:"#87ceeb",
		width: 300, 
		borderRadius: 4,
		padding: 5,
		marginTop:5
	},
popup_firstbox: {
	backgroundColor:"#4957E1",
	width: Dimensions.get('window').width, 
	justifyContent:'center',
	borderRadius: 4,
	padding: 5,
	// marginTop:5
},
popup_listbox: {
	backgroundColor:"#87ceeb",
	width: Dimensions.get('window').width, 
	justifyContent:'center',
	borderRadius: 4,
	padding: 5,
	
}
});