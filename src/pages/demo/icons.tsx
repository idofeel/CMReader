import React, { Component } from 'react'
import { SafeAreaView, ScrollView } from 'react-native';
import { Grid, Icon } from '@ant-design/react-native';
import {
    outlineGlyphMap,
    OutlineGlyphMapType,
} from '@ant-design/icons-react-native/lib/outline';


interface Props {

}
interface State {

}

export default class Icons extends Component<Props, State> {
    state = {}

    render() {
        const outlineData = Object.keys(outlineGlyphMap).map(
            (item: OutlineGlyphMapType) => ({
                icon: <Icon name={item} />,
                text: item,
            }),
        );
        return (
            <SafeAreaView>
                <ScrollView>
                    <Grid data={outlineData} columnNum={3} hasLine={false} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}
