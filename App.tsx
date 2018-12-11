import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput } from 'react-native'

// Declare because of using typescript.
interface IState {
  todoText: string
  items: string[]
}

export default class App extends React.Component<{}, IState> {
  state = {
    todoText: '',
    items: [],
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput value={this.state.todoText} onChangeText={} />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
