import React from 'react'
import { connect } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import { Link } from 'react-router-dom'

import { getCurrentPath } from './AppRouter'

const styles = {
  mainIcon: {
    color: 'white'
  },
  symbolDiv: {
    textAlign: 'center',
    width: '260px'
  },
  symbolSpan: {
    color: '#FFF',
    fontFamily: 'FrederickaGreat',
    fontSize: '60px'
  },
  mainText: {
    color: '#FFF',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  subMainText: {
    color: '#FFF',
    marginLeft: '30px',
    fontSize: '14px'
  }
}

const MainText = (props) => (
  <ListItemText primary={<span style={styles.mainText}>{props.text}</span>} />
)

const LinkListItem = (props) => {
  const clickHandle = (e) => {
    if (getCurrentPath() === props.to)
      e.preventDefault()
    props.onClick()
  }
  return (
    <Link to={props.to}
      onClick={e => clickHandle(e)}
      style={{ textDecoration: 'none' }}>
      <ListItem button >
        <ListItemText primary={<span style={styles.subMainText}>{props.text}</span>} />
      </ListItem>
    </Link>
  )
}

class SidebarContent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.showMenu = this.showMenu.bind(this)
  }

  showMenu(menu) {
    menu = this.state.opened === menu ? '' : menu
    this.setState({ opened: menu })
  }

  render() {
    return (
      <div>
        <div style={styles.symbolDiv}>
          <span style={styles.symbolSpan}>R$</span>
        </div>
        <List>
          <Divider />
          <ListItem button onClick={() => this.showMenu('payments')}>
            <ListItemIcon>
              <QuestionAnswerIcon style={styles.mainIcon} />
            </ListItemIcon>
            <MainText text="Pagamentos" />
          </ListItem>
          <Collapse in={this.state.opened === 'payments'} timeout={400} unmountOnExit>
            <List component="div" disablePadding>
              <LinkListItem onClick={() => this.props.closeSidebar()} to="/my-payments" text="Meus Pagamentos" />
              <LinkListItem onClick={() => this.props.closeSidebar()} to="/payment-month" text="Mês Atual" />
              <LinkListItem onClick={() => this.props.closeSidebar()} to="/payment-future" text="Futuro" />
            </List>
          </Collapse>
          <Divider />
          <LinkListItem onClick={() => this.props.closeSidebar()} to="/credit-cards" text="Cartões de Crédito" />
          <Divider />
        </List>
      </div>
    )
  }
}

const mapStateToProps = state => ({ language: state.appState.language })

export default connect(mapStateToProps)(SidebarContent)