import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Alert, AsyncStorage, Text } from 'react-native';
import { Table, Rows } from 'react-native-table-component';
import { SwipeRow, SwipeListView } from 'react-native-swipe-list-view';

import API from './API';
import Header from './Header';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            runs: [],
            sortBy: 'date',
            apiNotCalled: true,
        };
        api = API;
        races = [];
        trainingRuns = [];
        namesSorted = false;
        distancesSorted = false;
        datesSorted = true;
        timesSorted = false;
    };

    async componentDidMount() {
        this.mounted = true;
        if (this.props.listChangeCounter > 0) {
            this.props.counterReset(0);
            this.callApi();
        } else {
            this.getStoredData();
        };
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    getStoredData() {
        AsyncStorage.getItem("races").then((value) => {
            if (value.length > 2) {
                this.setState({ runs: JSON.parse(value) });
                this.formatRaceData(JSON.parse(value));
            } else {
                this.setState({ loading: false })
                Alert.alert(
                    'No races found',
                    'Go ahead and add one!',
                    [
                        { text: 'Add a race!', onPress: () => this.addRace() },
                        { text: 'Cancel', style: 'cancel' }
                    ],
                    { cancelable: false })
            }
        })
    };

    callApi() {
        if (this.state.apiNotCalled) {
            this.setState({ apiNotCalled: false })
            api.getRuns(this.props.user)
                .then(function (races) {
                    if (races.length !== 0) {
                        this.setState({ runs: races });
                        stringifiedRaces = JSON.stringify(races);
                        AsyncStorage.setItem('races', stringifiedRaces);
                        this.formatRaceData(races);
                    } else {
                        this.setState({ loading: false })
                        Alert.alert(
                            'No races found',
                            'Go ahead and add one!',
                            [
                                { text: 'Add a race!', onPress: () => this.addRace() },
                                { text: 'Cancel', style: 'cancel' }
                            ],
                            { cancelable: false })
                    }
                }.bind(this))
                .catch(function (err) {
                    console.log(err);
                })
        }
    };

    addRace = () => {
        this.props.select('add');
    };

    formatRaceData(runs) {
        races = [];
        if (runs.length) {
            runs.map((race, i) => {
                if (race.raceName !== 'Training') {
                    races.push(
                        [
                            race.raceName,
                            race.runDistance,
                            this.getFormattedDate(new Date(race.runDate)),
                            this.convertRunDuration(race.runDurationInSeconds)
                        ]);
                } else {
                    trainingRuns.push(
                        [
                            race.raceName,
                            race.runDistance,
                            this.getFormattedDate(new Date(race.runDate)),
                            this.convertRunDuration(race.runDurationInSeconds)
                        ]);
                }
                if (races.length + trainingRuns.length === this.state.runs.length) {
                    this.sortByDate();
                    this.setState({ loading: false, runs: runs });
                }
            });
        }
    };

    showRaces() {
        if (!this.state.loading) {
            return <View style={{ paddingBottom: 50 }}>
                <Rows
                    data={this.props.training ? trainingRuns : races}
                    flexArr={[2, 0.5, 1, 1]}
                    textStyle={{ textAlign: 'center' }}
                    style={{ height: 50 }}
                />
            </View>
        } else {
            return <View style={{ flex: 1, padding: 50 }}><ActivityIndicator size="large" /></View>
        }
    };

    convertRunDuration(time) {
        dateObj = new Date(time * 1000);
        hours = dateObj.getUTCHours();
        minutes = dateObj.getUTCMinutes();
        seconds = dateObj.getSeconds();
        return timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
    };

    getFormattedDate(date) {
        let year = date.getFullYear().toString().slice(2);
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return month + '/' + day + '/' + year;
    };

    headerSelectCallback = (response) => {
        this.setState({ sortBy: response.toString() });
        switch (response) {
            case 'name':
                return this.sortByName();
            case 'distance':
                return this.sortByDistance();
            case 'date':
                return this.sortByDate();
            default:
                return this.sortByTime();
        }
    };

    NameComparator(a, b) {
        if (a[0] > b[0]) return -1;
        if (a[0] < b[0]) return 1;
        return 0;
    };

    DistanceComparator(a, b) {
        { return a[1] - b[1]; }
    };

    DateComparator(x, y) {
        var a = new Date(x[2]),
            b = new Date(y[2]);
        return b - a;
    };

    TimeComparator(a, b) {
        return new Date('1970/01/01 ' + a[3]) - new Date('1970/01/01 ' + b[3]);
    };

    sortByName() {
        sorted = this.state.namesSorted;
        if (!sorted) {
            sortedRaces = races.sort(this.NameComparator);
            this.setState({ namesSorted: true, distancesSorted: false, timesSorted: false, datesSorted: false })
        } else {
            sortedRaces = races.reverse(this.NameComparator);
            this.setState({ namesSorted: false })
        }
    };

    sortByDistance() {
        sorted = this.state.distancesSorted;
        this.props.training ? list = trainingRuns : list = races;
        if (!sorted) {
            sortedRaces = list.sort(this.DistanceComparator);
            this.setState({ distancesSorted: true, namesSorted: false, timesSorted: false, datesSorted: false })
        } else {
            sortedRaces = list.reverse(this.DistanceComparator);
            this.setState({ distancesSorted: false })
        }
    };

    sortByTime() {
        sorted = this.state.timesSorted;
        this.props.training ? list = trainingRuns : list = races;
        if (!sorted) {
            sortedRaces = list.sort(this.TimeComparator);
            this.setState({ timesSorted: true, namesSorted: false, distancesSorted: false, datesSorted: false })
        } else {
            sortedRaces = list.reverse(this.TimeComparator);
            this.setState({ timesSorted: false })
        }
    };

    sortByDate() {
        sorted = this.state.datesSorted;
        this.props.training ? list = trainingRuns : list = races;
        if (!sorted) {
            sortedRaces = list.sort(this.DateComparator);
            this.setState({ datesSorted: true, namesSorted: false, distancesSorted: false, timesSorted: false })
        } else {
            sortedRaces = list.reverse(this.DateComparator);
            this.setState({ datesSorted: false })
        }
    };

    render() {
        return (
            <View style={{ flex: 1, paddingTop: 10, backgroundColor: '#fff' }}>
                <Table >
                    <Header select={this.headerSelectCallback} />
                    <ScrollView
                        keyboardShouldPersistTaps='handled'
                        style={{
                            backgroundColor: '#d9d9d9',
                            height: '100%',
                        }}>
                        {this.showRaces()}
                    </ScrollView>
                </Table>
            </View>
        )
    };
};
export default List;