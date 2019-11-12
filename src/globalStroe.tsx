

import { observable} from 'mobx';



class stroe {

    @observable userInfo = {
        avatar: '',
        userid:''
    }
}

export default new stroe()