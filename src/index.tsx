import React from 'react';
import { View, Text, } from 'react-native';
import { createAppContainer, DrawerActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Test from './tset';
import Header from './components/Header';
import { Drawer, Button, WhiteSpace, Provider } from '@ant-design/react-native';
import HomePage from './pages/HomePage/HomePage';

interface State { }
interface Props {
    navigation: any
}

class HomeScreen extends React.Component<Props, State>{
    static navigationOptions = {
        title: '123123123'
    }
    state = {
        drawerOpen: false
    }
    render() {
        const { drawerOpen } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Drawer drawerBackgroundColor="#ccc" position="right" open={drawerOpen}>
                    <Button>123</Button>
                    <View style={{ flex: 1, marginTop: 114, padding: 8 }}>
                        <Button onPress={() => this.onpressHome()}>
                            Open drawer
                         </Button>
                    </View>
                    <Text onPress={() => this.onpressHome()} >Home Screen</Text>
                </Drawer>
            </View>
        );
    }
    onpressHome() {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    }
}

const HomeTab = {
    'Home': {
        screen: HomePage,
    },
}

const BottomTabNavigatorConfig = {
    initialRouteName: 'Home',
    labelPosition: 'below-icon',
    tabBarComponent: (props: Props) => {
        // 底部导航
        return null
    }
}

const Tab = createBottomTabNavigator(HomeTab, BottomTabNavigatorConfig)

const Page = {
    HomePage: {
        screen: Tab,
        navigationOptions: () => ({
            headerBackTitle: '返回首页',
            header: () => null, // 首页不展示tab
        })
    },
    Home: {
        screen: HomePage,
    },
    Test1: {
        screen: HomeScreen,

    }
}

const PageConfig = {
    initialRouteName: 'HomePage',
    headerShown: false,
    // defaultNavigationOptions: ({ navigation }) => NavigatorOptions(navigation),
}

// const NavigatorOptions = (navigation) => {

//     const header = (props) => <Header {...props} />;
//     return {

//         header,
//     };
// };



const AppNavigator = createStackNavigator(Page, PageConfig);


const AppContainer = createAppContainer(AppNavigator);

class App extends React.Component<Props, State>{
    navigator: any
    render() {
        return (
            <Provider>
                <AppContainer
                    ref={nav => {
                        this.navigator = nav;
                    }}
                    onNavigationStateChange={() => {
                    }}
                />
            </Provider>
        );
    }
    componentDidMount() {
        // console.log(this.navigator)
    }
}


export default App;