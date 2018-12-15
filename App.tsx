import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { SecureStore, SQLite, FileSystem } from 'expo'

const db = SQLite.openDatabase('todo.db')

/**
 * 1) Save - insert
 *          - delete
 *
 * 2) get
 */

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

  _read = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM todos',
        [],
        (_, { rows }) => {
          const result = rows._array
          for (const todoObject of result) {
            const todo: string = todoObject.todo
            this.setState({
              items: [...this.state.items, todo],
            })
          }
          console.log('<_read> Success: ' + JSON.stringify(result))
        },
        (_, error) => {
          console.log('Error: ' + JSON.stringify(error))
        }
      )
    })
  }
  // Override
  componentDidMount() {
    db.transaction(
      tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS todos (todo text)')
      },
      null,
      this._read
    )

    // try {
    //   // get Items from SecureStore
    //   const list = await SecureStore.getItemAsync('list')
    //   if (list !== null && list !== undefined) {
    //     this.setState({ items: JSON.parse(list) })
    //   }
    // } catch (error) {
    //   // Error handling
    // }
  }

  _insert = (todoText: string) => {
    this.setState({
      todoText: '',
      items: [...this.state.items, this.state.todoText],
    })
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO todos (todo) VALUES (?)',
          [todoText],
          (_, { rows }) => {
            const result = rows.item()
            console.log('Success: ' + JSON.stringify(rows))
          },
          (_, error) => {
            console.log('Error: ' + JSON.stringify(error))
          }
        )
      },
      null,
      console.log('_insert: Done.')
    )
  }

  _delete = (todoText: string) => {
    const index = (this.state.items as string[]).indexOf(todoText)
    this.state.items.splice(index, 1) /* remove */
    this.setState({ items: [...this.state.items] })
    db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM todos WHERE todo = ?',
          [todoText],
          (_, { rows }) => {
            const result = rows._array
            console.log('<_delete> Success: ' + JSON.stringify(result))
          },
          (_, error) => {
            console.log('Error: ' + JSON.stringify(error))
          }
        )
      },
      null,
      console.log('_delete: Done.')
    )
  }
  // --------------------- 2 (using SecureStore) ---------------------
  // _insert = async () => {
  //   try {
  //     await this.setState({
  //       todoText: '',
  //       items: [...this.state.items, this.state.todoText],
  //     })
  //     await SecureStore.setItemAsync('list', JSON.stringify(this.state.items))
  //   } catch (error) {
  //     // Error handling
  //   }
  // }

  // _delete = async (todoText: string) => {
  //   // delete
  //   const index = (this.state.items as string[]).indexOf(todoText)
  //   this.state.items.splice(index, 1) /* remove */
  //   try {
  //     await this.setState({ items: [...this.state.items] })
  //     await SecureStore.setItemAsync('list', JSON.stringify(this.state.items))
  //   } catch (error) {
  //     // Error handling
  //   }
  // }
  // --------------------- 2 ---------------------

  // --------------------- 1 (without database) ---------------------
  // _insert = () => {
  //   // insert item
  //   // Pass new array to add element
  //   // Otherwise it doesn't render even the size is changed
  //   // because it is still a same reference...
  //   // this.state.items.push(this.state.todoText)
  //   // this.setState({ items: this.state.items})
  //   // Copy and refere diffent array
  //   this.setState({
  //     todoText: '',
  //     items: [...this.state.items, this.state.todoText],
  //   })
  // }

  // _delete = (todoText: string) => {
  //   // delete
  //   const index = (this.state.items as string[]).indexOf(todoText)
  //   this.state.items.splice(index, 1) /* remove */
  //   this.setState({ items: [...this.state.items] })
  // }
  // --------------------- 1 ---------------------

  // How each cell looks like
  _listItemRender = (item: string) => {
    return (
      // this._delete(item) <- NG
      <TouchableOpacity onPress={() => this._delete(item)}>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      </TouchableOpacity>
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
          style={styles.list}
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
        <Button
          title={'Add Todo'}
          onPress={() => this._insert(this.state.todoText)}
        />
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
  list: {
    width: '100%',
    flex: 1,
  },
  listItem: {
    backgroundColor: '#4286f4',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  itemText: {
    color: 'white',
    fontSize: 18,
  },
})
