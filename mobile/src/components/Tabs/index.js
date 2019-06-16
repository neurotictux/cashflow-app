import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Container, TabsContainer, TabItem, TabText } from './styles'

import Icon from 'react-native-vector-icons/MaterialIcons'

const TabIcon = ({ name, text, selected, onPress }) => (
  <TouchableOpacity onPress={() => onPress()}>
    <TabItem selected={selected}>
      <Icon name={name} size={30} color={selected ? '#383' : '#FFF'} />
      <TabText selected={selected}>{text}</TabText>
    </TabItem>
  </TouchableOpacity>
)

export default function Tabs({ currentPage, toPage }) {
  const tabs = [
    { name: 'home', text: 'Home' },
    { name: 'attach-money', text: 'Pagamentos' },
    { name: 'credit-card', text: 'Cartões' },
    { name: 'notifications', text: 'Notificações' },
    { name: 'message', text: 'Reclamação' },
    { name: 'person', text: 'Conta' }
  ]
  return (
    <Container>
      <TabsContainer>
        {tabs.map((p, i) => <TabIcon key={i}
          name={p.name}
          text={p.text}
          onPress={() => toPage(i)}
          selected={currentPage === i}
        />)}
      </TabsContainer>
    </Container >
  )
}

Tabs.propTypes = {
  currentPage: PropTypes.number,
  toPage: PropTypes.func.isRequired
}

TabIcon.propTypes = {
  name: PropTypes.string,
  text: PropTypes.string,
  selected: PropTypes.bool,
  onPress: PropTypes.func
}