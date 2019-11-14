

import { observable, action } from 'mobx';
import { Toast, Portal } from '@ant-design/react-native';



class stroe {

    @observable userInfo = {
        avatar: '',
        userid: ''
    }

    @observable toast = 0

    @action toastloading = (time: number) => {
        if (this.toast) Portal.remove(this.toast);
        this.toast = Toast.loading('loading', time);
    }
    @action removeloading = () => {
        Portal.remove(this.toast);
    }
}

export default new stroe()