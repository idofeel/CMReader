import React, { Component } from 'react';
import {
    View,
    NativeModules,
    FlatList,
    Text,
} from 'react-native';
import { Tabs, Toast } from '@ant-design/react-native';
import { get } from '../../utils/request';
import ChatItem from '../../chat_item';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

const CMR = NativeModules.CMRRNModule;

interface Props {
    // navigation?: any;
    homeStroe?: any
    globalStroe?: any;
}
interface State {
    categorys: categorys[];
    initialPage: number;
    layout: string
    refreshing: boolean;
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

@inject('globalStroe')
@inject('homeStroe')
@observer
export default class HomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const { categorys = [], initialPage = 0 } = props.homeStroe;
        this.state = {
            categorys,
            initialPage,
            layout: 'list',
            refreshing: false,
        }
    }
    pageIndex: number = -1; // android分类切换多次操作
    render() {
        const { initialPage, categorys } = this.props.homeStroe
        const { refreshing } = this.state;
        if (!categorys.length) return null;
        return (
            <View style={{ flex: 2 }}>
                <Tabs
                    tabs={categorys}
                    initialPage={initialPage}
                    tabBarPosition="top"
                    onChange={(item: any, index) => this.onChange(item, index)}>
                    {categorys.map((item: categorys, index: number) => {
                        return (
                            <FlatList
                                keyExtractor={(item, index) => index + ''}
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                data={item.category}
                                key={index}
                                renderItem={({ item, index }) => this.renderItem(item, index)}
                                numColumns={1}
                                ListFooterComponent={this.listFooter}
                            />
                        );
                    })}
                </Tabs>
            </View>
        );
    }

    listFooter() {
        return <Text style={{ textAlign: 'center', color: '#ccc', paddingVertical: 10 }}>已加载完全部</Text>
    }

    async componentDidMount() {
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
        this.initGetCLEFileIsExist(categorys);
        this.props.globalStroe.removeloading();
    }
    // 初次渲染文件是否存在
    async initGetCLEFileIsExist(categorys: categorys[]) {
        const { initialPage } = this.props.homeStroe;
        const { category } = categorys[initialPage] || {};
        if (category && category.length > 0) {
            this.setCurrentCateData(initialPage, category, categorys);
        }
    }

    onRefresh() {
        return true
    }



    // 首页切换分类查找文件是否存在
    async onChange(item: categorys, index: number) {
        if (this.pageIndex === index) return;
        this.pageIndex = index;
        const { categorys, initialPage } = this.props.homeStroe;

        this.setCurrentCateData(index, item.category, categorys);
    }

    async setCurrentCateData(
        pageNum: number,
        cateData: cateData[],
        categorys: categorys[],
    ) {
        cateData = toJS(cateData);
        categorys = toJS(categorys);
        try {
            const newCate = await this.getCLEFileIsExist(cateData);
            if (newCate) categorys[pageNum].category = newCate;
        } catch (error) {
            // t
        }
        // if (!categorys.length) return
        this.props.homeStroe.refresh(categorys, pageNum)
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
            <ChatItem item={item} key={index} index={index} />
        );
    }

    sleep = (time: number) =>
        new Promise(resolve => setTimeout(() => resolve(), time)); // 等待时间


}
