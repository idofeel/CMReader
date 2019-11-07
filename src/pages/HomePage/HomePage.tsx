import React, { Component } from 'react'
import ChatList from '../../chat_list';
import { SafeAreaView, View, ScrollView, Text } from 'react-native';
import { Tabs, ListView } from '@ant-design/react-native';
import { get } from '../../utils/request';
import ChatItem from '../../chat_item';

interface Props {
    navigation?: any
}
interface State {

}
interface category {
    cateid: string;
    catename: string;
    item: Item[];
}

interface Item {
    imageurl: string;
    contentid: string;
    cleurl: string;
    title: string;
    size: string;
}

export default class HomePage extends Component<Props, State> {
    state = {
        categorys: [],
        layout: 'list',
    }

    render() {
        const { categorys } = this.state
        if (!categorys.length) return null;
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 2 }}>
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
                    </Tabs>
                </View>
            </SafeAreaView>

        )
    }
    async componentWillMount() {
        const res = await get('http://fm.aijk.xyz/?act=publicres&f=json&serverid=yh');
        this.setState({
            categorys: res.map((item: category) => {
                return {
                    title: item.catename,
                    cateid: item.cateid,
                    category: item.item
                }
            })
        });

    }

    renderItem(item: Item, index: number) {
        return <ChatItem item={item} key={index} navigation={this.props.navigation} />
    }


    sleep = (time: any) =>
        new Promise(resolve => setTimeout(() => resolve(), time)); // 等待时间

    onFetch = async (
        page = 1,
        index = 0,
        startFetch: (arg0: [], arg1: number) => void,
        abortFetch: () => void,
    ) => {
        try {
            const { category = [] } = this.state.categorys[index]
            let pageLimit:number = category.length; // 分页的数量
            const skip = (page - 1) * pageLimit; // 当前数量
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
