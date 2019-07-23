require("@babel/register")({
  presets: ["@babel/preset-env"]
});

import { LibraWallet, LibraClient } from "libra-core";

async function main() {
  const client = new LibraClient({ network: LibraNetwork.Testnet });
  const wallet = new LibraWallet({
    mnemonic:
      "lend arm arm addict trust release grid unlock exhibit surround deliver front link bean night dry tuna pledge expect net ankle process mammal great"
  });
  const account = wallet.newAccount();
  const account2Address =
    "854563c50d20788fb6c11fac1010b553d722edb0c02f87c2edbdd3923726d13f";
  const response = await client.transferCoins(account, account2Address, 1e6);

  // wait for transaction confirmation
  await response.awaitConfirmation(client);
}

main();
