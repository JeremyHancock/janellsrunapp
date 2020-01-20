import React, { Component } from 'react';
import { View, Image, Alert, Text, Switch } from 'react-native';

import Entry from './Entry';
import MenuBar from './menuBar';
import List from './List';
import PRs from './PRs';
import Login from './Login';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: 'login',
      hideMenu: true,
      training: false,
      user: '',
      listChangeCounter: 1,
      prChangeCounter: 1
    };
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Image source={require('./assets/richmond-silhouette.png')}
            style={{
              width: 325,
              height: 162.5,
              marginTop: 25
            }}></Image>
        </View>
        {this.state.selected === 'login' ?
          <Login loggedIn={this.loginCallback} />
          : null}
        {this.state.selected === 'add' ?
          <Entry user={this.state.user} 
          prCounterReset={this.prCounterCallback} 
          listCounterReset={this.listCounterCallback}/>
          : null}
        {this.state.selected === 'seeAll' ?
          <List
            user={this.state.user}
            select={this.menuSelectCallback}
            selected={this.state.selected}
            training={this.state.training}
            listChangeCounter={this.state.listChangeCounter}
            counterReset={this.listCounterCallback} />
          : null}
        {this.state.selected === 'seeBest' ?
          <PRs user={this.state.user}
          prChangeCounter={this.state.prChangeCounter}
          counterReset={this.prCounterCallback} />
          : null}
        {this.state.selected === 'seeAll' ?
          <View style={{
            flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center', padding: 7, backgroundColor: 'black',
            borderBottomWidth: 1, borderBottomColor: 'white'
          }}>
            <Text style={{ color: 'white', fontSize: 20, paddingHorizontal: 15 }}>
              {this.state.training ? 'All the training!' : 'All the races!'}
            </Text>
            <Switch
              ios_backgroundColor='white'
              trackColor={{ true: '#d9d9d9' }}
              value={!this.state.training}
              onValueChange={() => this.setState({ training: !this.state.training })}
            />
          </View> : null}
        {!this.state.hideMenu ? <MenuBar select={this.menuSelectCallback} /> : null}
      </View>
    );
  }
  menuSelectCallback = (response) => {
    this.setState({ selected: response });
  }

  listCounterCallback = (response) => {
    this.setState({ listChangeCounter: response});
  }

  prCounterCallback = (response) => {
    this.setState({ prChangeCounter: response});
  }

  trainingToggleCallback = (response) => {
    this.setState({ training: response });
  }

  loginCallback = (response) => {
    if (response) {
      this.setState({ selected: 'seeAll', hideMenu: false, user: response })
    } else {
      Alert.alert('Invalid credentials');
    }
  }
}


