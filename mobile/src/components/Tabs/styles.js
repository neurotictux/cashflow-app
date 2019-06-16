import { Animated } from 'react-native'
import styled from 'styled-components/native'

export const Container = styled(Animated.View)`
  height: 60px;
  background-color: #282;
  padding-top: 5px;
`

export const TabsContainer = styled.ScrollView.attrs({
  horizontal: true,
  contentContainerStyle: { paddingLeft: 10, paddingRight: 20 },
  showsHorizontalScrollIndicator: false
})``

export const TabItem = styled.View`
  width: 70px;
  height: 50px;
  background:  ${props => props.selected ? '#FFF' : '#383'};
  border-radius: 3px;
  margin-left: 10px;
  padding: 6px;
  align-items: center;
  justify-content: space-between;
`

export const TabText = styled.Text`
  font-size: 10px;
  color: ${props => props.selected ? '#383' : '#FFF'};
  text-align: center;
`