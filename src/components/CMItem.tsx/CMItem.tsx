import * as React from 'react';
import { Component } from 'react';
import { toJS } from 'mobx';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Icon, Toast, Modal, Portal } from '@ant-design/react-native';

interface Item {
    imageurl: string;
    contentid: string;
    cleurl: string;
    title: string;
    size: string;
    exist: boolean;
    serverid: string;
    lesurl: string | null;
}
interface State { }
interface Props {
    navigation?: any;
    homeStore?: any;
    item: Item;
    index: number;
    onPress?: (a: Item) => any;
    openCLE: (item: Item, index: number) => any,
    reDownload: (item: Item, index: number) => any,
    delete: (item: Item, index: number) => any
}

class CMItem extends Component<Props, State> {
    static defaultProps = {
        openCLE: () => { },
        reDownload: () => { },
        delete: () => { }
    }
    render() {
        const { item, onPress, index } = this.props;
        // console.log(item);

        return (
            <TouchableOpacity
                onPress={e => {
                    this.openCLE(item, index);
                }}>
                <View style={styles.container}>
                    <Image source={{ uri: item.imageurl }} style={styles.headerImg} />
                    <View style={styles.contentView}>
                        <Text style={styles.titleText}>{item.title}</Text>
                        <Text style={styles.timeText}>文件大小{item.size}</Text>
                    </View>
                    <View style={styles.icons}>
                        <View style={styles.download}>
                            <TouchableOpacity>
                                {item.exist ? (
                                    <Icon name="check-circle" color="green" />
                                ) : (
                                        <Icon name="download" color="#3d5fb4" onPress={(() => this.openCLE(item, index))} />
                                    )}
                            </TouchableOpacity>
                        </View>
                        {item.exist ? <View style={styles.reLoad}>
                            <TouchableOpacity onPress={() => {
                                this.delete(item, index);
                            }}>
                                <Icon name="delete" color="#ccc" style={styles.delete} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.reDownload(item, index);
                            }}>
                                <Icon name="redo" color="#3d5fb4" />
                            </TouchableOpacity>
                        </View> : null}
                    </View>

                </View>
                <View style={styles.spliteLine} />
            </TouchableOpacity>
        );
    }

    openCLE(item: Item, index: number) {
        this.props.openCLE(item, index)
    }

    reDownload(item: Item, index: number) {
        this.props.reDownload(item, index)

    }

    delete(item: Item, index: number) {
        this.props.delete(item, index)
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 15,
        flexDirection: 'row',
    },
    headerImg: {
        height: 100,
        width: 150,
    },
    titleText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        flex: 1,
    },
    contentView: {
        flex: 1,
        paddingLeft: 10,
    },
    topView: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 3,
    },
    timeText: {
        fontSize: 14,
        color: '#b2b2b2',
    },
    contentText: {
        paddingBottom: 3,
        color: '#b2b2b2',
        fontSize: 16,
    },
    spliteLine: {
        borderTopWidth: 0.5,
        borderTopColor: '#b2b2b2',
    },
    icons: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    reLoad: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    download: {
        marginLeft: 'auto'
    },
    delete: {
        marginRight: 10
    }
});

export default CMItem;
