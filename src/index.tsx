import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer, DrawerActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { observer, Provider as MobxProvider, inject } from 'mobx-react';
import { Drawer, Button, WhiteSpace, Provider, Toast, Portal, Icon } from '@ant-design/react-native';
// page
import './@types';

import Test from './tset';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import store from './globalStore';
import LoginPage from './pages/Login/Login';
import MinePage from './pages/MinePage/MinePage';
import PrivatePage from './pages/Private/Private';
import ModifyPage from './pages/ModifyPage/ModifyPage';
import RegisterPage from './pages/Register/RegisterPage';
import { post } from './utils/request';
import api from './services/api';

interface State { }
interface Props {
    navigation: any;
}

class HomeScreen extends React.Component<Props, State> {
    static navigationOptions = {
        title: '123123123',
    };
    state = {
        drawerOpen: false,
    };
    render() {
        const { drawerOpen } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Drawer drawerBackgroundColor="#ccc" position="right" open={drawerOpen}>
                    <Button>123</Button>
                    <View style={{ flex: 1, marginTop: 114, padding: 8 }}>
                        <Button onPress={() => this.onpressHome()}>Open drawer</Button>
                    </View>
                    <Text onPress={() => this.onpressHome()}>Home Screen</Text>
                </Drawer>
            </View>
        );
    }
    onpressHome() {
        this.setState({
            drawerOpen: !this.state.drawerOpen,
        });
    }
}

const HomeTab = {
    Home: {
        screen: HomePage,
        navigationOptions: {
            title: '公共资源'
        }
    },
    Private: {
        screen: PrivatePage,
        navigationOptions: {
            title: '私有资源'
        }
    },
    Mine: {
        screen: MinePage,
        navigationOptions: {
            title: '我的'
        }
    },
};

const HomePageIcon = {
    Home: 'home',
    Private: 'database',
    Mine: 'user'
}

const BottomTabNavigatorConfig = {
    initialRouteName: 'Home',
    labelPosition: 'below-icon',
    tabBarComponent: (props: Props) => {
        // 底部导航
        return <Tabbar {...props} />;
    },
};

@inject('globalStore')
@observer
class Tabbar extends Component<any, any> {

    dealNavigation = () => {
        const { routes, index } = this.props.navigation.state;
        // 根据是否需要显示商品推荐菜单来决定state中的routes
        let finalRoutes = routes;

        if (!this.props.globalStore.userInfo.isLogin) {
            finalRoutes = routes.filter((route: any) => route.key !== 'Private');
        }
        const currentRoute = routes[index];
        return {
            ...this.props.navigation,
            state: {
                index: finalRoutes.findIndex((route: any) => currentRoute.key === route.key), //修正index
                routes: finalRoutes
            },

        };
    };
    render() {
        return <BottomTabBar {...this.props} navigation={this.dealNavigation()} renderIcon={this.renderIcon} />;
    }
    renderIcon = ({ route, focused, tintColor }: any) => {
        return <Icon name={(HomePageIcon as any)[route.key]} color={tintColor} />
    }

    async componentDidMount() {
        // 是否登录
        const res = await post(api.auth.islogin);
        if (res.success) {
            // 已登录     
            let userInfoList: any[] = [];
            let userExtInfo: any[] = [];

            try {
                const userinfoReq = [post(api.user.base), post(api.user.export)]
                const [getBaseInfo, getExportInfo] = await Promise.all(userinfoReq)

                if (getBaseInfo.success) userInfoList = getBaseInfo.data
                if (getExportInfo.success) userExtInfo = getExportInfo.data

            } catch (error) {

            }
            this.props.globalStore.save({ ...res.data, isLogin: true }, userInfoList, userExtInfo)
        }
    }

}

const HomeTabPage = createBottomTabNavigator(HomeTab, BottomTabNavigatorConfig);

const Page = {
    HomePage: {
        screen: HomeTabPage,
        navigationOptions: () => ({
            headerBackTitle: '返回',
            header: () => null, // 首页不展示tab
        }),
    },
    LoginPage: {
        screen: LoginPage,
    },
    ModifyPage: {
        screen: ModifyPage
    },
    RegisterPage: {
        screen: RegisterPage
    },
    Test1: {
        screen: HomeScreen,
    },
};

const PageConfig = {
    initialRouteName: 'HomePage',
    headerShown: false,
    // defaultNavigationOptions: ({ navigation }: any) => NavigatorOptions(navigation),
};

// const NavigatorOptions = (navigation) => {
//     console.log(navigation);

//     const header = (props) => <Header {...props} />;
//     return {
//         header,
//     };
// };

const AppNavigator = createStackNavigator(Page, PageConfig);

const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component<Props, State> {
    navigator: any;
    render() {
        return (
            <Provider>
                <MobxProvider globalStore={store}>
                    <AppContainer
                        ref={nav => {
                            this.navigator = nav;
                        }}
                        onNavigationStateChange={this.routerChange.bind(this)}
                    />
                </MobxProvider>
            </Provider>
        );
    }
    componentDidMount() {
        // store.loading(0);
    }
    routerChange() {
        // console.log(...arguments)
    }
}

export default App;
