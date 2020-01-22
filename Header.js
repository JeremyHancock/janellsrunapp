import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Row } from 'react-native-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendarDay, faStopwatch, faRoad, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: 'date',
            tableHead:
                [<View style={styles.center}>
                    <FontAwesomeIcon icon={faMapMarkedAlt} style={styles.white} size={40}
                    onPress={() => this.sortBy('name')} />
                </View>,
                <View style={styles.center}>
                    <FontAwesomeIcon icon={faRoad} style={styles.white} size={44} 
                    onPress={() => this.sortBy('distance')}/>
                </View>,
                <View style={styles.center}>
                    <FontAwesomeIcon icon={faCalendarDay} style={styles.white} size={36} 
                    onPress={() => this.sortBy('date')}/>
                </View>,
                <View style={styles.center}>
                    <FontAwesomeIcon icon={faStopwatch} style={styles.white} size={36} 
                    onPress={() => this.sortBy('time')}/>
                </View>
                ]
        };
    };

    sortBy(value) {
        this.props.select(value);
    }
    
    render() {
        const state = this.state;
        return (
            <Row data={state.tableHead}
                flexArr={[2, 0.5, 1, 1]}
                style={styles.row} />
        )
    }
}
const styles = StyleSheet.create({
    center: { justifyContent: "center", alignItems: "center" },
    white: { color: 'white' },
    row: { height: 40, backgroundColor: 'black' }
  });
export default Header;