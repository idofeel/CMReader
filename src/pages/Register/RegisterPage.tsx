import * as React from 'react';
import { SafeAreaView, FlatList } from 'react-navigation';
import { View, Image, ScrollView, Text } from 'react-native';
import { List, InputItem, Button, Icon, NoticeBar, Toast } from '@ant-design/react-native';
import logo from '../Login/logo'
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../services/api';
import { domain, joinUrlEncoded, post, get } from '../../utils/request';
import { user_name, pwd_reg } from '../../utils/Regexp';
import { inject, observer } from 'mobx-react';


export interface IRegisterPageProps {
    globalStroe: any
    navigation: any
}

export interface IRegisterPageState {
    imgCode: string
    errorMsg: string
    username: string
    password: string
    password2: string
    seccode: string
    submiting: boolean
}

@inject('globalStroe')
@observer
export default class RegisterPage extends React.Component<IRegisterPageProps, IRegisterPageState> {
    static navigationOptions = {
        title: '注册新用户',
    };
    constructor(props: IRegisterPageProps) {
        super(props);

        this.state = {
            imgCode: '',
            errorMsg: '',
            username: '',
            password: '',
            password2: '',
            seccode: '',
            submiting: false
        }

    }

    public render() {
        const { username, imgCode, errorMsg, password, password2, seccode, submiting } = this.state
        return (
            <View style={{ backgroundColor: "#eee", paddingTop: 20 }}>
                {/* <ScrollView > */}
                {!!errorMsg && <NoticeBar mode="closable" icon={<Icon name="warning" color="red" />}>
                    {errorMsg}
                </NoticeBar>}
                <List>
                    <InputItem
                        labelNumber={3}
                        placeholder="请输入用户名"
                        clear
                        value={username}
                        onChange={value => this.hasUserName(value)}>
                        账号
                    </InputItem>
                    <InputItem
                        value={password}
                        labelNumber={3} placeholder="请输入密码" clear type="password"
                        onChange={value => this.validatorPwd(value)}>
                        密码
                    </InputItem>
                    <InputItem
                        value={password2}
                        onChange={(value) => {
                            this.validatorRePwd(value)
                        }}
                        labelNumber={4} placeholder="请确认密码" clear type="password">确认密码</InputItem>
                    <InputItem
                        value={seccode}
                        clear
                        onChange={(value) => {
                            this.setState({ seccode: value })
                        }}
                        extra={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={{
                                    uri: imgCode
                                }} resizeMode="contain" style={{ width: 120, height: 44 }} />
                                <TouchableOpacity onPress={() => this.getImgCode()}>
                                    <Icon name="sync" style={{ paddingHorizontal: 5, color: '#108ee9' }} />
                                </TouchableOpacity>
                            </View>
                        } labelNumber={3} placeholder="请输入右侧验证码" >验证码</InputItem>
                </List>
                <Button type="primary" loading={submiting} style={{ marginTop: 40 }} onPress={() => {
                    this.onSubmit()
                }}>注册并登录</Button>
                {/* </ScrollView> */}
            </View >
        );
    }

    componentDidMount() {
        this.getImgCode()
    }

    async hasUserName(value: string) {
        this.setState({ username: value })
        let errMsg = ''
        if (value === '') {
            errMsg = '用户名不能为空'
        } else if (user_name.test(value)) {
            errMsg = '请输入2-32位字符，不能包含特殊字符'
        }

        if (!errMsg) {
            const res = await get(api.auth.isUname, { username: value })
            if (res.success) {
                errMsg = ''
            } else {
                errMsg = res.faildesc
            }
        }
        this.setState({
            errorMsg: errMsg,
            // username: value
        })
    }

    validatorPwd(value: string) {
        let errMsg = ''
        if (value === '') {
            errMsg = '密码不能为空'
        } else if (!pwd_reg.test(value)) {
            errMsg = '请输入2-32位字母或数字或特殊字符_-.'
        }
        this.setState({
            errorMsg: errMsg,
            password: value
        })
    }

    validatorRePwd(value: string) {
        let errMsg = ''
        if (this.state.password !== value) {
            errMsg = '两次密码输入不一致！'
        }
        this.setState({
            errorMsg: errMsg,
            password2: value
        })
    }


    async onSubmit() {
        this.setState({
            submiting: true
        })
        const { username, password2, password, seccode } = this.state

        const res = await post(api.auth.register, { username, password2, password, seccode })
        if (res.success) {
            // 刷新信息
            this.props.globalStroe.saveUserInfo({ ...res.data, isLogin: true })
            // 返回首页
            this.props.navigation.navigate('HomePage')
        } else {
            Toast.info(res.faildesc)
        }
        this.setState({
            submiting: false
        })
    }

    getImgCode() {
        this.setState({
            imgCode: joinUrlEncoded(domain + api.auth.imgcode, { rand: Math.random() })
        })
    }

    componentWillUnmount() {
        this.setState = () => { return };
    }
}
