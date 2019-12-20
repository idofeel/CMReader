import { observable, configure, action, computed } from 'mobx'
import { get } from '../../../utils/request'
import api from '../../../services/api'
configure({ enforceActions: 'always' })

interface categorys {
    title: string;
    cateid: number | string;
    category: cateData[];
}

interface category {
    id: string;
    start: number;
    category: cateData[];
}

class Store {
    @observable menus: MenusData[] = [] // 菜单数据
    @observable actived: number = 0// 菜单初始化选中
    @observable categorys: categorys[] = [] // 二级分类
    @observable initialPage: number = 0 // 二级选中
    @observable searchText: string = '' // 二级选中
    @observable cateData: category = {
        id: '',
        start: 0,
        category: []
    } // 单页的分类数据
    @observable hasTab: boolean[] = [] // 单页的分类数据

    @action refresh = (categorys: categorys[], initialPage: number = this.initialPage) => {
        this.categorys = categorys
        this.initialPage = initialPage
    }
    @action saveMenus = (menus: MenusData[], actived: number = this.actived) => {
        this.menus = menus
        this.actived = actived
        this.searchText = ''
    }
    @action saveCategory = (cateData: category, searchText: string = '') => {
        this.cateData = cateData
        this.categorys = []
        this.searchText = searchText
        if (searchText) {
            this.actived = -1 // 主菜单不选中
        }
    }


}

export default Store
