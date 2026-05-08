const express = require("express");
const router = express.Router();
const { PinataSDK } = require("pinata-web3");

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "dummy_jwt",
  pinataGateway: "moccasin-certain-takin-49.mypinata.cloud" // Adjust gateway if needed
});

router.post("/upload", async (req, res) => {
  const { name, party, image } = req.body;

  if (!name || !party) {
    return res.status(400).json({ message: "Name and Party are required" });
  }

  try {
    const metadata = {
      name,
      party,
      image: image || ""
    };

    const uploadResponse = await pinata.upload.json(metadata);
    
    res.json({
      message: "Uploaded to IPFS successfully",
      ipfsHash: uploadResponse.IpfsHash
    });
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    res.status(500).json({ message: "Failed to upload metadata to IPFS" });
  }
});

module.exports = router;
