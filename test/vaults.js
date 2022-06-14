const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const provider = waffle.provider;

const toWei = (value) => ethers.utils.parseEther(value.toString());

describe("Vault", function () {
  let account1;
  let account2;
  it("Should return the new greeting once it's changed", async function () {
    [account1, account2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("token0", "TKN0", toWei(10000));
    await token.deployed();

    const token1 = await Token.deploy("token1", "TKN1", toWei(10000));
    await token1.deployed();

    console.log("token address", token.address);
    console.log("token address", token1.address);

    const Vault = await ethers.getContractFactory("Vault");

    const vault = await Vault.deploy();
    await vault.deployed();

    console.log(vault.address);

    const Proxy = await ethers.getContractFactory("factory");
    const proxy = await Proxy.deploy(vault.address);
    await proxy.deployed();

    console.log("fatory address", proxy.address);

    console.log(await proxy.vaultImplementation());

    const tx = await proxy.createVault(token.address, "test", "TSTKN");
    await tx.wait();

    const tx1 = await proxy.createVault(token1.address, "test1", "TSTKN1");
    await tx1.wait();

    console.log("vault1 :", await proxy.allVaults(0));
    console.log("vault2 :", await proxy.allVaults(1));

    const amount1 = ethers.utils.parseEther("100");
    const amount2 = ethers.utils.parseEther("4");
    const amount3 = ethers.utils.parseEther("8");
    const amount4 = ethers.utils.parseEther("500");

    const addr = await proxy.allVaults(0);
    const addr1 = await proxy.allVaults(1);
    console.log("vault0 addr", addr);
    console.log("vault1 addr", addr1);

    const ERC20Lib = await ethers.getContractFactory("Vault");
    const tst = ERC20Lib.attach(addr);
    const tst1 = ERC20Lib.attach(addr1);

    //console.log("vault0 initial : ", await token.balanceOf(addr));

    // await token.approve(account1.address, amount1);
    // await token.approve(addr, amount1);

    // await token.approve(proxy.address, amount1);

    // await tst.deposit(amount2, account1.address);

    // console.log("vault0 final : ", await token.balanceOf(addr));

    // console.log("vault1 initial : ", await token1.balanceOf(addr1));

    // await tst1.deposit(amount2, account1.address);

    // console.log("vault1 final : ", await token1.balanceOf(addr1));

    // console.log(
    //   "balance + share of account1 in vault0",
    //   await tst.balanceOf(account1.address)
    // );

    await token1.approve(proxy.address, amount3);
    // await token1.approve(account1.address, amount3);
    // await token1.approve(addr1, amount3);
    console.log("");
    console.log("");
    console.log("");

    console.log("vault1 initial : ", await token1.balanceOf(addr1));
    console.log(" user initial : ", await token1.balanceOf(account1.address));
    console.log(
      " user vault initial : ",
      await tst1.balanceOf(account1.address)
    );
    //await tst.mint(amount2, account1.address);

    const tx3 = await proxy.depositVault(amount3, account1.address, 1);
    //const tx3 = await proxy.mintVault(amount2, account1.address, 1);

    await tx3.wait();

    console.log("vault1 final : ", await token1.balanceOf(addr1));
    console.log(
      " user after deposit : ",
      await token1.balanceOf(account1.address)
    );
    console.log(
      "user  vault after deposit : ",
      await tst1.balanceOf(account1.address)
    );

    // console.log("vault1 final : ", await token1.balanceOf(addr1));

    // //const tx3 = await proxy.depositVault(amount2, account1.address, 1);
    // console.log("account1 balance", await token1.balanceOf(account1.address));

    await token1.approve(proxy.address, amount4);
    await token1.approve(account1.address, amount4);
    await token1.approve(addr1, amount4);

    const tx4 = await proxy.mintVault(amount2, account1.address, 1);

    await tx4.wait();

    console.log("vault1 after mint : ", await token1.balanceOf(addr1));
    console.log("user after mint : ", await token1.balanceOf(account1.address));

    console.log(
      "user  vault after mint : ",
      await tst1.balanceOf(account1.address)
    );

    await tst1.withdraw(amount2, account1.address, account1.address);
    const tx5 = await proxy.withdrawVault(
      amount2,
      account1.address,
      account1.address,
      1
    );
    await tx5.wait();
    console.log(
      "vault1 after withdraw final : ",
      await token1.balanceOf(addr1)
    );
    console.log(
      "user after withdraw : ",
      await token1.balanceOf(account1.address)
    );

    console.log(
      "user  vault after withdraw : ",
      await tst1.balanceOf(account1.address)
    );


     const tx6 = await proxy.redeemVault(
       amount2,
       account1.address,
       account1.address,
       1
     );
     await tx6.wait();
     console.log(
       "vault1 after redeem final : ",
       await token1.balanceOf(addr1)
     );
     console.log(
       "user after redeem : ",
       await token1.balanceOf(account1.address)
     );

     console.log(
       "user  vault after redeem : ",
       await tst1.balanceOf(account1.address)
     );

    //console.log(proxy)
  });
});
