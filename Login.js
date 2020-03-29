import React, { Component } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Alert, ScrollView } from 'react-native';

import API from './API';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            signup: false,
            forgotPassword: false
        };
        api = API;
    };

    componentWillUnmount() {
        this.mounted = false;
    }

    switchFormBetweenSigninAndSignup() {
        this.setState({ signup: !this.state.signup })
    }

    switchFormToForgotPassword() {
        this.setState({ forgotPassword: !this.state.forgotPassword });
        if (this.state.signup) {
            this.setState({ signup: false });
        }
    }

    async sendEmail() {
        const email = this.state.email;
        emailSent = await api.passwordReset(email);
        if (emailSent) {
            Alert.alert('Check your email for password reset');
        } else {
            Alert.alert('Something went wrong! Please try again');
        }
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
                        {!this.state.forgotPassword ?
                            <TextInput
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                                placeholder={'Password'}
                                secureTextEntry={true}
                                style={styles.input}
                            />
                            : null}
                        {this.state.forgotPassword ?
                            <TouchableOpacity
                                title={'Email'}
                                onPress={this.sendEmail.bind(this)}
                                style={styles.buttonLarge}>
                                <Text style={styles.buttonText}> Send E-mail</Text>
                            </TouchableOpacity>
                            : null}
                        {!this.state.forgotPassword ?
                            <TouchableOpacity
                                title={'Login'}
                                onPress={this.onLogin.bind(this)}
                                style={styles.button}>
                                <Text style={styles.buttonText}> {this.state.signup ? 'Sign Up' : 'Sign In'}</Text>
                            </TouchableOpacity>
                            : null}
                        {!this.state.forgotPassword ?
                            <Text onPress={this.switchFormBetweenSigninAndSignup.bind(this)}>{this.state.signup ? 'Back to sign in' : 'Create a new account'}</Text>
                            : null}
                        <Text
                            style={styles.forgotPasswordText}
                            onPress={this.switchFormToForgotPassword.bind(this)}
                        >{this.state.forgotPassword ? 'Back to sign in' : 'Forgot password?'}</Text>
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
        marginBottom: 20,
        margin: 15,
        borderRadius: 50,
        alignItems: 'center'
    },
    buttonLarge: {
        width: 200,
        backgroundColor: '#008080',
        padding: 12,
        marginBottom: 20,
        margin: 15,
        borderRadius: 50,
        alignItems: 'center'
    },
    buttonText: {
        color: '#f8f8f8',
        fontSize: 20,
        textAlign: 'center'
    },
    forgotPasswordText: {
        textAlign: 'center',
        paddingTop: 70
    },
    spacer: { padding: 150 }
});
