import * as React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, NativeModules, DeviceEventEmitter } from 'react-native';
import { Icon } from '@ant-design/react-native';
const CMR = NativeModules.CMRRNModule;

interface Item {
	imageurl: string;
	contentid: string;
	cleurl: string;
	title: string;
	size: string;
}
interface State { }
interface Props {
	navigation?: any,
	item: Item;
}

class ChatItem extends Component<Props, State> {
	listener = null
	componentDidMount() {
		console.log(NativeModules)
		try {
			this.listener = CMR.IsExistCLEFile('asdasdsa', (err:any, res:any) => {
				console.log(res)
			});
		} catch (error) {
			
		}
		
	}
	render() {
		const { item } = this.props;
		return (
			<TouchableOpacity
				onPress={(e) => {
					// alert('打开' + item.title);
					// this.props.navigation.navigate('Test1')
					console.log(this.props)


				}}>
				<View style={styles.container}>
					<Image
						source={{ uri: item.imageurl }}
						style={styles.headerImg}
					/>
					<View style={styles.contentView}>
						<Text style={styles.titleText}>{item.title}</Text>
						<Text style={styles.timeText}>
							文件大小{item.size}
						</Text>
						{/* <Text style={styles.contentText}>
							文件大小{item.size}
						</Text> */}
					</View>
					<Icon name="download" color="#666" />
					<Icon name="check-circle" color="green" />
				</View>
				<View style={styles.spliteLine} />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		padding: 15,
		flexDirection: 'row',
	},
	headerImg: {
		height: 100,
		width: 150,
	},
	titleText: {
		fontSize: 16,
		color: 'black',
		fontWeight: 'bold',
		flex: 1,
	},
	contentView: {
		flex: 1,
		paddingLeft: 10,
	},
	topView: {
		flex: 1,
		flexDirection: 'row',
		paddingTop: 3,
	},
	timeText: {
		fontSize: 14,
		color: '#b2b2b2',
	},
	contentText: {
		paddingBottom: 3,
		color: '#b2b2b2',
		fontSize: 16,
	},
	spliteLine: {
		borderTopWidth: 0.5,
		borderTopColor: '#b2b2b2',
	},
});

export default ChatItem;
