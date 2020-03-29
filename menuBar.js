import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
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
        switch (valueName) {
            case 'add':
                return this.setState({ add: true, seeAll: false, seeBest: false });
            case 'seeAll':
                return this.setState({ add: false, seeAll: true, seeBest: false });
            default:
                return this.setState({ add: false, seeAll: false, seeBest: true });
        };
    };

    render() {
        return (
            <View
                style={styles.row}>
                <FontAwesomeIcon
                    icon={faPlus}
                    size={50}
                    style={styles.icon}
                    onPress={() => this.flipValue('add')} />
                <FontAwesomeIcon
                    icon={faClipboard}
                    size={50}
                    style={styles.icon}
                    onPress={() => this.flipValue('seeAll')} />
                <FontAwesomeIcon
                    icon={faTrophy}
                    size={50}
                    style={styles.icon}
                    onPress={() => this.flipValue('seeBest')} />
            </View>
        )
    };
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingTop: 5,
        height: 100,
        backgroundColor: '#008080'
    },
    icon: {
        flex: 2,
        color: '#f8f8f8'
    }
});
export default MenuBar;