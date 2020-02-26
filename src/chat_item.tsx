import * as React from 'react';
import { Component } from 'react';
import { toJS } from 'mobx';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Icon, Toast, Modal, Portal } from '@ant-design/react-native';
import NativeAPI from './API/NativeAPI';
import { inject } from 'mobx-react';
import Config from './utils/Config';
import { get, joinUrl, joinUrlEncoded } from './utils/request';
import api from './services/api';

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
	homeStore?: any;
	item: Item;
	index: number;
	onPress?: (a: Item) => any;
}

@inject('homeStore')
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
						{item.exist ? <View style={styles.reLoad}>
							<TouchableOpacity onPress={() => {
								this.delete(item, index);
							}}>
								<Icon name="delete" color="#ccc" style={styles.delete} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {
								this.reDownload(item, index);
							}}>
								<Icon name="redo" color="#3d5fb4" />
							</TouchableOpacity>
						</View> : null}
					</View>

				</View>
				<View style={styles.spliteLine} />
			</TouchableOpacity>
		);
	}

	async openCLE(item: Item, index: number) {
		const params = await this.getCompleteData(item);
		item.exist ? this.openCLEFile(params, index) : this.download(params, index);
	}

	reDownload(item: Item, index: number) {
		const btns = [
			{
				text: '确认',
				onPress: async () => {
					item = await this.getCompleteData(item);
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
					this.deleteCle(toJS(item), index);
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
			await this.download(item, index);
		} catch (error) {
			Toast.loading(error);
		}
	}

	async deleteCle(item: Item, index: number) {
		try {
			const res = await NativeAPI.DELETE_CLE_FILE(item);
			this.refreshData(item, index, false);
		} catch (error) {
			Toast.fail('删除文件失败！');
			// this.download(item, index);
		}
	}

	async openCLEFile(item: Item, index: number) {
		// Toast.loading('打开中,请稍后...');
		try {
			await NativeAPI.OPEN_CLE_FILE(toJS(item));

		} catch (error) {
			Toast.loading(error);
			this.download(item, index);
		}
	}

	async download(item: Item, index: number) {
		try {
			const res = await NativeAPI.DOWN_CLE_FILE(item);
			if (res === 1) {
				this.refreshData(item, index, true);
			} else {
				// Toast.loading('打开失败');
			}
		} catch (error) {
			Toast.loading(error);
		}
	}

	async refreshData(item: cateData, index: number, isExist: boolean = false) {
		item = JSON.parse(JSON.stringify(item))
		const { initialPage, categorys, refresh, cateData, saveCategory, searchText } = this.props.homeStore;
		let newCategorys = toJS(categorys)
		let loading = Toast.loading('处理中')
		item.exist = isExist
		if (categorys.length) {
			newCategorys[initialPage].category[index] = item;
			refresh(newCategorys)
		} else {
			const newcategory = toJS(cateData)
			newcategory.category[index] = item;
			saveCategory(newcategory, searchText);
		}
		Portal.remove(loading);
	}

	async getCompleteData(item: Item) {

		const data = toJS(item);
		const reqList = [
			get(api.fileInfo.cle, { pid: data.contentid }), // 获取cle文件信息
			Config.get()
		]
		const [cleData, config] = await Promise.all(reqList)
		const { cle, md5, filesize } = cleData.data || {}
		const { deviceID, serverInfo = {} } = config
		if (cleData.success && deviceID && serverInfo.serverid) {
			data.cleurl = cle
			const lesUrl = joinUrlEncoded(api.fileInfo.les, { pid: data.contentid, devid: deviceID })
			data.lesurl = joinUrl(lesUrl)
		}
		console.log('%c 获取数据：', 'color:red;', data);

		return data
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
