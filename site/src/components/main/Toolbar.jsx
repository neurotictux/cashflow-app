import React from 'react'
import { AppBar, Toolbar, Button } from '@material-ui/core/'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import * as Icons from '@material-ui/icons'
import Menu from '@material-ui/core/Menu'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { AppTexts, Languages } from '../../helpers/appTexts'
import { BrazilFlag, UnitedStatesFlag } from './Flags'
import { languageChanged, userChanged } from '../../actions'
import { authService } from '../../services'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 2,
    textTransform: 'uppercase'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  userName: {
    fontFamily: 'Roboto Helvetica Arial sans-serif',
    color: '#777',
    fontSize: '24px'
  },
  userEmail: {
    fontFamily: 'Roboto Helvetica Arial sans-serif',
    color: '#777'
  },
  userMenuFooter: {
    padding: '10px',
    textAlign: 'end',
    backgroundColor: '#afafaf'
  }
}

class AppToolbar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.changeLanguage = this.changeLanguage.bind(this)
  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorEl: null })
  }

  changeLanguage(l) {
    this.props.languageChanged(l)
    document.title = AppTexts.AppTitle[l]
    this.handleClose()
  }

  logout() {
    authService.logout()
    this.props.userChanged(null)
  }

  render() {
    return (
      <div style={styles.root} >
        <AppBar position='static' color='primary'>
          <Toolbar>
            {
              this.props.dockedMenu ? null :
                <IconButton style={styles.menuButton}
                  color="inherit"
                  aria-label="Menu"
                  onClick={() => this.props.openSideBar()}>
                  <Icons.Menu />
                </IconButton>
            }
            <Typography variant="title" color="inherit" style={styles.grow}>
              Finanças
            </Typography>
            {/* <Button variant="fab" color="secondary" onClick={this.handleClick}>
              <img height="70" width="70" style={{ borderRadius: '50%' }}
                src={this.props.user && this.props.user.picture ? this.props.user.picture : '/api/image/user-image.png'} />
            </Button> */}

            <Menu
              style={{ margin: '0', padding: '0' }}
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}>
              <div style={{ display: 'inline-block' }}>
                <img height="60" width="60" style={{ marginLeft: '8px', borderRadius: '50%' }}
                  src={this.props.user && this.props.user.picture ? this.props.user.picture : '/api/image/user-image.png'} />
                <div style={{ marginLeft: '12px' }}>
                  <UnitedStatesFlag onClick={() => this.changeLanguage(Languages.EN_US)} />
                  <BrazilFlag onClick={() => this.changeLanguage(Languages.PT_BR)} />
                </div>
              </div>
              <div style={{ display: 'inline-block', marginLeft: '8px', marginRight: '8px' }}>
                <div style={styles.userName}>{this.props.user && this.props.user.name ? this.props.user.name : ''}</div>
                <div style={styles.userEmail}>{this.props.user && this.props.user.email ? this.props.user.email : ''}</div>
              </div>
              <div style={styles.userMenuFooter}>
                <Button autoFocus={true} variant="contained" color="primary">{AppTexts.Toolbar.EditAccount[this.props.language]}</Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  onClick={() => this.logout()}
                  variant="contained">{AppTexts.Toolbar.Logout[this.props.language]}</Button>
              </div>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  language: state.appState.language,
  user: state.appState.user
})

const mapDispatchToProps = dispatch => bindActionCreators({ languageChanged, userChanged }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AppToolbar)