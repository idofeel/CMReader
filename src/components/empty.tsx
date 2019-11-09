import React, { Component } from 'react'
import { Button } from '@ant-design/react-native';

interface Props {
    onReload?: Function;
}
interface State {

}

class Empty extends Component<Props, State> {
    static defaultProps = {
        children: '重新加载'
    }
    state = {}

    render() {
        const { onReload = () => { }, children } = this.props;
        return (
            <Button type="primary" onPress={() => onReload()}>{children}</Button>
        )
    }
}

export default Empty