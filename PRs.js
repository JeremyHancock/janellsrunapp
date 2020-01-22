import React, { Component } from 'react';
import { View, Picker, Text, ScrollView, AsyncStorage, ActivityIndicator, StyleSheet } from 'react-native';

import List from './List';
import API from './API';

class PRs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedYear: 'All Time',
            selectedRaces: [],
            personalRecords: [],
            hidePicker: true,
            races: [],
            loading: true
        };
        api = API;
        list = List;
        racePRs = [];
    };

    componentDidMount() {
        this.mounted = true;
        if (this.props.prChangeCounter > 0) {
            this.props.counterReset(0);
            this.callApi();
        } else {
            this.getStoredData();
        }
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    getStoredData() {
        AsyncStorage.getItem("races").then((value) => {
            if (value.length > 2) {
                this.setState({ races: JSON.parse(value), loading: false });
            } else {
                this.setState({
                    loading: false,
                    personalRecords:
                        <View>
                            <Text style={styles.message}>{'Your PRs are gonna look AMAZING here'}</Text>
                        </View>
                });
            }
        })
    };

    callApi() {
        api.getRuns(this.props.user)
            .then(function (races) {
                if (races.length !== 0) {
                    this.setState({ races: races, loading: false });
                    stringifiedRaces = JSON.stringify(races);
                    AsyncStorage.setItem('races', stringifiedRaces);
                } else {
                    this.setState({
                        loading: false,
                        personalRecords:
                            <View>
                                <Text style={styles.message}>{'No races have been entered'}</Text>
                            </View>
                    });
                }
            }.bind(this))
            .catch(function (err) {
                console.log(err);
            })
    };

    getYear(runDate) {
        return runDate.getFullYear().toString();
    };

    racesForSelectedYear(selectedYear) {
        this.setState({ selectedYear: selectedYear, hidePicker: true })
        if (selectedYear !== 'All Time') {
            races = this.state.races;
            selectedRaces = [];
            counter = 0;
            races.forEach(race => {
                counter++;
                raceYear = this.getYear(new Date(race.runDate))
                if (raceYear === selectedYear) {
                    selectedRaces.push(race);
                }
                if (counter === races.length) {
                    this.setState({ selectedRaces: selectedRaces });
                }
            })
        }
    };

    getPRs() {
        distances = [];
        racePRs = [];
        selectedYear = this.state.selectedYear;
        if (selectedYear === 'All Time') {
            races = this.state.races;
        } else {
            races = this.state.selectedRaces;
        }
        if (races.length !== 0) {
            races.forEach(race => {
                distances.includes(race.runDistance) ? null : distances.push(race.runDistance);
            });
            distances = distances.sort(function (a, b) { return b - a });
            distances.forEach(distance => {
                pr = 86400;
                counter = 0;
                races.forEach(race => {
                    if (race.raceName !== 'Training') {
                        if (race.runDistance === distance) {
                            if (race.runDurationInSeconds < pr) {
                                pr = race.runDurationInSeconds;
                                if (counter === 0) {
                                    racePRs.push(race);
                                    counter++;
                                } else {
                                    racePRs.pop();
                                    racePRs.push(race);
                                }
                            };
                        };
                    }
                });
            });
            this.DisplayPRs(racePRs);
        };
    };

    DisplayPRs(passedRaces) {
        if (passedRaces.length !== 0) {
            prs = passedRaces.map((pr, i) =>
                <View key={i} style={styles.raceContainer}>
                    <View style={styles.row} >
                        <Text style={styles.rowItemLarge}>{this.convertRunDuration(pr.runDurationInSeconds)}</Text>
                        <Text style={styles.rowItemLarge}>{pr.runDistance + ' miles'}</Text>
                    </View>
                    <View style={styles.row} >
                        <Text style={styles.rowItem}>{pr.raceName}</Text>
                        <Text style={styles.rowItem}>{this.getFormattedDate(new Date(pr.runDate))}</Text>
                    </View>
                </View>
            );
            if (prs.length === passedRaces.length) {
                this.setState({personalRecords: prs});
            }
        } else {
            noRaces = <View>
                <Text style={styles.message}>{'No races entered for ' + this.state.selectedYear}</Text>
            </View>
                this.setState({personalRecords: noRaces});
            }
    };

    getFormattedDate(date) {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let year = date.getFullYear().toString();
        let month = months[(date.getMonth())];
        let day = date.getDate().toString();
        return month + ' ' + day + ' ' + year;
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

    render() {
        // this.getPRs();
        return (
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    {this.state.hidePicker &&
                        <Text
                            onPress={() => this.setState({ hidePicker: false })}
                            style={styles.pickerText}>
                            {this.state.selectedYear + ' PRs'}  &#9660;
                        </Text>
                    }
                </View>
                <View>
                    {!this.state.hidePicker &&
                        <Picker
                            selectedValue={this.state.selectedYear}
                            style={styles.picker}
                            onValueChange={(itemValue) =>
                                this.racesForSelectedYear(itemValue)}>
                            <Picker.Item label='All Time' value='All Time' />
                            <Picker.Item label='2020' value='2020' />
                            <Picker.Item label='2019' value='2019' />
                            <Picker.Item label='2018' value='2018' />
                            <Picker.Item label='2017' value='2017' />
                            <Picker.Item label='2016' value='2016' />
                            <Picker.Item label='2015' value='2015' />
                            <Picker.Item label='2014' value='2014' />
                            <Picker.Item label='2013' value='2013' />
                            <Picker.Item label='2012' value='2012' />
                            <Picker.Item label='2011' value='2011' />
                            <Picker.Item label='2010' value='2010' />
                        </Picker>}
                </View>
                <View style={styles.fullWidth}>
                    {this.state.loading ?
                        <View style={styles.activityIndicator}>
                            <ActivityIndicator size="large" />
                        </View>
                        :
                        <View style={styles.paddingBottom}>
                            <ScrollView style={styles.scrollView}>
                                {this.state.personalRecords}
                            </ScrollView>
                        </View>
                    }
                </View>
            </View>

        )
    };
};
const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#d9d9d9',
        width: '100%',
        height: '100%'
    },
    fullWidth: { width: '100%' },
    activityIndicator: { padding: 50 },
    paddingBottom: { paddingBottom: 40 },
    message: { 
        textAlign: 'center', 
        padding: 30 
    },
    raceContainer: { 
        textAlign: 'center', 
        padding: 30 
    },
    container: { 
        flex: 1, 
        paddingTop: 10, 
        alignItems: 'center' 
    },
    row: { flexDirection: 'row' },
    rowItemLarge: { 
        width: '50%', 
        fontSize: 20, 
        textAlign: 'center' 
    },
    rowItem: { 
        width: '50%', 
        textAlign: 'center' 
    },
    pickerContainer: { 
        width: '100%', 
        borderBottomWidth: 3 
    },
    pickerText: { 
        textAlign: 'center', 
        fontSize: 20, 
        paddingBottom: 20 
    },
    picker: { 
        width: 250, 
        borderWidth: 3, 
        borderRadius: 5, 
        borderColor: '#008080', 
        margin: 5 
    }
});
export default PRs;