import React from 'react'
import { ActivityIndicator, Dimensions, View, Text, DrawerLayoutAndroid } from 'react-native'
import { Button, Toolbar } from 'react-native-material-ui'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// import { UserStorage } from '../../storage'

const screenHeight = Dimensions.get('window').height
const appDrawer = 'appDrawer'

class BaseViewComponent extends DrawerLayoutAndroid {

  constructor(props) {
    super(props)

    this.state = {
      maxHeightList: screenHeight,
      user: {email: 'teste@mail.com'}
    }
  }

  componentDidMount() {
    // UserStorage.get().then(user => {
    //   if (user)
    //     this.setState({ user: user })
    // })
  }

  menuSelected(idx) {
    if (this.props.menuSelected)
      this.props.menuSelected(idx)
  }

  changeHeight(toolbarHeight) {
    this.setState({ maxHeightList: screenHeight - toolbarHeight - 25 })
  }

  toScreen(idx) {
    this.refs['appDrawer'].closeDrawer()
    switch (idx) {
      case 1:
        Actions.payments()
        break
      case 2:
        Actions.futurePayments()
        break
    }
  }

  render() {

    var navigationView = (
      <View style={{ flex: 1, backgroundColor: '#383' }}>
        <View style={{ height: 100, backgroundColor: '#7c7', justifyContent: 'flex-end' }}>
          <Icon
            name='account'
            style={{ color: '#FFF', textAlign: 'center', fontSize: 50 }} />
          <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10, fontWeight: 'bold', color: '#FFF' }}>{this.state.user.email}</Text>
        </View>
        <Button text='Pagamentos' primary raised onPress={() => this.toScreen(1)} />
        <Button text='Estimativas' primary raised onPress={() => this.toScreen(2)} />
      </View>
    )

    return (
      <DrawerLayoutAndroid
        drawerWidth={200}
        ref={appDrawer}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View onLayout={e => this.changeHeight(e.nativeEvent.layout.height)}>
          <Toolbar
            style={{ container: { backgroundColor: '#282' } }}
            leftElement="menu"
            centerElement={this.props.title}
            searchable={{
              autoFocus: false,
              placeholder: 'Busca...',
              onChangeText: (val) => this.props.onSearchChanged ? this.props.onSearchChanged(val) : null,
              onSearchClosed: () => this.props.onSearchClosed ? this.props.onSearchClosed() : null
            }}
            rightElement={{
              menu: {
                icon: 'more-vert',
                labels: ['Refresh', 'Logout']
              }
            }}
            onRightElementPress={label => this.menuSelected(label.index)}
            onLeftElementPress={() => this.refs['appDrawer'].openDrawer()}
          />
        </View>
        <View style={{ maxHeight: this.state.maxHeightList }}>
          {this.props.loading ? <ActivityIndicator size="large" /> : this.props.children}
        </View>
      </DrawerLayoutAndroid>
    )
  }
}

BaseViewComponent.propTypes = {
  title: PropTypes.string,
  menuSelected: PropTypes.func,
  loading: PropTypes.bool
}

export default BaseViewComponent