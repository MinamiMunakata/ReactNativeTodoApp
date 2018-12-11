import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
} from 'react-native'

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

  _insert = () => {
    // insert item
    console.log('Clicked!')
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.todoText}
          value={this.state.todoText}
          onChangeText={todoText => this.setState({ todoText })}
        />
        {/* => this.setState({ todoText: todoText}) */}
        {/* FlatList */}
        <Button title={'Add Todo'} onPress={this._insert} />
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
  todoText: {},
})
