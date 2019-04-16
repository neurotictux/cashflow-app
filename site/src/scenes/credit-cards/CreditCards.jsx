import React from 'react'

import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  ListItemText,
  Tooltip,
  Button,
  Divider
} from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import CardIcon from '@material-ui/icons/CreditCardOutlined'

import CardMain from '../../components/main/CardMain'
import IconTextInput from '../../components/main/IconTextInput'

import { creditCardService } from '../../services/index'

const styles = {
  noRecords: {
    textTransform: 'none',
    fontSize: '18px',
    textAlign: 'center'
  },
  divNewCard: {
    textTransform: 'none',
    fontSize: '18px',
    textAlign: 'center',
    marginTop: '20px'
  },
  errorMessage: {
    color: 'red'
  }
}

export default class CreditCards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cards: [],
      card: null,
      cardName: ''
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    this.setState({ loading: true, errorMessage: '', card: null, cardName: '' })
    creditCardService.get().then(res => {
      setTimeout(() => {
        this.setState({ loading: false, cards: res })
      }, 300)
    })
  }

  removeCard(id) {
    creditCardService.remove(id)
      .then(() => this.refresh())
      .catch(err => this.setState({ errorMessage: err.error }))
  }

  saveCard() {
    const { card, cardName } = this.state
    card.name = cardName
    if (card.id)
      creditCardService.update(card)
        .then(() => this.refresh())
        .catch(err => this.setState({ errorMessage: err.error }))
    else
      creditCardService.create(card)
        .then(() => this.refresh())
        .catch(err => this.setState({ errorMessage: err.error }))
  }

  render() {
    return (
      <CardMain title="Cartões de crédito" loading={this.state.loading}>
        {this.state.cards.length > 0 ?
          <Paper>
            <List dense={true}>
              {this.state.cards.map(p =>
                <ListItem button key={p.id}
                  onClick={() => this.setState({ card: p, cardName: p.name })}>
                  <ListItemAvatar>
                    <Avatar>
                      <CardIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={p.name}
                    secondary=""
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Remover este cartão">
                      <IconButton color="secondary" aria-label="Delete"
                        onClick={() => this.removeCard(p.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </List>
          </Paper>
          :
          <div style={styles.noRecords}>
            <span>Você ainda não adicionou cartões.</span>
          </div>
        }
        <div style={styles.divNewCard}>
          <Button variant="raised" color="primary" onClick={() => this.setState({ card: {} })}>
            Adicionar Cartão
          </Button>
          <div style={{ marginTop: '20px' }} hidden={this.state.card === null}>
            <Divider />
            <IconTextInput
              label="Nome do cartão"
              value={this.state.cardName}
              onChange={(e) => this.setState({ cardName: e.value, errorMessage: '' })}
              Icon={<CardIcon />}
            />
            <br />
            <div style={{ marginTop: '20px' }}>
              <Button color="primary" onClick={() => this.setState({ card: null })}>
                Cancelar
              </Button>
              <Button variant="raised" color="primary"
                onClick={() => this.saveCard()}>
                Salvar
              </Button>
            </div>
            <span style={{ color: '#d55', marginTop: '10px' }}>{this.state.errorMessage}</span>
          </div>
        </div>
      </CardMain>
    )
  }
}