import React, { Component } from 'react';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrophy, faClipboard, faPlus } from '@fortawesome/free-solid-svg-icons'
class MenuBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            add: false,
            seeAll: true,
            seeBest: false
        };
    };

    flipValue(valueName) {
        this.props.select(valueName);
        if (valueName === 'add') {
            this.setState({ add: true })
            this.setState({ seeAll: false })
            this.setState({ seeBest: false })
        }
        if (valueName === 'seeAll') {
            this.setState({ add: false })
            this.setState({ seeAll: true })
            this.setState({ seeBest: false })
        }
        if (valueName === 'seeBest') {
            this.setState({ add: false })
            this.setState({ seeAll: false })
            this.setState({ seeBest: true })
        }
    }

    render() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingTop: 5,
                    height: 100,
                    backgroundColor: '#008080'
                }}>
                <FontAwesomeIcon
                    icon={faPlus}
                    size={50}
                    style={{ flex: 2, color: '#f8f8f8' }}
                    onPress={() => this.flipValue('add')} />
                <FontAwesomeIcon
                    icon={faClipboard}
                    size={50}
                    style={{ flex: 2, color: '#f8f8f8' }}
                    onPress={() => this.flipValue('seeAll')} />
                <FontAwesomeIcon
                    icon={faTrophy}
                    size={50}
                    style={{ flex: 2, color: '#f8f8f8' }}
                    onPress={() => this.flipValue('seeBest')} />
            </View>
        )
    }
}
export default MenuBar;