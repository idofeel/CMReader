import * as React from 'react';
import {
    View,
    NativeModules,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { inject } from 'mobx-react';

export interface IMenusProps {
    data: MenusData[];
    actived: number;
    changeMenus?: (item: MenusData, index: number) => void;
}

export interface IMenusState { }

export default class Menus extends React.Component<IMenusProps, IMenusState> {
    constructor(props: IMenusProps) {
        super(props);
    }

    render() {
        const { data, actived } = this.props;
        if (!data.length) {
            return null;
        }
        return (
            <FlatList
                ListHeaderComponent={
                    <View style={styles.menusHeader}>
                        <Text style={styles.headerText}>选择分类</Text>
                    </View>
                }
                data={this.props.data}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[
                            styles.menusItem,
                            index === actived ? styles.activedItem : null,
                        ]}
                        onPress={() => this.onChange(item, index)}>
                        <Text style={styles.menusText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                style={styles.menusBox}
            />
        );
    }
    onChange(item: MenusData, index: number) {
        this.props.changeMenus && this.props.changeMenus(item, index);
    }
}

const styles = StyleSheet.create({
    menusHeader: {
        height: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    headerText: {
        fontWeight: '800',
        fontSize: 16,
        paddingHorizontal: 10,
    },
    menusBox: {
        display: 'flex',
    },
    menusItem: {
        height: 40,
        paddingHorizontal: 10,
        justifyContent: 'center',
        fontSize: 16,
    },
    activedItem: {
        backgroundColor: '#1890ff',
    },
    menusText: {
        color: '#fff',
    },
});
