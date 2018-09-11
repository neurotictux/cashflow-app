/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { ActionButton, Card, Toolbar, ListItem } from 'react-native-material-ui'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  render() {
    return (
      <View>
        <View>
          <Toolbar
            style={{ container: { backgroundColor: '#282' } }}
            leftElement="menu"
            centerElement="Payments"
            searchable={{
              autoFocus: true,
              placeholder: 'Search',
            }}
            rightElement={{
              menu: {
                icon: "more-vert",
                labels: ["item 1", "item 2"]
              }
            }}
            onRightElementPress={(label) => { console.warn(label) }}
          />
          <Card>
            <Text>Olá</Text>
            <View>
              <ActionButton />
              <ActionButton icon="done" />
            </View>
          </Card>
        </View>
        <View>
          <ActionButton />
          <ActionButton icon="done" />
        </View>
      </View>
    );
  }
}
