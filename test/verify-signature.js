const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Verify Signature", function () {
  it("Check Signature", async function () {
    const accounts = await ethers.getSigners(2);
    const VerifySignature = await ethers.getContractFactory("VerifySignature");
    const contract = await VerifySignature.deploy();
    await contract.deployed();

    const signer = accounts[0];
    const to = accounts[1].address;
    const amount = 999;
    const message = "Hello";
    const nonce = 123;

    const hash = await contract.getMessageHash(to, amount, message, nonce);
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));

    const ethHash = await contract.getEthSignedMessageHash(hash);
    console.log("Signer: ", signer.address);
    console.log(
      "Recovered Signer: ",
      await contract.recoverSigner(ethHash, signature)
    );

    expect(
      await contract.verify(
        signer.address,
        to,
        amount,
        message,
        nonce,
        signature
      )
    ).to.equal(true);

    expect(
      await contract.verify(
        signer.address,
        to,
        amount + 1,
        message,
        nonce,
        signature
      )
    ).to.equal(false);
  });
});
