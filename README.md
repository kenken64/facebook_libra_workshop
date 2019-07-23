## NUSISS - Facebook Libra Workshop

### Command line Interface

Generate Libra account

```
libra% account create
```

Listing all the created Libra account

```
libra% account list
```

Query the account balance from the Libra blockchain network
0 is the index of the generated account

```
libra% query balance 0
```

Mint or mine out the libra from the testnet
0 is the index of the generated account

```
libra% account mint 0 110
```

Transfer libra from one account to another

```
libra% transfer 0 1 10
```
