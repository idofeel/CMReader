import * as React from 'react';
import { Text } from 'react-native';

export interface ISearchPageProps {
}

export default class SearchPage extends React.Component<ISearchPageProps> {
  public render() {
    return (
      <Text>
        搜索页
      </Text>
    );
  }
}
