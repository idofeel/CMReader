import * as React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Text, View, Image, StyleSheet } from 'react-native';
import { Button, List, Icon, Toast } from '@ant-design/react-native';
import { deviceWidth, deviceHeight } from '../../utils/ratio';
import Login from '../Login/Login';
import globalStroe from '../../globalStroe';
import { inject, observer } from 'mobx-react';
import logo from '../Login/logo';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { post } from '../../utils/request';
import api from '../../services/api';
export interface IMineProps {
}

export interface IMineState {
}

const Item = List.Item;

@inject('globalStroe')
@observer
export default class Mine extends React.Component<IMineProps, IMineState> {

    constructor(props: IMineProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        console.log(this.props);
        const { userInfo } = this.props.globalStroe;
        if (!userInfo.isLogin) return <Login />
        return (
            <SafeAreaView style={{ padding: 20, flex: 1, justifyContent: 'space-between' }}>
                <List style={{ paddingBottom: 50 }} >
                    <Item disabled extra={<Image source={{ uri: logo }} style={Styles.avatar} />} onPress={() => { }}>
                        头像
                    </Item>
                    <TouchableOpacity onPress={() => this.goModifyPage('昵称修改')}>
                        <Item disabled extra={userInfo.dispname} arrow="horizontal" >
                            昵称
                        </Item>
                    </TouchableOpacity>

                    <Item disabled extra={userInfo.dispname} arrow="horizontal" onPress={() => { }}>
                        账户名
                    </Item>
                    <Item disabled extra={userInfo.realname || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改姓名')}>
                        真实姓名
                    </Item>
                    <Item disabled extra={userInfo.rolename || '未填写'} onPress={() => { }}>
                        身份
                    </Item>
                    <Item disabled extra={userInfo.phone || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改电话')}>
                        电话
                    </Item>
                    <Item disabled extra={userInfo.qq || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改QQ')}>
                        QQ
                    </Item>
                    <Item disabled extra={userInfo.email || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改邮箱')}>
                        邮箱
                    </Item>

                </List>
                <Button type="warning" onPress={() => this.logout()}>退出登录</Button>
            </SafeAreaView>
        );
    }

    goModifyPage(title: string) {
        this.props.navigation.navigate('ModifyPage', {
            title
        })
    }

    async logout() {
        const res = await post(api.auth.logout);
        if (res.success) {
            this.props.globalStroe.logout();
            Toast.success('已退出登录！');
        } else {
            Toast.success(res.faildesc);
        }
    }

}

const Styles = StyleSheet.create({
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        padding: 10
    }
})
