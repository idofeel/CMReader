import * as React from 'react';
import {
    View,
    NativeModules,
    FlatList,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import { px } from '../../utils/ratio';
import { Icon, WhiteSpace } from '@ant-design/react-native';

export interface ISearchBarProps {
    onSearch: (val?: string) => void,

}

export interface ISearchBarState {
    searchText: boolean
    value: string
}

export default class SearchBar extends React.Component<ISearchBarProps, ISearchBarState> {
    static defaultProps = {
        onSearch: () => { }
    }
    constructor(props: ISearchBarProps) {
        super(props);

        this.state = {
            searchText: false,
            value: ''
        }
    }

    public render() {
        const { onSearch = () => { } } = this.props
        return (
            <View style={styles.SearchBarContainer}>
                <TextInput style={styles.SearchBar}
                    value={this.state.value}
                    onChangeText={(a) => { this.setState({ value: a }) }}
                    onFocus={() => this.showSearchText(true)}
                    onBlur={() => this.showSearchText(false)}
                />
                <Icon name="search" style={styles.icon} />
                {this.state.searchText && <Text style={styles.searchText} onPress={() => onSearch(this.state.value)}>搜索</Text>}
            </View>
        );
    }

    showSearchText = (bl: boolean) => {
        this.setState({
            searchText: bl
        })
    }
}


const styles = StyleSheet.create({
    SearchBarContainer: {
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 5,
        flex: 1,
    },
    SearchBar: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        paddingLeft: 30,
        marginHorizontal: 5,
        borderRadius: 8,
        flex: 1,
        position: 'relative',
    },
    icon: {
        position: "absolute",
        left: 15,
        marginLeft: 'auto',
    },
    searchText: {
        color: '#3d5fb4',
        paddingHorizontal: 5,
        fontSize: 14

    }
});

