import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" }); 
dotenv.config({ path: "./.env" });

export default {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: process.env.VITE_POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
