import React, { Component } from 'react';
import { TouchableOpacity, KeyboardAvoidingView, DatePickerIOS, View, Picker, Switch, Text, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';

import API from './API';

class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            raceName: '',
            distance: '13.1',
            training: false,
            date: new Date(),
            hours: '',
            minutes: '',
            seconds: '',
            other: false
        };
        this.setDate = this.setDate.bind(this);
        api = API;
    };

    setDate(newDate) {
        this.setState({ date: newDate });
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    collectRunFromForm() {
        run = {
            user: this.props.user,
            id: Date.now().toString(),
            raceName: this.state.training ? 'Training' : this.state.raceName,
            runDate: this.state.date,
            runDistance: this.state.distance,
            runDurationInSeconds: this.formatTimeToSeconds(this.state.hours, this.state.minutes, this.state.seconds),
        }
        if (run.raceName && run.runDistance && run.runDurationInSeconds >= 60) {
            this.postRun(run);
        }
        if (run.raceName === '') {
            return Alert.alert('Please name your race');
        }
        if (run.runDistance === '') {
            return Alert.alert('Please enter a distance');
        }
        if (run.runDurationInSeconds < 60) {
            return Alert.alert('Please enter a valid finish time');
        }
    };

    postRun(run) {
        api.postRun(run)
            .then(response => {
                if (response.data === "success") {
                    this.props.listCounterReset(1);
                    this.resetFormValues();
                    Alert.alert(run.raceName + ' posted!', 'Great job!')
                    if (run.raceName !== 'Training') {
                        this.props.prCounterReset(1);
                    }
                } else {
                    Alert.alert("Something went wrong! Please try again");
                }
            });
    };

    resetFormValues() {
        this.setState({
            raceName: '',
            distance: '13.1',
            training: false,
            date: new Date(),
            hours: '',
            minutes: '',
            seconds: '',
            other: false
        })
    };

    formatTimeToSeconds(h, m, s) {
        h = Number(h);
        m = Number(m);
        s = Number(s);
        return (h * 60 + m) * 60 + s
    };

    formatDateToString(date) {
        d = date.toString();
        d = d.split(' ');
        d = d[1] + ' ' + d[2] + ', ' + d[3];
        return d;
    };

    render() {
        return (
            <KeyboardAvoidingView style={styles.flex} behavior="padding" >
                <ScrollView >
                    <View style={styles.center}>
                        <View style={this.state.training ? null : styles.nameRow} >
                            {this.state.training ? null :
                                <TextInput
                                    value={this.state.raceName}
                                    onChangeText={(raceName) => this.setState({ raceName })}
                                    placeholder='Name your race!'
                                    maxLength={25}
                                    style={styles.nameField}>
                                </TextInput>
                            }
                            <View
                                style={styles.center}>
                                <Text>
                                    {this.state.training ? 'Training' : 'Race'}
                                </Text>
                                <Switch
                                    trackColor={{ true: '#008080' }}
                                    value={!this.state.training}
                                    onValueChange={() =>
                                        this.setState({ training: !this.state.training })}
                                />
                            </View>
                        </View>
                        <Text style={styles.fontMedium}>Date</Text>
                        <DatePickerIOS
                            style={styles.picker}
                            initialDate={this.state.date}
                            maximumDate={new Date()}
                            minimumDate={new Date('January 1, 2000')}
                            onDateChange={(date) => this.setDate(date)}
                            mode='date' />
                        <Text style={styles.fontMedium}>Distance</Text>
                        {this.state.other ? null :
                            <Picker
                                selectedValue={this.state.distance}
                                style={styles.picker}
                                onValueChange={(itemValue, itemIndex) =>
                                    itemValue === 'other' ? this.setState({ other: 'other' }) : this.setState({ distance: itemValue })}>
                                <Picker.Item label='5K' value='3.1' />
                                <Picker.Item label='8K' value='4.97' />
                                <Picker.Item label='10K' value='6.2' />
                                <Picker.Item label='Half Marathon' value='13.1' />
                                <Picker.Item label='Marathon' value='26.2' />
                                <Picker.Item label='Other' value='other' />
                            </Picker>
                        }
                        {this.state.other ? <TextInput
                            onChangeText={(distance) => this.setState({ distance })}
                            placeholder='Distance in miles'
                            maxLength={6}
                            keyboardType={'numeric'}
                            style={styles.distanceField}></TextInput> : null}
                        <Text style={styles.fontMedium}>Time</Text>
                        <View
                            style={styles.row}>
                            <TextInput
                                value={this.state.hours}
                                onChangeText={(hours) => this.setState({ hours })}
                                placeholder='H'
                                maxLength={2}
                                keyboardType={'number-pad'}
                                style={styles.timeField}>
                            </TextInput>
                            <TextInput
                                value={this.state.minutes}
                                onChangeText={(minutes) => this.setState({ minutes })}
                                placeholder='M'
                                maxLength={2}
                                keyboardType={'number-pad'}
                                style={styles.timeField}>
                            </TextInput>
                            <TextInput
                                value={this.state.seconds}
                                onChangeText={(seconds) => this.setState({ seconds })}
                                placeholder='S'
                                maxLength={2}
                                keyboardType={'number-pad'}
                                style={styles.timeField}>
                            </TextInput>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                this.collectRunFromForm()
                            }>
                            <Text style={styles.buttonText}>Post Run</Text>
                        </TouchableOpacity>
                        <View style={styles.spacer} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row' },
    flex: { flex: 1 },
    center: { alignItems: 'center' },
    fontMedium: { fontSize: 20 },
    spacer: { height: 60 },
    nameRow: {
        flexDirection: 'row',
        borderWidth: 3,
        borderRadius: 5,
        borderColor: '#008080'
    },
    nameField: {
        width: '50%',
        height: 45,
        fontSize: 25,
        margin: 5,
        textAlign: 'center'
    },
    distanceField: {
        width: 250,
        height: 45,
        fontSize: 25,
        margin: 5,
        textAlign: 'center',
        borderWidth: 3,
        borderRadius: 5,
        borderColor: '#008080'
    },
    timeField: {
        width: 80,
        height: 45,
        fontSize: 25,
        borderWidth: 3,
        borderRadius: 5,
        borderColor: '#008080',
        margin: 5,
        textAlign: 'center'
    },
    picker: {
        width: 250,
        borderWidth: 3,
        borderRadius: 5,
        borderColor: '#008080',
        margin: 5
    },
    button: {
        backgroundColor: '#008080',
        padding: 12,
        margin: 15,
        borderRadius: 50
    },
    buttonText: {
        color: '#f8f8f8',
        fontSize: 20,
        textAlign: 'center'
    }
});

export default Entry;