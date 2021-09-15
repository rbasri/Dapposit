# Dapposit - a safer way to make your security deposit

This is an Escrow Dapp built with [Hardhat](https://hardhat.org/).

## Project Layout

There are four top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract
4. `/server` - contains a simple script to server static files built with parcel

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Front-End

To run the front-end application run `parcel app/index.html` from the root directory.

You can learn more about Parcel [here](https://parceljs.org/).
