import * as React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Text, View, TextInput } from 'react-native';
import { InputItem, Button, Toast } from '@ant-design/react-native';
import { get } from '../../utils/request';
import api from '../../services/api';
import { inject, observer } from 'mobx-react';

export interface IModifyPageProps {
    navigation?: any
}

export interface IModifyPageState {
    value: string
    saveing: boolean
}
@inject('globalStore')
@observer
export default class ModifyPage extends React.Component<IModifyPageProps, IModifyPageState> {
    static navigationOptions = ({ navigation }: any) => ({
        title: navigation.state.params.title || '信息修改',
    });
    data: any // 0 id, 1 key ,2 value
    constructor(props: IModifyPageProps) {
        super(props);
        this.data = this.props.navigation.getParam('data', false)

        this.state = {
            value: this.data[2] || '',
            saveing: false,
        }
    }

    public render() {
        return (
            <View style={{
                flex: 1, backgroundColor: '#f2f2f2'
            }}>
                <TextInput
                    value={this.state.value}
                    onChangeText={(value: string) => { this.setState({ value }) }}
                    style={{
                        backgroundColor: '#fff', color: '#000', margin: 0, height: 42, fontSize: 16, paddingHorizontal: 15, marginVertical: 20
                    }
                    } />
                <Button type="primary" loading={this.state.saveing} style={{ marginHorizontal: 20, marginTop: 20 }} onPress={() => {
                    this.saveModify()
                }}>保存</Button>
            </View >
        );
    }
    componentDidMount() {

    }

    saveModify() {
        const type = this.data[0]
        if (this.checkHasChange()) return Toast.info(this.data[1] + '和当前一致，无需修改')
        if (!type) Toast.fail('错误的操作')
        const { value } = this.state;
        if (value === '') Toast.fail(this.data[1] + '不能为空')

        this.setState({
            saveing: true,
        })
        if (type === 'nickname') {
            this.modifyNikeName()
        } else if (type === 'realname') {
            this.modifyRealName()
        } else {
            this.modifyExtInfo()
        }

    }


    checkModify(result: any) {

        if (result.success) {
            Toast.success('修改成功')
            const type = this.data[0]

            this.props.globalStore.saveListItem({ type, value: result.data })
            this.props.navigation.goBack()
        } else {
            Toast.fail(result.faildesc || '修改失败')
        }
        this.setState({
            saveing: false,
        })
    }

    async modifyExtInfo() {
        const type = this.data[0]
        const info = {
            cid: type,
            v: this.state.value
        }

        const res = await get(api.modify.extprofile, info)

        if (res.success) {
            Toast.success('修改成功')
            this.props.globalStore.saveExtInfo(info)
            this.props.navigation.goBack()
        } else {
            Toast.fail(res.faildesc || '修改失败')

        }
        this.setState({
            saveing: false,
        })
    }

    async modifyNikeName() {
        const res = await get(api.modify.nikeName, { nick: this.state.value });
        this.checkModify(res)
    }

    async modifyRealName() {
        const res = await get(api.modify.realName, { realname: this.state.value })
        this.checkModify(res)

    }

    checkHasChange() {
        return this.data[2] === this.state.value
    }

    async modifyMobile() {

    }
    async modifyQQ() {

    }

    async modifyEmail() {

    }


}
