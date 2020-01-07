

import { observable, action } from 'mobx';
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

class stroe {

    @observable userInfo: UserInfoProps = {
        isLogin: false,
        dispname: '', // 昵称，姓名
        orgname: '',
        rolename: '', // 身份
        avatar: '', // 头像
        userid: '',
        deviceID: '', // 设备id
        serverID: '' // 服务器id
    }

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

    @action logout = () => {
        this.userInfo.isLogin = false
    }
}

export default new stroe()