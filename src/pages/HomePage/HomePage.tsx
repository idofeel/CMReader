import React, { Component } from 'react';
import ChatList from '../../chat_list';
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    NativeModules,
} from 'react-native';
import { Tabs, ListView } from '@ant-design/react-native';
import { get } from '../../utils/request';
import ChatItem from '../../chat_item';
const CMR = NativeModules.CMRRNModule;

interface Props {
    navigation?: any;
}
interface State {
    categorys: categorys[];
    initialPage: number;
}
interface category {
    cateid: string; // 分类id
    catename: string; // 分类名称
    item: cateData[]; // 分类下的数据

}

interface cateData {
    imageurl: string; // 封面
    contentid: string; // 文件id
    cleurl: string; // 文件地址
    title: string; // 文件名称
    size: string; // 文件大小
    exist: boolean; // 文件是否下载
    serverid: string;
    lesurl: string | null;
}
interface categorys {
    title: string;
    cateid: number | string;
    category: cateData[];
}

export default class HomePage extends Component<Props, State> {
    state = {
        categorys: [],
        initialPage: 0,
        layout: 'list',
    };

    render() {
        const { categorys, initialPage } = this.state;
        if (!categorys.length) return null;
        return (
            <SafeAreaView
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 2 }}>
                    <Tabs
                        tabs={categorys}
                        initialPage={initialPage}
                        tabBarPosition="top"
                        onChange={(item: any, index) => this.onChange(item, index)}>
                        {categorys.map((item, index) => {
                            return (
                                <ListView
                                    key={index}
                                    onFetch={(page, startFetch, abortFetch) =>
                                        this.onFetch(page, index, startFetch, abortFetch)
                                    }
                                    renderItem={this.renderItem.bind(this)}
                                    numColumns={1}
                                />
                            );
                        })}
                    </Tabs>
                </View>
            </SafeAreaView>
        );
    }
    async componentWillMount() {
        const res = await get(
            'http://fm.aijk.xyz/?act=publicres&f=json&serverid=yh',
        );
        const categorys: categorys[] = res.map((item: category) => {
            return {
                title: item.catename,
                cateid: item.cateid,
                category: item.item,
            };
        });
        // this.setState({
        //     categorys
        // })
        this.initGetCLEFileIsExist(categorys);
    }

    // 初次渲染文件是否存在
    async initGetCLEFileIsExist(categorys: categorys[]) {
        const { initialPage } = this.state;
        const { category } = categorys[initialPage] || {};
        if (category && category.length > 0) {
            this.setCurrentCateData(initialPage, category, categorys);
        }
    }

    // 首页切换分类查找文件是否存在
    async onChange(item: categorys, index: number) {
        console.log(item)
        // this.setCurrentCateData(index, item.category, this.state.categorys);
    }

    async setCurrentCateData(
        pageNum: number,
        cateData: cateData[],
        categorys: categorys[] = this.state.categorys,
    ) {
        const newCate = await this.getCLEFileIsExist(cateData);
        if (newCate) categorys[pageNum].category = newCate;
        this.setState({ categorys, initialPage: pageNum });
    }

    /**
     * @method getCLEFileIsExist 获取文件是否存在
     * @param cateData      需要获取的分类数据
     */
    async getCLEFileIsExist(
        cateData: cateData[],
    ): Promise<cateData[]> {
        if (!CMR || cateData.length < 1) return cateData;
        try {
            return await new Promise((resolve, reject) => {
                CMR.IsExistCLEFile(cateData, (err: any, res: any) => {
                    err ? reject(err) : resolve(res);
                });
            });
        } catch (error) {
            return cateData;
        }
    }

    renderItem(item: cateData, index: number) {
        return (
            <ChatItem item={item} key={index} navigation={this.props.navigation} />
        );
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
            let { category = [] } = this.state.categorys[index];
            let pageLimit: number = category.length; // 分页的数量
            const skip: number = (page - 1) * pageLimit; // 当前数量
            let rowData = category; // 需要渲染的数据
            if (skip >= category.length) {
                // 结束
                rowData = [];
            }
            let newCateData = await this.getCLEFileIsExist(rowData) || rowData;
            newCateData = newCateData.map(item => {
                return {
                    serverid: 'fm',
                    ...item,
                    lesurl: null
                }
            })
            startFetch(newCateData, pageLimit);
        } catch (err) {
            abortFetch();
        }
    };
}
