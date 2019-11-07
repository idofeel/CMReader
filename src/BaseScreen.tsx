import * as React from 'react';
import { BackHandler } from 'react-native';
import {
	NavigationParams,
	NavigationScreenOption,
	NavigationScreenOptions,
	NavigationScreenProps,
	NavigationStackScreenOptions,
} from 'react-navigation';

export default class BaseScreen extends React.Component<
	NavigationScreenProps,
	any,
> {
	static navigationOptions: NavigationScreenOptions = { header: null };

	constructor(props) {
		super(props);
		this._backPress = this._backPress.bind(this);
	}

	_backPress(): boolean {
		this.props.navigation.goBack();
		return true;
	}

	_forward(routeName: string, params?: NavigationParams) {
		this.props.navigation.navigate(routeName, params);
	}

	_goBack() {
		this.props.navigation.goBack();
	}

	componentDidMount(): void {
		BackHandler.addEventListener('hardwareBackPress', this._backPress);
	}

	componentWillUnmount(): void {
		BackHandler.removeEventListener('hardwareBackPress', this._backPress);
	}
}
