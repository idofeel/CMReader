import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer, DrawerActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { observer, Provider as MobxProvider, inject } from 'mobx-react';
import { Drawer, Button, WhiteSpace, Provider, Toast, Portal } from '@ant-design/react-native';
// page
import './@types';

import Test from './tset';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import stroe from './globalStroe';
import LoginPage from './pages/Login/Login';
import MinePage from './pages/MinePage/MinePage';
import PrivatePage from './pages/Private/Private';
import ModifyPage from './pages/ModifyPage/ModifyPage';
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

const BottomTabNavigatorConfig = {
    initialRouteName: 'Home',
    labelPosition: 'below-icon',
    tabBarComponent: (props: Props) => {
        // 底部导航
        return <Tabbar {...props} />;
    },
};

@inject('globalStroe')
@observer
class Tabbar extends Component<any, any> {

    dealNavigation = () => {
        const { routes, index } = this.props.navigation.state;
        // 根据是否需要显示商品推荐菜单来决定state中的routes
        let finalRoutes = routes;

        if (!this.props.globalStroe.userInfo.isLogin) {
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
        return <BottomTabBar {...this.props} navigation={this.dealNavigation()} />;
    }

    async componentDidMount() {
        const res = await post(api.auth.islogin);
        if (res.success) {
            this.props.globalStroe.saveUserInfo({ ...res.data, isLogin: true })
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
    Login: {
        screen: LoginPage,
    },
    ModifyPage: {
        screen: ModifyPage
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
                <MobxProvider globalStroe={stroe}>
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
        // stroe.loading(0);
    }
    routerChange() {
        // console.log(...arguments)
    }
}

export default App;
