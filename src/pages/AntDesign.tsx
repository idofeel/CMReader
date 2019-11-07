import React, { Component } from 'react'
import { View, SafeAreaView, Text } from 'react-native';
import { Button, SegmentedControl, WhiteSpace, ListView } from '@ant-design/react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AntListview from './demo/AntListview';
import Tab from '../pages/demo/tab';
import Icons from './demo/icons';
interface Props {
    navigation: any
}
interface State {

}

export default class AntDesign extends Component<Props, State> {
    state = {
    }
    render() {

        return (
            <SafeAreaView>
                <ScrollView>
                    <Button type="primary">primary</Button>
                    <Button type="warning">warning</Button>
                    <Button type="ghost">ghost</Button>

                    <SegmentedControl values={['Segment1', 'Segment2']} disabled />
                    <WhiteSpace size="lg" />
                    <Text>TintColor and Style</Text>
                    <SegmentedControl
                        values={['Segment1', 'Segment2', 'Segment3']}
                        tintColor={'#ff0000'}
                        style={{ height: 40, width: 280 }}
                    />
                    <WhiteSpace size="lg" />
                    <Text>SelectedIndex</Text>
                    <SegmentedControl
                        selectedIndex={1}
                        values={['Segment1', 'Segment2', 'Segment3']}
                    />
                    <WhiteSpace size="lg" />
                    <Text>onChange/onValueChange</Text>
                    <SegmentedControl
                        values={['Segment1', 'Segment2', 'Segment3']}
                        onChange={this.onChange}
                        onValueChange={this.onValueChange}
                    />
                    {this.contentPage()}
                </ScrollView>
            </SafeAreaView>
        )
    }

    contentPage() {
        const Components = [
            { name: 'listView前往列表', path: 'AntList' },
            { name: 'tabbar页', path: 'tabbar' },
            { name: '图标页', path: 'icons' }];

        return Components.map(item => <Button type="primary" onPress={() => this.go(item.path)}> {item.name}</Button >)

    }

    onValueChange() { }
    onChange() { }
    go(pageName: String) {
        this.props.navigation.navigate(pageName)
    }

}
