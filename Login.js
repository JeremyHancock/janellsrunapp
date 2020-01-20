import React, { Component } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Alert, ScrollView } from 'react-native';

import API from './API';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: null,
            loggedIn: false,
            signup: false
        };
        api = API;
    };
    componentWillUnmount() {
        this.mounted = false;
    }
    switchForm() {
        this.setState({ signup: !this.state.signup })
    }
    async onLogin() {
        const { email, password } = this.state
        if (this.state.signup) {
            signedUp = await api.signup(email, password);
            if (signedUp) {
                this.setState({ loggedIn: true })
                this.props.loggedIn(email);
            } else {
                Alert.alert('Something went wrong!');
            }
        } else {
            loggedIn = await api.signin(email, password);
            if (loggedIn) {
                this.setState({ loggedIn: true })
                this.props.loggedIn(email);
            } else {
                Alert.alert('Invalid credentials');
            }
        }
    }
    render() {
        return (
            <View style={styles.container} >
                <ScrollView style={{ width: '100%', height: '100%' }}>
                    <View style={{ alignItems: 'center' }}>
                        <TextInput
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })}
                            placeholder={'Email'}
                            style={styles.input}
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            title={'Login'}
                            onPress={this.onLogin.bind(this)}
                            style={{ width: 100, backgroundColor: '#008080', padding: 12, margin: 15, borderRadius: 50, alignItems: 'center' }}>
                            <Text style={{ color: '#f8f8f8', fontSize: 20, textAlign: 'center' }}> {this.state.signup ? 'Sign Up' : 'Log In'}</Text>
                        </TouchableOpacity>
                        <Text onPress={this.switchForm.bind(this)}>{this.state.signup ? 'Log In' : 'Sign Up'}</Text>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        margin: 20,
    },
});
