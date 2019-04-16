import { createMuiTheme } from '@material-ui/core/styles'

export const Colors = {
  AppGreen: '#4b9372',
  AppGreenDark: '#34664f',
  AppRed: '#bb2222'
}

export const AppTheme = createMuiTheme({
  palette: {
    primary: { main: Colors.AppGreen },
    secondary: { main: Colors.AppRed }
  }
})
