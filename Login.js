import React, { Component } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Alert, ScrollView } from 'react-native';

import API from './API';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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
            switch (signedUp) {
                case 'email sent':
                    Alert.alert('A verification email has been sent to the address provided. Please verify and then log in.');
                    break;
                case 'auth/invalid-email':
                    Alert.alert('You have entered an invalid email');
                    break;
                case 'auth/email-already-in-use':
                    Alert.alert('Someone with this email has already signed up. Try logging in instead');
                    break;
                case 'auth/weak-password':
                    Alert.alert('A stronger password is required');
                    break;
                default:
                    Alert.alert('Something went wrong! Please try again');
            }
        } else {
            loggedIn = await api.signin(email, password);
            switch (loggedIn) {
                case true:
                    this.setState({ loggedIn: true });
                    this.props.loggedIn(email);
                    break;
                case 'email sent':
                    Alert.alert('An email has been sent to the address provided. Please verify your email to continue.');
                    break;
                case 'auth/invalid-email':
                    Alert.alert('You have entered an invalid email');
                    break;
                default:
                    Alert.alert('Invalid login. Please try again');
                    break;
            }
        }
    }
    render() {
        return (
            <View style={styles.container} >
                <ScrollView style={styles.scrollView}>
                    <View style={styles.center}>
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
                            style={styles.button}>
                            <Text style={styles.buttonText}> {this.state.signup ? 'Sign Up' : 'Log In'}</Text>
                        </TouchableOpacity>
                        <Text onPress={this.switchForm.bind(this)}>{this.state.signup ? 'Log In' : 'Sign Up'}</Text>
                    </View>
                    <View style={styles.spacer}>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { alignItems: 'center' },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        margin: 20,
    },
    scrollView: {
        width: '100%',
        height: '100%'
    },
    button: {
        width: 100,
        backgroundColor: '#008080',
        padding: 12,
        margin: 15,
        borderRadius: 50,
        alignItems: 'center'
    },
    buttonText: {
        color: '#f8f8f8',
        fontSize: 20,
        textAlign: 'center'
    },
    spacer: { padding: 150 }
});
