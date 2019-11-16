import { observable, configure, action, computed } from 'mobx'
configure({ enforceActions: 'always' })


interface categorys {
    title: string;
    cateid: number | string;
    category: cateData[];
}

interface cateData {
    imageurl: string; // 封面
    contentid: string; // 文件id
    cleurl: string; // 文件地址
    title: string; // 文件名称
    size: string; // 文件大小
    exist: boolean; // 文件是否下载
    serverid: string;
    lesurl: string | null;
}

class Store {
    @observable categorys: categorys[] = []
    @observable initialPage: number = 0

    @action refresh = (categorys: categorys[], initialPage: number = this.initialPage) => {
        this.categorys = categorys
        this.initialPage = initialPage
    }
}

export default Store
