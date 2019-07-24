import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { LIBRA_API_URL } from "./config";
import firebase from "./Firestore";
import lifecycle from "react-pure-lifecycle";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: "100%"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

var accountArr = [];

async function renderAccounts() {
  console.log("init ...fetch accounts from the libra test net");
  const db = firebase.firestore();

  const walletRef = db.collection("wallet");
  await walletRef.get().then(querySnapshot => {
    const data = querySnapshot.docs.map((doc, index) => {
      fetch(`${LIBRA_API_URL}/balance/${doc.data().address}`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
      })
        .then(function(response) {
          console.log(response);
          return response.json();
        })
        .then(function(data) {
          console.log(index);
          let accData = {
            id: index,
            address: doc.data().address,
            balance: data.balance,
            walletName: doc.data().walletName
          };
          console.log(accData.id);

          return accData;
        })
        .catch(error => {
          console.log(error);
        });
    });
    console.log(typeof data);
    accountArr = data;
  });
}

// create your lifecycle methods
const componentDidMount = props => {
  console.log("I mounted! Here are my props: ", props);
  renderAccounts();
};

// make them properties on a standard object
const methods = {
  componentDidMount
};

function Account(props) {
  const classes = useStyles();
  const libra_image = "https://bit.ly/2Gr7VSV";
  //const [accountList, setAccountList] = useState([]);
  console.log(accountArr.length);

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
          <ListSubheader component="div">Accounts</ListSubheader>
        </GridListTile>
        {accountArr.map(acc => (
          <GridListTile key={acc.id}>
            <img src={libra_image} alt={acc.walletName} />
            <GridListTileBar
              title={acc.walletName}
              subtitle={<span>by: {acc.address}</span>}
              actionIcon={
                <IconButton
                  aria-label={`info about ${acc.balance}`}
                  className={classes.icon}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default lifecycle(methods)(Account);
