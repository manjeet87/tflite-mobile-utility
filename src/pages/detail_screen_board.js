import React, { Component } from "react";
import { FlatList, StyleSheet, View, Text, Image,Button, ImageBackground, Dimensions, 
	TouchableOpacity,
	TouchableHighlight,
	ScrollView,
	BackHandler } from "react-native";
import DrawerNavigator from 'react-navigation';
import Modal from 'react-native-modalbox';
import Slider from 'react-native-slider';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


var screen = Dimensions.get('window');

export default class detail_screen_board extends React.Component {

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

			tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
			tableTitle: ['Title', 'Title2', 'Title3', 'Title4'],
			tableData: [
				['1', '2', '3'],
				['a', 'b', 'c'],
				['1', '2', '3'],
				['a', 'b', 'c']
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
	
	backPressed = () => {
		this.props.navigation.navigate('doc_board')
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



	
	render() {
		/* 2. Get the param, provide a fallback value if not available */
		// itemId is the constant which holds the parameter of current clicked image
		const { navigation } = this.props;
		const itemId = navigation.getParam('item')
		console.log(itemId);
		const state = this.state;

		return (
			<View style={styles.image_container}>
			    <TouchableHighlight onPress={() => this.refs.modal6.open()}>
					<Image style={{width: Dimensions.get('window').width, height: 450}} 
					source={{uri: itemId.imageurl}} resizeMode='contain'/>
				</TouchableHighlight>

				<View style={styles.firstbox} >        
					<Text style= {styles.text1_diff}>OutletName:- {itemId.outlet_name}</Text>
					<Text style= {styles.text1}>Location:- {itemId.region}</Text>
				</View>
		        <View style={styles.secondbox}>
					<Text style= {styles.text1_diff2}>Status:- {itemId.status}</Text>
					<Text style= {styles.text1_diff2}>Found:- {itemId.loi}</Text>
		        </View>  
			
			    <Modal
					style={[styles.modal, styles.modal1]}
					ref={"modal1"}
					swipeToClose={this.state.swipeToClose}
					onClosed={this.onClose}
					onOpened={this.onOpen}
					onClosingState={this.onClosingState}>
					<Text style={styles.text}>Basic modal</Text>
					<Button onPress={() => this.setState({swipeToClose: !this.state.swipeToClose})} 
					        style={styles.btn} title = "Hello">
							</Button>
			    </Modal>

				<Modal 
				    style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal6"} swipeArea={20}>
					<ScrollView>
						<View style={{width: screen.width, padding: 10}}>
						<Text style={styles.text}>Processed Details</Text>
						   <View style={styles.tablecontainer}>
								<Table>
								<Row data={state.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
								<TableWrapper style={styles.wrapper}>
									<Col data={state.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
									<Rows data={state.tableData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/>
								</TableWrapper>
								</Table>
							</View>
						   <Text style={styles.text}>Basic modal</Text>
						</View>
					</ScrollView>
       			 </Modal>
					
			</View>
		);
	}
}


const styles = StyleSheet.create({
image_container:{
	margin: 1,
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "#F5FCFF",
		
},
modal: {
    justifyContent: 'center',
    alignItems: 'center'
},
modal: {
    justifyContent: 'center',
    alignItems: 'center'
},
modal4: {
	height: 300,
	borderRadius:25,
	backgroundColor:"#C5F0F6",
  },
//   Bottom Drawn Table Styling
  tablecontainer: { flex: 1, padding: 16, paddingTop: 30, borderRadius:25,backgroundColor: '#C5F0F6' },
  head: {  height: 40,  backgroundColor: '#f1f8ff'  },
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

text1_diff: {
	color: '#000',
	fontSize: 15,
	fontWeight: '600'
},
	
text1: {
	color: '#000',
	fontSize: 15,
	fontWeight: '600'
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
		backgroundColor:"#ff6347",
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
	}
});