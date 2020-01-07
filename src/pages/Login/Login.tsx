import * as React from 'react';
import { View, Text, Image, Dimensions, Keyboard, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { List, InputItem, Button, Icon, Toast } from '@ant-design/react-native';
import { deviceWidth, deviceHeight } from '../../utils/ratio';
import logo from './logo'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { post, get } from '../../utils/request';
import api from '../../services/api';
import { inject, observer } from 'mobx-react';
export interface ILoginProps {
}

export interface ILoginState {
    username: string
    password: string
    loginLoading: boolean
    allowLogin: boolean
}

@inject('globalStroe')
@observer
export default class Login extends React.Component<ILoginProps, ILoginState> {
    static navigationOptions = {
        header: null
    };
    constructor(props: ILoginProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loginLoading: false,
            allowLogin: false
        }
    }

    public render() {
        return (
            <SafeAreaView style={{ padding: 20, flex: 1, justifyContent: 'space-between' }} onTouchStart={() => Keyboard.dismiss()}>
                <View>
                    <View style={Styles.logoBox}>
                        <Image source={{ uri: logo }} style={Styles.logo} />
                    </View>

                    <InputItem
                        clear
                        value={this.state.username}
                        onChange={value => {
                            this.setState({
                                username: value,
                            });
                        }}
                        labelNumber={2}
                        placeholder="请输入账号"

                    >
                        <Icon name="user" />
                    </InputItem>
                    <InputItem
                        clear
                        type="password"
                        value={this.state.password}
                        onChange={value => {
                            this.setState({
                                password: value,
                            });
                        }}
                        labelNumber={2}
                        placeholder="请输入密码"
                    >

                        <Icon name="lock" />
                    </InputItem>
                    <Button type="primary" disabled={this.state.allowLogin} loading={this.state.loginLoading} style={{ marginTop: 30 }} onPress={this.onLogin}>登录</Button>
                </View>

                <Text style={{ textAlign: "center", flexDirection: 'row', alignContent: "center", marginBottom: 10, }}>
                    注册新用户
                    </Text>
            </SafeAreaView >
        );
    }

    onLogin = async () => {
        if (this.state.loginLoading) return
        this.setState({
            loginLoading: true
        })

        const { username, password } = this.state

        const res = await post(api.auth.login, { username, password })
        if (res.success) {
            this.props.globalStroe.saveUserInfo({ ...res.data, isLogin: true })
        } else {
            Toast.fail(res.faildesc || '登录失败')
        }

        this.setState({
            loginLoading: false
        })

        // await post(api.auth.islogin)
    }
}

const Styles = StyleSheet.create({
    logoBox: { justifyContent: 'center', flexDirection: 'row', marginTop: 100, marginBottom: 30 },
    logo: { width: 150, height: 150, flexDirection: 'row', alignContent: 'center' },
    inputItem: {
        backgroundColor: 'red'
    }
})