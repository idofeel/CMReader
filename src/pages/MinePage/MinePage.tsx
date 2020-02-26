import * as React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Text, View, Image, StyleSheet } from 'react-native';
import { Button, List, Icon, Toast, Portal } from '@ant-design/react-native';
import { deviceWidth, deviceHeight } from '../../utils/ratio';
import Login from '../Login/Login';
import globalStore from '../../globalStore';
import { inject, observer } from 'mobx-react';
import logo from '../Login/logo';
import { toJS } from 'mobx';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import request, { post, get, domain, joinUrlEncoded } from '../../utils/request';
import api from '../../services/api';
import ImagePicker from 'react-native-image-crop-picker';
export interface IMineProps {
}

export interface IMineState {
}

const Item = List.Item;

@inject('globalStore')
@observer
export default class Mine extends React.Component<IMineProps, IMineState> {

    constructor(props: IMineProps) {
        super(props);

        this.state = {
            logo,
        }
    }

    public render() {
        const { userInfo, userInfoList, userExtInfo } = this.props.globalStore;
        console.log(userInfoList);
        if (!userInfo.isLogin) return <Login {...this.props} />
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
                <ScrollView >
                    <List style={{ paddingBottom: 50 }} >
                        {this.renderUserInfo(userInfoList)}
                        {this.renderUserInfo(userExtInfo)}
                        {/* <Item disabled extra={<Image source={{ uri: this.state.logo }} style={Styles.avatar} />} onPress={() => {
                        ImagePicker.openPicker({
                            width: 300,
                            height: 400,
                            cropping: true,
                            cropperChooseText: '选择',
                            cropperCancelText: '取消'
                        }).then(async image => {
                            Toast.loading('上传中')
                            console.log(image);
                            let file = { uri: image.path, type: 'multipart/form-data', name: 'image.png' };
                            let formData = new FormData();
                            formData.append('file', file);
                            const res = await request.uploadImage(domain + api.modify.UpAvatar, formData)

                            console.log(res);

                            if (res.success) {
                                Toast.success('上传成功')
                                this.setState({
                                    logo: image.path
                                })
                            } else {
                                Toast.fail('上传失败')
                            }

                        });
                        console.log(ImagePicker);

                    }}>
                        头像
                    </Item>
                    <TouchableOpacity onPress={() => this.goModifyPage('昵称修改', 'nikename')}>
                        <Item disabled extra={userInfo.dispname} arrow="horizontal" >
                            昵称
                        </Item>
                    </TouchableOpacity>

                    <Item disabled extra={userInfo.dispname} arrow="horizontal" onPress={() => { }}>
                        账户名
                    </Item>
                    <Item disabled extra={userInfo.realname || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改姓名', 'realname')}>
                        真实姓名
                    </Item>
                    <Item disabled extra={userInfo.rolename || '未填写'} onPress={() => { }}>
                        身份
                    </Item>
                    <Item disabled extra={userInfo.phone || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改电话', 'mobile')}>
                        电话
                    </Item>
                    <Item disabled extra={userInfo.qq || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改QQ', 'qq')}>
                        QQ
                    </Item>
                    <Item disabled extra={userInfo.email || '未填写'} arrow="horizontal" onPress={() => this.goModifyPage('修改邮箱', 'email')}>
                        邮箱
                    </Item> */}

                    </List>
                </ScrollView>
                <Button type="warning" onPress={() => this.logout()}>退出登录</Button>
            </SafeAreaView>
        );
    }

    renderUserInfo(list: any[]) {
        return list.map(item => {
            const notModify = item[0] === 'uid' || item[0] === 'username'
            const isavatar = item[0] === 'avatar'
            if (item[0] === 'uid') return null;
            if (isavatar) return this.renderAvatarItem(item)
            return <Item
                key={item[0]}
                disabled={notModify}
                extra={item[2] || ''}
                arrow={notModify ? '' : 'horizontal'}
                onPress={() => !notModify && this.goModifyPage(item)}>
                {item[1]}
            </Item>
        })
    }
    renderAvatarItem(item: any) {

        return <Item
            key={item[0]}
            disabled extra={<Image source={{ uri: domain + '/' + item[2] }} style={Styles.avatar} />}
            onPress={() => {
                ImagePicker.openPicker({
                    width: 100,
                    height: 100,
                    cropping: true,
                    // includeBase64: true,
                    cropperChooseText: '选择',
                    cropperCancelText: '取消'
                }).then(this.uploadImg);
            }}>
            {item[1]}
        </Item>
    }

    uploadImg = async (image: any) => {

        let upAvatarLoading = Toast.loading('上传中', 0)
        let file: any = { uri: image.path, type: 'multipart/form-data', name: 'image.png' };
        let formData = new FormData();

        formData.append('file', file);

        const res = await request.uploadImage(domain + api.modify.UpAvatar, formData)
        console.log('res', res);

        if (res.success) {
            console.log('globalStore', res.data);
            this.props.globalStore.saveListItem({ type: 'avatar', value: joinUrlEncoded(res.data, { rand: Math.random() }) })
            Toast.success('上传成功')


        } else {
            Toast.fail('上传失败')
        }

        Portal.remove(upAvatarLoading)

    }
    goModifyPage(item: any) {
        this.props.navigation.navigate('ModifyPage', {
            title: '修改' + item[1],
            data: item
        })
    }

    async logout() {
        const res = await post(api.auth.logout);
        if (res.success) {
            this.props.globalStore.logout();
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
