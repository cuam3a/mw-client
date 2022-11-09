import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MyProvider from "./application/provider";
import NotificationsProvider from "./application/provider/notifications.provider";
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import Themes from "./application/theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={Themes.default}>
      <MyProvider>
        <NotificationsProvider>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </NotificationsProvider>
      </MyProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);