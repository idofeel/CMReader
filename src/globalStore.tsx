

import { observable, action, toJS } from 'mobx';
import { Toast, Portal } from '@ant-design/react-native';


interface UserInfoProps {
    isLogin: false,
    dispname: string, // 昵称，姓名
    orgname: string,
    rolename: string, // 身份
    avatar: string, // 头像
    userid: string,
    deviceID: string, // 设备id
    serverID: string // 服务器id
}

class store {

    @observable userInfo: UserInfoProps = {
        isLogin: false,
        dispname: '', // 昵称，姓名
        orgname: '',
        rolename: '', // 身份
        avatar: '', // 头像
        userid: '',
        deviceID: '', // 设备id
        serverID: '', // 服务器id
    }

    @observable userInfoList: any[] = [] // 用户信息列表
    @observable userExtInfo: any[] = [] // 用户扩展信息
    @observable toast = 0

    @action loading = (time: number) => {
        if (this.toast) Portal.remove(this.toast);
        this.toast = Toast.loading('loading', time);
    }
    @action removeloading = () => {
        Portal.remove(this.toast);
    }

    @action saveUserInfo = (userInfo: UserInfoProps) => {
        this.userInfo = userInfo
    }

    @action saveUserInfoList = (userInfoList: any[]) => {
        this.userInfoList = userInfoList
    }

    @action saveListItem = (info: any) => {
        console.log(this.userInfoList);
        let list = toJS(this.userInfoList);
        list.map(item => {
            if (item[0] === info.type) item[2] = info.value
            return item
        })
        this.userInfoList = list
        console.log(list);
        // this.userInfoList = userInfoList
    }
    @action saveExtInfo = (info: any) => {
        let list = toJS(this.userExtInfo);
        list.map(item => {
            if (item[0] === info.cid) item[2] = info.v
            return item
        })
        this.userExtInfo = list
    }

    @action save = (userInfo: UserInfoProps, userInfoList: any[], userExtInfo: any[]) => {
        this.userInfo = userInfo
        this.userInfoList = userInfoList
        this.userExtInfo = userExtInfo
    }

    @action logout = () => {
        this.userInfo.isLogin = false
    }
}

export default new store()