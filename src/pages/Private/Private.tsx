import * as React from 'react';
import { View, FlatList } from 'react-native';
import { CMList } from '../HomePage/ListPage/ListPage'
import { SafeAreaView } from 'react-navigation';

export interface IPrivatePageProps {
}

export interface IPrivatePageState {
}

export default class PrivatePage extends React.Component<IPrivatePageProps, IPrivatePageState> {
    constructor(props: IPrivatePageProps) {
        super(props);

        this.state = {

        }
    }

    public render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <CMList
                    onPullUp={() => {
                        console.log('刷新');
                    }}
                    onRefresh={() => {
                        console.log('刷新');

                    }} />
            </SafeAreaView>
        );
    }

    componentDidMount() {
        console.log('加载私有资源');

    }
}
