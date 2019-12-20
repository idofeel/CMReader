import * as React from 'react';
import { Tabs } from '@ant-design/react-native';
import { Text, View, FlatList } from 'react-native';
import ChatItem from '../../../chat_item';
import { toJS } from 'mobx';
import { inject } from 'mobx-react';

export interface IListPageProps extends CMListProps {
    categorys: categorys[]
    initialPage: number
    onChange?: (item: NewCategorys, index: number) => any
}

export interface IListPageState {
}

export default class ListPage extends React.Component<IListPageProps, IListPageState> {

    constructor(props: IListPageProps) {
        super(props);

        this.state = {
        }
    }

    tabRef: any
    public render() {
        const { categorys, initialPage, onChange = () => { } } = this.props;
        if (!categorys.length) return null;
        return (
            <Tabs
                tabs={categorys}
                initialPage={initialPage}
                tabBarPosition="top"
                ref={ref => this.tabRef = ref}
                onChange={(item: any, index: number) => onChange(item, index)}>
                {categorys.map((item: categorys, index: number) => <CMList key={index} category={item.category} {...this.props} />)}
            </Tabs>
        );

    }
}



interface CMListProps {
    category?: cateData[]
    onRefresh?: () => void
    onPullUp?: () => void
}

export class CMList extends React.Component<CMListProps, IListPageState> {

    render() {
        const { category = [], onRefresh = () => { }, onPullUp = () => { } } = this.props;
        return (
            <FlatList
                keyExtractor={(item, index) => index + ''}
                refreshing={false}
                onRefresh={() => onRefresh}
                data={category}
                renderItem={({ item, index }) => <ChatItem item={item} key={index} index={index} />}
                numColumns={1}
                onEndReachedThreshold={0.5}
                onEndReached={onPullUp}
                {...this.props}
                ListEmptyComponent={<Text>没有数据</Text>}
                ListFooterComponent={<Text style={{ textAlign: 'center', color: '#ccc', paddingVertical: 10 }}>已加载完全部</Text>}
            />
        );
    }
}
