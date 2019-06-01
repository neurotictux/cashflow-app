import React from 'react'
import { Card, ListItem, Button } from 'react-native-material-ui'
import ActionButton from 'react-native-action-button'
import { TextInput, FlatList, Text, View, Modal, Alert } from 'react-native'

import { BaseViewComponent } from '../components'
import { creditCardStorage } from '../storage'

export default class Cards extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      show: false,
      edit: false,
      cards: [],
      card: null
    }
  }

  componentDidMount() {
    creditCardStorage.getAll().then(cards => this.setState({ cards }))
  }

  save() {
    const card = this.state.card || {}
    card.name = this.state.name
    const self = this
    if (card.appId)
      creditCardStorage.update(card)
        .then((cards) => self.setState({ show: false, cards }))
        .catch(err => Alert.alert('ERRO', JSON.stringify(err)))
    else
      creditCardStorage.create(card)
        .then(cards => self.setState({ show: false, cards }))
        .catch(err => Alert.alert('ERRO', JSON.stringify(err)))
  }

  open(card) {
    this.setState({
      show: true,
      card: card,
      name: card ? card.name : ''
    })
  }

  remove() {
    const title = `Remover cartão ${this.state.card.name.toUpperCase()}`,
      msg = 'Pagamentos vinculados à este cartão serão desvinculados.'
    Alert.alert(title, msg, [
      { text: 'cancel' },
      {
        text: 'excluir',
        onPress: () => {
          creditCardStorage.remove(this.state.card)
            .then((cards) => this.setState({ show: false, cards }))
            .catch(err => Alert.alert('ERRO', JSON.stringify(err)))
        }
      }
    ])
  }

  render() {
    return (
      <BaseViewComponent
        title="Cartões de Crédito"
        menuSelected={i => this.menuSelected(i)}
        loading={this.state.loading}
        onSearchChanged={val => this.filter(val)}
        onSearchClosed={() => this.filter()}>

        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => { }}
          visible={this.state.show}>
          <View style={{ alignItems: 'center', marginTop: 150 }}>
            <Card>
              <View style={{
                alignItems: 'center',
                padding: 10
              }}>
                <TextInput value={this.state.name}
                  onChangeText={e => this.setState({ name: e })}
                  placeholder="Nome do cartão"
                  style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: 1,
                    width: 200,
                    marginTop: 20,
                    marginBottom: 20
                  }}
                />
                {this.state.card ?
                  <View style={{
                    width: 200,
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                  }}>
                    <Button accent raised onPress={() => this.remove()} color='#FFF' text="remover"></Button>
                  </View> : null}

                <View style={{
                  marginTop: 8,
                  width: 200,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  <Button raised onPress={() => this.setState({ show: false, name: '' })} text="Cancelar"></Button>
                  <Button primary raised onPress={() => this.save()} text="salvar" ></Button>
                </View>

              </View>
            </Card>
          </View>
        </Modal>

        {!this.state.cards.length ? <Text style={{ alignSelf: 'center', marginTop: 10 }}>Nenhum cartão encontrado</Text> : null}

        <FlatList
          style={{ height: '100%' }}
          data={this.state.cards}
          renderItem={({ item, index }) =>
            <ListItem
              key={index}
              style={{ container: { margin: 10 } }}
              centerElement={<Text>{item.name}</Text>}
              onPress={() => this.open(item)}
            />}
        />

        <ActionButton onPress={() => this.open()} offsetX={10} offsetY={10} buttonColor="#282" />
      </BaseViewComponent>

    )
  }
}