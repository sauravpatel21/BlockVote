const express = require("express");
const router = express.Router();
const { PinataSDK } = require("pinata-web3");
const DeletedCandidate = require("../models/DeletedCandidate");

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "dummy_jwt",
  pinataGateway: "moccasin-certain-takin-49.mypinata.cloud" // Adjust gateway if needed
});

router.post("/upload", async (req, res) => {
  const { name, party, age, photo, logo } = req.body;

  if (!name || !party) {
    return res.status(400).json({ message: "Name and Party are required" });
  }

  try {
    const metadata = {
      name,
      party,
      age: age || "Unknown",
      photo: photo || "",
      logo: logo || ""
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

// Route: Delete Candidate (Hybrid)
router.post("/delete", async (req, res) => {
  const { email, candidateId } = req.body;
  
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    await DeletedCandidate.findOneAndUpdate(
      { candidateId },
      { candidateId },
      { upsert: true }
    );
    res.json({ message: "Candidate deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete candidate." });
  }
});

// Route: Get Deleted Candidates (Public)
router.get("/deleted", async (req, res) => {
  try {
    const deleted = await DeletedCandidate.find({}, "candidateId");
    res.json(deleted.map(d => d.candidateId));
  } catch (error) {
    console.error("Fetch Deleted Error:", error);
    res.status(500).json({ message: "Failed to fetch deleted candidates." });
  }
});

module.exports = router;
