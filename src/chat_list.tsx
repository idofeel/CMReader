import * as React from 'react';
import { Component } from 'react';
import { SafeAreaView, ScrollView, Platform } from 'react-native';
import ChatItem from './chat_item';

interface State { }
interface Props {
  navigation?: any
  category: Item[]
}

interface Item {
  imageurl: string;
  contentid: string;
  cleurl: string;
  title: string;
  size: string;
  exist: boolean;
  serverid: string;
  lesurl: string | null;
}

const DATAS: Item[] = [];

class ChatList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { category } = this.props
    return (
      category.map((item, index) => {
        return <ChatItem item={item} key={index} navigation={this.props.navigation} />;
      })
    );
  }
}

export default ChatList;
