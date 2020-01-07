import * as React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Text, View, TextInput } from 'react-native';
import { InputItem, Button } from '@ant-design/react-native';

export interface IModifyPageProps {
}

export interface IModifyPageState {
}

export default class ModifyPage extends React.Component<IModifyPageProps, IModifyPageState> {
    static navigationOptions = ({ navigation }: any) => ({
        title: navigation.state.params.title || '信息修改',
    });
    constructor(props: IModifyPageProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        return (
            <View style={{
                flex: 1, backgroundColor: '#f2f2f2'
            }}>
                < TextInput style={{
                    backgroundColor: '#fff', margin: 0, height: 42, fontSize: 16, paddingHorizontal: 15, marginVertical: 20
                }
                } />
                <Button type="primary" style={{ marginHorizontal: 20, marginTop: 20 }} onPress={() => {
                    this.saveModify()
                }}>保存</Button>
            </View >
        );
    }
    componentDidMount() {

    }

    saveModify() {

    }
}
