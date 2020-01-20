import React, { Component } from 'react';
import { View } from 'react-native';
import { Row } from 'react-native-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendarDay, faStopwatch, faRoad, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: 'date',
            tableHead:
                [<View style={{ justiftyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faMapMarkedAlt} style={{ color: 'white' }} size={40}
                    onPress={() => this.sortBy('name')} />
                </View>,
                <View style={{ justiftyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faRoad} style={{ color: 'white' }} size={44} 
                    onPress={() => this.sortBy('distance')}/>
                </View>,
                <View style={{ justiftyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faCalendarDay} style={{ color: 'white' }} size={36} 
                    onPress={() => this.sortBy('date')}/>
                </View>,
                <View style={{ justiftyContent: "center", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faStopwatch} style={{ color: 'white' }} size={36} 
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
                style={{ height: 40, backgroundColor: 'black' }} />
        )
    }
}
export default Header;