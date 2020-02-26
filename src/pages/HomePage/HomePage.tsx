import React, { Component } from 'react';
import { View, NativeModules, Text, StyleSheet, Keyboard } from 'react-native';
import { Icon, Drawer, Button, Toast, Portal } from '@ant-design/react-native';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { get, joinUrlEncoded, joinUrl } from '../../utils/request';
import SearchBar from '../../components/SearchBar/SearchBar';
import { px, deviceWidth } from '../../utils/ratio';
import ChatItem from '../../chat_item';
import Menus from './Menus/Menus';
import ListPage, { CMList } from './ListPage/ListPage';
import api from '../../services/api';
import Config from '../../utils/Config';

const CMR = NativeModules.CMRRNModule;

interface Props {
    // navigation?: any;
    homeStore?: any;
    globalStore?: any;
}
interface State {
    menus: MenusData[];
    categorys: categorys[];
    initialPage: number;
    layout: string;
    refreshing: boolean;
}

@inject('globalStore')
@inject('homeStore')
@observer
export default class HomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const { categorys = [], initialPage = 0 } = props.homeStore;
        this.state = {
            categorys,
            initialPage,
            layout: 'list',
            refreshing: false,
            menus: [],
        };
    }
    pageIndex: number = -1; // android分类切换多次操作
    drawer: any;
    ListPageRef: any;
    render() {
        const {
            initialPage,
            categorys,
            actived,
            menus,
            cateData,
        } = this.props.homeStore;
        const { refreshing } = this.state;

        return (
            <Drawer
                drawerRef={(el: any) => (this.drawer = el)}
                drawerBackgroundColor="#00152a"
                position="left"
                open={false}
                sidebar={
                    <Menus
                        data={menus}
                        actived={actived}
                        changeMenus={this.changeMenus}
                    />
                }>
                <View
                    style={{
                        width: deviceWidth,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 40,
                    }}>
                    <Icon
                        name="menu"
                        color="#3d5fb4"
                        onPress={() => {
                            this.drawer && this.drawer.openDrawer();
                        }}
                        style={{ paddingLeft: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                        <SearchBar
                            onSearch={(val: any) => {
                                this.onSearch(val);
                            }}
                        />
                    </View>
                </View>
                {categorys.length ? (
                    <ListPage
                        ref={ref => (this.ListPageRef = ref)}
                        categorys={categorys}
                        onChange={(item: NewCategorys, index) => this.onChange(item, index)}
                        initialPage={initialPage}
                        onRefresh={this.onRefresh}
                        onPullUp={this.onPullUp}
                    />
                ) : (
                        <CMList
                            category={cateData.category}
                            onPullUp={this.onPullUp}
                            onRefresh={this.onRefresh}
                        />
                    )}
            </Drawer>
        );
    }

    changeMenus = (item: MenusData, index: number) => {
        let { saveMenus, menus } = this.props.homeStore;
        saveMenus(menus, index);
        this.getData(item, 0);
    };

    onpressHome() { }

    listFooter() {
        return (
            <Text style={{ textAlign: 'center', color: '#ccc', paddingVertical: 10 }}>
                已加载完全部
      </Text>
        );
    }

    async componentWillMount() {
        const resMenus = await get(api.main.menu); // 菜单
        let {
            initialPage,
            actived,
            saveMenus,
            refresh,
            saveCategory,
        } = this.props.homeStore;

        if (resMenus.success) {
            saveMenus(resMenus.data, actived);
            const initialData = resMenus.data[actived];
            this.getData(initialData, initialPage);
        }
        // this.props.globalStore.removeloading();
    }

    async onSearch(searchText: string) {
        let { saveCategory, cateData } = this.props.homeStore;
        let searching = Toast.loading('搜索中');
        Keyboard.dismiss();
        const searchRes = await this.getSearchData(searchText, 0);
        Portal.remove(searching);
        if (searchRes) {
            saveCategory(searchRes, searchText);
        }
    }

    async getSearchData(searchText: string, start: number) {
        const res = await get(api.source.search, { name: searchText, start });
        if (res.success) {
            return await this.formatCategory(res);
        } else {
            // 搜索失败
        }
    }

    async formatCategory(response: serverResCateData) {
        let category = response.data.map((item: any) => {
            return {
                ...item,
                imageurl: item.img,
                contentid: item.pid,
                // cleurl: string;
                title: item.name,
                size: item.filesize,
                // exist: boolean;
                // serverid: string;
                // lesurl: string | null;
            };
        });
        // 获取文件是否已下载
        category = await this.getCLEFileIsExist(category);
        return {
            category,
            start: response.next,
        };
    }
    async getData(item: MenusData, tabIndex: number) {
        let { refresh, saveCategory } = this.props.homeStore;

        let { id } = item;

        let categorys: NewCategorys[] = [];
        let category: cateData[] = [];
        if (item.sub.length) {
            // 有二级分类
            id = item.sub[tabIndex].id;
            categorys = item.sub.map((item: MenusData) => {
                return {
                    ...item,
                    title: item.name,
                    cateid: item.id,
                    category: [],
                    loadCategory: false,
                };
            });
            const start = 0;
            const cateData = await this.getCateData(id, start);

            categorys[tabIndex].category = cateData.category;
            categorys[tabIndex].start = cateData.start;
            refresh(categorys, tabIndex);
            this.pageIndex = tabIndex;
            this.ListPageRef &&
                this.ListPageRef.tabRef &&
                this.ListPageRef.tabRef.goToTab(tabIndex);
        } else {
            // 没有二级分类
            let cateData = await this.getCateData(id, 0);
            cateData.id = id;
            saveCategory(cateData);
        }
    }

    async getCateData(ids: string, start: number): Promise<any> {
        const cateData = await get(api.source.public, { ids, start });
        if (cateData.success) {
            return await this.formatCategory(cateData);
        }
    }

    onRefresh = async () => {
        // 下拉刷新
        let {
            initialPage,
            categorys,
            cateData,
            refresh,
            saveCategory,
            searchText,
        } = this.props.homeStore;
        if (categorys.length) {
            categorys = toJS(categorys);
            let CurrentCate = categorys[initialPage];
            const res = await this.getCateData(CurrentCate.id, 0);
            CurrentCate.start = res.start;
            categorys[initialPage].category = res.category;
            refresh(categorys);
        } else {
            let newCate = toJS(cateData);
            if (!searchText && !newCate.id) return
            const res = searchText
                ? await this.getSearchData(searchText, 0)
                : await this.getCateData(newCate.id, 0);
            if (res) {
                newCate.category = res.category;
                newCate.start = res.start;
                saveCategory(newCate, searchText);
            }
        }
    };

    onPullUp = async () => {
        // 上拉加载
        let {
            initialPage,
            categorys,
            cateData,
            refresh,
            saveCategory,
            searchText,
        } = this.props.homeStore;
        if (categorys.length) {
            categorys = toJS(categorys);
            let CurrentCate = categorys[initialPage];
            if (CurrentCate.start < 0) {
                return;
            } // 没有更多
            const res = await this.getCateData(CurrentCate.id, CurrentCate.start);
            CurrentCate.start = res.start;
            const newCate = CurrentCate.category.concat(res.category);
            categorys[initialPage].category = newCate;
            refresh(categorys);
        } else {
            // 没有二级分类
            let newCate = toJS(cateData);
            if (newCate.start < 0) {
                return;
            }

            const res = searchText
                ? await this.getSearchData(searchText, newCate.start)
                : await this.getCateData(newCate.id, newCate.start);
            if (res) {
                newCate.category = newCate.category.concat(res.category);
                newCate.start = res.start;
                saveCategory(newCate, searchText);
            }
        }
    };

    // 首页切换分类查找文件是否存在
    async onChange(item: NewCategorys, index: number) {
        console.log('onChange', toJS(item));
        if (this.pageIndex === index) {
            return;
        }
        this.pageIndex = index;
        // 是否加载分类
        if (!item.loadCategory) {
            const cateData = await this.getCateData(item.id, 0);
            const { categorys, refresh } = this.props.homeStore;
            let newcategorys = toJS(categorys);
            newcategorys[index].category = cateData.category;
            newcategorys[index].start = cateData.start;
            refresh(newcategorys, index);
        }
    }

    /**
     * @method getCLEFileIsExist 获取文件是否存在
     * @param cateData      需要获取的分类数据
     */
    async getCLEFileIsExist(cateData: cateData[]): Promise<cateData[]> {

        if (!CMR || cateData.length < 1) {
            return cateData;
        }

        let { deviceID, serverInfo = {} }: any = await Config.get()
        cateData = cateData.map(item => {
            return {
                ...item,
                serverid: serverInfo.serverid,
            }
        })

        try {
            return await new Promise((resolve, reject) => {
                CMR.IsExistCLEFile(cateData, (err: any, res: any) => {
                    err ? reject(err) : resolve(res);
                });
            });
        } catch (error) {
            return cateData;
        }
    }
}

const styles = StyleSheet.create({});
