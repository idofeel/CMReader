import React, { Component } from 'react';
import {
    SafeAreaView,
    NativeModules,
    StatusBar
} from 'react-native';
import { inject, observer, Provider } from 'mobx-react';

import Store from './store';
import HomePage from './HomePage';
import Config from '../../utils/Config';


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

@inject('globalStore')
@observer
export default class IndexPage extends Component<Props, State> {
    store = new Store
    render() {
        return (
            <Provider homeStore={this.store}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <SafeAreaView
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <HomePage />
                </SafeAreaView>
            </Provider >
        );
    }
    componentDidMount() {
        // 获取需要的配置信息
        Config.init()
    }
}
