import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
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
    // Pass new array to add element
    // Otherwise it doesn't render even the size is changed
    // because it is still a same reference...
    // this.state.items.push(this.state.todoText)
    // this.setState({ items: this.state.items})
    // Copy and refere diffent array
    this.setState({
      todoText: '',
      items: [...this.state.items, this.state.todoText],
    })
  }

  // How each cell looks like
  _listItemRender = (item: string) => {
    return (
      <View>
        <Text>{item}</Text>
      </View>
    )
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
        {/* at least 2 props(data source, render) */}
        <FlatList
          data={this.state.items}
          // Object deconstruction -> just want 1 item
          // {item}
          renderItem={({ item }) => this._listItemRender(item)}
          // Give keys to distinguish each node which the flatList holds.
          // Keys should be a string type.
          keyExtractor={
            (item, index) => index.toString()
            /* If the item is an object which has 'id' field, you can set 'id' as a key. */
          } /* item.id.toString() */
        />
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
  todoText: {
    width: '90%',
    marginBottom: 16,
    marginTop: 16,
    borderBottomWidth: 2,
    fontSize: 18,
    justifyContent: 'center',
  },
})
