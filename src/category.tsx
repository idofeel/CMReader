import React, { Component } from 'react';

import {
	SafeAreaView,
	FlatList,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native';

interface State { }
interface Props {
	tabs: tab[];
}

interface tab {
	id: string;
	name: string;
	onPress?: any;
}

class Category extends Component<Props, State> {

	render() {
		return <FlatList></FlatList>;
	}
}

export default Category;
