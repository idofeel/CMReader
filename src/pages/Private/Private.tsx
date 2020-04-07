import * as React from 'react';
import { View, FlatList, Text } from 'react-native';
import { CMList } from '../HomePage/ListPage/ListPage'
import { SafeAreaView } from 'react-navigation';
import { get, joinUrlEncoded, joinUrl } from '../../utils/request';
import api from '../../services/api';
import CMItem from '../../components/CMItem.tsx/CMItem'
import Config from '../../utils/Config';
import NativeAPI from '../../API/NativeAPI';
import { Toast, Modal } from '@ant-design/react-native';
import { toJS } from 'mobx';

export interface IPrivatePageProps {
}

export interface IPrivatePageState {
}

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

export default class PrivatePage extends React.Component<IPrivatePageProps, IPrivatePageState> {
    constructor(props: IPrivatePageProps) {
        super(props);

        this.state = {
            data: []
        }
    }

    public render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    keyExtractor={(item, index) => index + ''}
                    refreshing={false}
                    onRefresh={() => this.onRefresh()}
                    data={this.state.data}
                    renderItem={({ item, index }) => <CMItem
                        item={item}
                        key={index}
                        index={index}
                        openCLE={this.download}
                        reDownload={this.reDownload}
                        delete={this.delete}

                    />}
                    numColumns={1}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.onPullUp}
                    {...this.props}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 100, color: '#ccc' }}>暂无数据</Text>}
                    ListFooterComponent={this.state.length ? <Text style={{ textAlign: 'center', color: '#ccc', paddingVertical: 10 }}>已加载完全部</Text> : null}
                />

            </SafeAreaView>
        );
    }
    // 下拉刷新
    onRefresh() {
        this.next = 0; // 下一页
        this.getData()
    }
    // 上拉加载
    onPullUp = async () => {
        this.getData()
    }

    // 点击下载时
    download = async (item: Item, index: number) => {
        const params = await this.getCompleteData(item);
        // 是否存在
        item.exist ? NativeAPI.OPEN_CLE_FILE(item) : this.downloadCle(params, index);
    }
    // 重新下载
    reDownload = (item: Item, index: number) => {
        const btns = [
            {
                text: '确认',
                onPress: async () => {
                    item = await this.getCompleteData(item);
                    this.downloadCle(item, index);
                },
                style: { color: 'red' }
            },
            { text: '取消' }

        ]
        Modal.alert('确认重新下载并打开！', null, btns);
    }
    // 删除
    delete = async (item: Item, index: number) => {
        try {
            const res = await NativeAPI.DELETE_CLE_FILE(item);
            let { data } = this.state;
            data[index].exist = false;
            this.setState({ data })
        } catch (error) {
            Toast.fail('删除文件失败！');
            // this.download(item, index);
        }
    }

    async downloadCle(item: Item, index: number) {
        try {
            const res = await NativeAPI.DOWN_CLE_FILE(item);
            if (res === 1) {
                let { data } = this.state;
                let newItem = JSON.parse(JSON.stringify(item));
                newItem.exist = true;
                data[index] = newItem
                this.setState({ data })
            } else {
                // Toast.loading('打开失败');
            }
        } catch (error) {
            Toast.loading(error);
        }
    }


    async getCompleteData(item: Item, isRefresh?: boolean) {
        console.log('getCompleteData', item);
        if (!isRefresh && item.lesurl && item.cleurl) return item;
        const data = item;
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

    next = 0; // 下一页
    loading = false; // 阻止多次进行加载
    async getData(next = this.next) {
        if (next < 0 || this.loading) return;
        this.loading = true; // 阻止多次进行加载
        const res = await get(api.source.private, { start: next });
        let { data } = this.state;
        const newData = this.formatCMData(res.data);
        data = next === 0 ? newData : data.concat(newData)
        this.setState({ data })
        this.next = res.next;
        this.loading = false;

    }

    formatCMData(data: Item[]) {
        return data.map((item: any) => {
            return {
                ...item,
                imageurl: item.img,
                contentid: item.pid,
                // cleurl: string;
                title: item.name,
                size: item.filesize,
                // exist: boolean;
                // serverid: string;
                // lesurl: string | null;
            };
        })
    }
    componentDidMount() {
        console.log('加载私有资源');
        this.getData()
    }
}
