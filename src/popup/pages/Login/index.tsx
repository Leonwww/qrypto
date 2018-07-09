import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Paper, Select, MenuItem, Typography, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';

import styles from './styles';
import NavBar from '../../components/NavBar';
import PasswordInput from '../../components/PasswordInput';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class Login extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentDidMount() {
    this.props.store.loginStore.init();
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.headerContainer}>
          <NavBar hasNetworkSelector isDarkTheme title="Login" />
          <AccountSection onCreateWalletClick={this.onCreateWalletClick} {...this.props} />
        </Paper>
        <PermissionSection {...this.props} />
        <LoginSection onLoginClick={this.onLoginClick} {...this.props} />
      </div>
    );
  }

  private onCreateWalletClick = () => {
    this.props.history.push('/create-wallet');
    this.props.store.createWalletStore.rerouteToLogin = false;
  }

  private onLoginClick = () => {
    const { history, store: { walletStore, loginStore } } = this.props;

    walletStore.loading = true;
    setTimeout(() => {
      loginStore.login();
      history.push('/home');
    }, 100);
  }
}

const AccountSection = observer(({ classes, store: { walletStore: { accounts }, loginStore }, onCreateWalletClick }: any) => (
  <div className={classes.accountContainer}>
    <Typography className={classes.selectAcctText}>Select account</Typography>
    <Select
      disableUnderline
      className={classes.accountSelect}
      name="accounts"
      value={loginStore.selectedWalletName}
      onChange={(e) => loginStore.selectedWalletName = e.target.value}
    >
      {accounts.map((acct: Account, index: number) => <MenuItem key={index} value={acct.name}>{acct.name}</MenuItem>)}
    </Select>
    <div className={classes.createAccountContainer}>
      <Typography className={classes.orText}>or</Typography>
      <Button className={classes.createAccountButton} color="secondary" onClick={onCreateWalletClick}>
        Create New Wallet
      </Button>
    </div>
  </div>
);

const PermissionSection = ({ classes }: any) => (
  <div className={classes.permissionContainer}>
    <Typography className={classes.permissionsHeader}>Permissions</Typography>
  </div>
);

const LoginSection = observer(({ classes, store: { loginStore }, onLoginClick }: any) => (
  <div className={classes.loginContainer}>
    <PasswordInput
      classNames={classes.passwordField}
      placeholder="Password"
      onChange={(e: any) => loginStore.password = e.target.value}
    />
    <Button
      className={classes.loginButton}
      fullWidth
      variant="contained"
      color="primary"
      disabled={isEmpty(loginStore.password)}
      onClick={onLoginClick}
    >
      Login
    </Button>
  </div>
));
