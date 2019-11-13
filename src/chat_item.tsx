import * as React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, Toast, Portal } from '@ant-design/react-native';
import NativeAPI from './API/NativeAPI';

interface Item {
	imageurl: string;
	contentid: string;
	cleurl: string;
	title: string;
	size: string;
	exist: boolean;
	serverid: string;
	lesurl: string | null;
}
interface State { }
interface Props {
	navigation?: any;
	item: Item;
	onPress?: (a: Item) => any;
	refresh: () => any;
}

class ChatItem extends Component<Props, State> {
	render() {
		const { item, onPress } = this.props;
		return (
			<TouchableOpacity
				onPress={e => {
					// alert('打开' + item.title);
					// this.props.navigation.navigate('Test1')
					this.openCLE(item);
				}}>
				<View style={styles.container}>
					<Image source={{ uri: item.imageurl }} style={styles.headerImg} />
					<View style={styles.contentView}>
						<Text style={styles.titleText}>{item.title}</Text>
						<Text style={styles.timeText}>文件大小{item.size}</Text>
						{/* <Text style={styles.contentText}>
							文件大小{item.size}
						</Text> */}
					</View>
					{item.exist ? (
						<Icon name="check-circle" color="green" />
					) : (
							<Icon name="download" color="#666" />
						)}
				</View>
				<View style={styles.spliteLine} />
			</TouchableOpacity>
		);
	}

	openCLE(item: Item) {
		item.exist ? this.openCLEFile(item) : this.download(item);
	}
	async openCLEFile(item: Item) {
		Toast.loading('打开中,请稍后...');
		try {
			const res = await NativeAPI.OPEN_CLE_FILE(item);
			if (res !== 0) Toast.loading('打开失败');
		} catch (error) {
			Toast.loading('重试尝试打开');
			this.download(item);
		}
	}

	async download(item: Item) {
		Toast.loading('下载打开中,请稍后...', 5);
		try {
			const res = await NativeAPI.DOWN_CLE_FILE(item);
			if (res === 1) {
				this.props.refresh();
			} else {
				Toast.loading('打开失败');
			}
		} catch (error) {
			Toast.loading(error);
		}
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
