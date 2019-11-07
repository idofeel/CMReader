import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar } from 'react-native';

// API({
//     url:'http://da.isayb.com/ishome/daily.php',
//     success:function(d){
//         console.log(d);
//     }
// });
export default class Header extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar />
                <View style={styles.bar}></View>
                <Text>头部</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bar: {
        height: 30,
        backgroundColor: '#fff',
    },
    container: {
        // width: deviceWidth,
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
});
