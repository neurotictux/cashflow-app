import React from 'react'
import { Card, ListItem, Button } from 'react-native-material-ui'
import ActionButton from 'react-native-action-button'
import { TextInput, FlatList, Text, View, Modal, Alert } from 'react-native'

import { BaseViewComponent } from '../components'
import { creditCardService } from '../services'

export default class Cards extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      show: false,
      edit: false,
      cards: [],
      card: null,
      loading: true
    }
  }

  componentDidMount() {

    // NetInfo.isConnected.fetch().then(isConnected => {
    //   if (isConnected) {
    //     Alert.alert('You are online!')
    //   } else {
    //     Alert.alert('You are offline!')
    //   }
    // }).catch(err => console.log(err))

    this.refresh()
  }

  refresh() {
    this.setState({ loading: true })
    creditCardService.get().then(cards => {
      cards = cards.map(c => ({ ...c, key: c.id + '' }))
      this.setState({ cards, show: false, loading: false })
    }).catch(() => this.setState({ show: false, loading: false }))
  }

  save() {
    const card = this.state.card || {}
    card.name = (this.state.name || '').toUpperCase()
    const self = this
    if (card.id)
      creditCardService.update(card)
        .then(() => self.refresh())
        .catch(err => Alert.alert('ERRO', JSON.stringify(err)))
    else
      creditCardService.create(card)
        .then(() => self.refresh())
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
          creditCardService.remove(this.state.card.id)
            .then(() => this.refresh())
            .catch(err => Alert.alert('ERRO', JSON.stringify(err)))
        }
      }
    ])
  }

  render() {
    return (
      <BaseViewComponent
        currentPage={2}
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
          renderItem={({ item }) =>
            <ListItem
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