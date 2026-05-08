require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./backend/.env" }); // or create .env at root

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: process.env.VITE_POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
