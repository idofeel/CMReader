import React, { Component } from 'react'
import ChatList from '../../chat_list';
import { SafeAreaView, View, ScrollView, Text, NativeModules } from 'react-native';
import { Tabs, ListView, Toast, ActivityIndicator } from '@ant-design/react-native';
import { get } from '../../utils/request';
import ChatItem from '../../chat_item';
import Empty from '../../components/empty';

const CMR = NativeModules.CMRRNModule;

interface Props {
    navigation?: any
}
interface State {
    categorys: categorys[];
    loadEnd: Boolean
}
interface category {
    cateid: string;     // 分类id
    catename: string;   // 分类名称
    item: cateData[];       // 分类下的数据
}

interface cateData {
    imageurl: string; // 封面
    contentid: string; // 文件id
    cleurl: string; // 文件地址
    title: string; // 文件名称
    size: string; // 文件大小
    exist: boolean; // 文件是否下载
}
interface categorys {
    title: string;
    cateid: number | string;
    category: cateData[],
}

export default class HomePage extends Component<Props, State> {
    state = {
        categorys: [],
        loadEnd: false,
        layout: 'list',
    }

    render() {
        const { categorys, loadEnd } = this.state
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 2 }}>
                    {/* {!loadEnd ? <ActivityIndicator text="正在加载" color="#000" /> : null} */}
                    {
                        categorys.length ?

                            <Tabs
                                tabs={categorys}
                                initialPage={0}
                                tabBarPosition="top"
                            >
                                {categorys.map((item, index) => {
                                    return <ListView
                                        key={index}
                                        onFetch={(page, startFetch, abortFetch) => this.onFetch(page, index, startFetch, abortFetch)}
                                        renderItem={this.renderItem.bind(this)}
                                        numColumns={1}
                                    />
                                })}
                            </Tabs> : <Empty onReload={this.reload.bind(this)} />
                    }
                </View>
            </SafeAreaView>

        )
    }


    componentDidMount() {
        this.getData();
    }
    reload() {
        this.getData();
        // Toast.loading('hhhhhhh...', 1, () => {
        //     console.log('Load complete !!!');
        // })
    }
    async getData() {
        try {
            const res = await get('http://fm.aijk.xyz/?act=publicres&f=json&serverid=yh');
            const categorys: categorys[] = res.map((item: category) => {
                return {
                    title: item.catename,
                    cateid: item.cateid,
                    category: item.item,
                }
            })
            this.setState({ categorys, loadEnd: true });
            await this.getCLEFileIsExist(categorys)
        } catch (error) {
            console.log(error)
        }

    }

    getCLEFileIsExist(categorys: categorys[]) {
        if (!CMR) return;
        try {
            CMR.IsExistCLEFile(JSON.stringify(categorys), (err: any, res: any) => {
                let cate: categorys[] = categorys.map(item => {
                    const { title, cateid, category } = item
                    return {
                        title,
                        cateid,
                        category: category.map(i => { i['exist'] = true; return i })
                    }
                })
                this.setState({
                    categorys: cate
                })
            });
        } catch (error) {

        }
    }

    renderItem(item: cateData, index: number) {
        return <ChatItem item={item} key={index} navigation={this.props.navigation} />
    }


    sleep = (time: number) =>
        new Promise(resolve => setTimeout(() => resolve(), time)); // 等待时间

    onFetch = async (
        page = 1,
        index = 0,
        startFetch: (arg0: cateData[], arg1: number) => void,
        abortFetch: () => void,
    ) => {
        try {
            let { category = [] } = this.state.categorys[index]
            let pageLimit: number = category.length; // 分页的数量
            const skip: number = (page - 1) * pageLimit; // 当前数量
            let rowData = category; // 需要渲染的数据
            if (skip >= category.length) {
                // 结束
                rowData = [];
            }
            await this.sleep(200)
            startFetch(rowData, pageLimit);
        } catch (err) {
            abortFetch();
        }
    }
}
