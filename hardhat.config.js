require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./backend/.env" }); 
require("dotenv").config({ path: "./.env" });

const pk = process.env.PRIVATE_KEY;
const formattedKey = pk && pk !== "your_metamask_private_key_here" 
  ? (pk.startsWith("0x") ? pk : `0x${pk}`) 
  : undefined;

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: process.env.VITE_POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology/",
      accounts: formattedKey ? [formattedKey] : [],
    },
  },
};
