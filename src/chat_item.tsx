import * as React from 'react';
import { Component } from 'react';
import { toJS } from 'mobx';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Icon, Toast, Modal } from '@ant-design/react-native';
import NativeAPI from './API/NativeAPI';
import { inject } from 'mobx-react';

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
	homeStroe?: any;
	item: Item;
	index: number;
	onPress?: (a: Item) => any;
}

@inject('homeStroe')
class ChatItem extends Component<Props, State> {
	render() {
		const { item, onPress, index } = this.props;
		return (
			<TouchableOpacity
				onPress={e => {
					// alert('打开' + item.title);
					// this.props.navigation.navigate('Test1')
					this.openCLE(item, index);
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
					<View style={styles.icons}>
						<View style={styles.download}>
							<TouchableOpacity>
								{item.exist ? (
									<Icon name="check-circle" color="green" />
								) : (
										<Icon name="download" color="#3d5fb4" onPress={(() => this.openCLE(item, index))} />
									)}
							</TouchableOpacity>
						</View>
						<View style={styles.reLoad}>
							<TouchableOpacity onPress={() => {
								this.delete(item, index);
							}}>
								<Icon name="delete" color="#7e7e7e" style={styles.delete} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {
								this.reDownload(item, index);
							}}>
								<Icon name="redo" color="#3d5fb4" />
							</TouchableOpacity>
						</View>
					</View>

				</View>
				<View style={styles.spliteLine} />
			</TouchableOpacity>
		);
	}

	async openCLE(item: Item, index: number) {
		const params = toJS(item);
		item.exist ? this.openCLEFile(params, index) : this.download(params, index);
	}

	reDownload(item: Item, index: number) {
		const btns = [
			{
				text: '确认',
				onPress: async () => {
					this.reDownLoadCle(item, index);
				},
				style: { color: 'red' }
			},
			{ text: '取消' }

		]
		Modal.alert('确认重新下载并打开！', null, btns);
	}

	delete(item: Item, index: number) {
		const btns = [
			{
				text: '确认',
				onPress: async () => {
					this.deleteCle(item, index);
				},
				style: { color: 'red' }
			},
			{ text: '取消' }

		]
		Modal.alert('确认删除文件！', null, btns);
	}


	async reDownLoadCle(item: Item, index: number) {
		try {
			await this.deleteCle(item, index);
			this.download(item, index);
		} catch (error) {
			Toast.loading(error);
		}
	}

	async deleteCle(item: Item, index: number) {
		try {
			this.refreshData(index, false);
			const res = await NativeAPI.DELETE_CLE_FILE(item);
			if (res === 1) {
				this.refreshData(index, false);
			}
			this.refreshData(index, false);
		} catch (error) {
			// Toast.loading(error);
			// this.download(item, index);
		}
	}

	async openCLEFile(item: Item, index: number) {
		// Toast.loading('打开中,请稍后...');
		try {
			await NativeAPI.OPEN_CLE_FILE(item);

		} catch (error) {
			Toast.loading(error);
			this.download(item, index);
		}
	}

	async download(item: Item, index: number) {
		// const downloading = Toast.loading('下载打开中,请稍后...', 5);
		try {
			const res = await NativeAPI.DOWN_CLE_FILE(item);
			if (res === 1) {
				this.refreshData(index, true);
			} else {
				// Toast.loading('打开失败');
			}
		} catch (error) {
			Toast.loading(error);
		}
	}

	refreshData(index: number, isExist: boolean = false) {
		const { initialPage, categorys } = this.props.homeStroe;
		// Portal.remove(downloading);
		let newCategorys = toJS(categorys)
		newCategorys[initialPage].category[index]['exist'] = isExist;
		this.props.homeStroe.refresh(newCategorys);
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
	icons: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	reLoad: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	download: {
		marginLeft: 'auto'
	},
	delete: {
		marginRight: 10
	}
});

export default ChatItem;
