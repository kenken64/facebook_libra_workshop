import React, { useState } from "react";
import {
  makeStyles,
  Typography,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction
} from "@material-ui/core";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AccountBalanceWalletRoundedIcon from "@material-ui/icons/AccountBalanceWalletRounded";
import WavesIcon from "@material-ui/icons/Waves";
import AttachedMoneyIcon from "@material-ui/icons/AttachMoney";
import { withStyles } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { red, amber } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import Transfer from "./apps/Transfer";
import Account from "./apps/Account";
import Mint from "./apps/Mint";
import GenerateWallet from "./apps/GenerateWallet";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  toolbarButtons: {
    marginLeft: "auto"
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0
  },
  content: {
    maxHeight: "100%",
    overflow: "hidden"
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: amber
  },
  typography: {
    useNextVariants: true
  }
});

function App() {
  const classes = useStyles();
  const [value, setValue] = useState("account");
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleChange(event, newValue) {
    console.log(newValue);
    setValue(newValue);
  }

  function SelectPage(props) {
    let index = props.selectedPage;
    let selectedPageRender = null;
    console.log(index);
    if (index === "transfer") {
      selectedPageRender = <Transfer />;
    }

    if (index === "account") {
      selectedPageRender = <Account />;
    }

    if (index === "mint") {
      selectedPageRender = <Mint />;
    }

    return selectedPageRender;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              fontWeight="fontWeightMedium"
              color="inherit"
            >
              Libra Workshop
            </Typography>
            <div className={classes.toolbarButtons}>
              <IconButton
                color="secondary"
                className={classes.button}
                aria-label="Add new wallet"
                onClick={handleClickOpen}
              >
                <AccountBalanceWalletRoundedIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <GenerateWallet open={open} handleClose={handleClose} />

        <Grid
          container
          spacing={1}
          direction="row"
          justify="center"
          alignItems="stretch"
        >
          <SelectPage selectedPage={value} />
          <BottomNavigation
            value={value}
            onChange={handleChange}
            className={classes.stickToBottom}
          >
            <BottomNavigationAction
              label="Account"
              value="account"
              icon={<AccountBalanceIcon />}
            />
            <BottomNavigationAction
              label="Transfer"
              value="transfer"
              icon={<AttachedMoneyIcon />}
            />
            <BottomNavigationAction
              label="Mint"
              value="mint"
              icon={<WavesIcon />}
            />
          </BottomNavigation>
        </Grid>
      </div>
    </MuiThemeProvider>
  );
}

export default withStyles(useStyles, { withTheme: true })(App);
