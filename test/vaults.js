// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");
// const provider = waffle.provider;

// const toWei = (value) => ethers.utils.parseEther(value.toString());

// xdescribe("Vault", function () {
//   var account1;
//   var account2;
//   var proxy;
//   var token;
//   var token1;
//   var addr;
//   var addr1;
//   var tst;
//   var tst1;

//   const amount1 = ethers.utils.parseEther("100");
//   const amount2 = ethers.utils.parseEther("4");
//   const amount3 = ethers.utils.parseEther("1");
//   const amount4 = ethers.utils.parseEther("50");
//   const amount5 = ethers.utils.parseEther("8");

//   it("contracts deployed", async function () {
//     [account1, account2] = await ethers.getSigners();

//     const Token = await ethers.getContractFactory("Token");
//     token = await Token.deploy("token0", "TKN0", toWei(10000));
//     await token.deployed();

//     token1 = await Token.deploy("token1", "TKN1", toWei(10000));
//     await token1.deployed();

//     const Vault = await ethers.getContractFactory("VaultERC4626");

//     const vault = await Vault.deploy();
//     await vault.deployed();

//     const Proxy = await ethers.getContractFactory("Factory");
//     proxy = await Proxy.deploy(vault.address);
//     await proxy.deployed();
//   });

//   it("vaults created", async function () {
//     const tx = await proxy.createVault(token.address, "test", "TSTKN");
//     const tx1 = await proxy.createVault(token1.address, "test1", "TSTKN1");

//     addr = await proxy.allVaults(0);
//     addr1 = await proxy.allVaults(1);

//     console.log(addr1);
   

//     const ERC20Lib = await ethers.getContractFactory("VaultERC4626");
//      tst = ERC20Lib.attach(addr);
//      tst1 = ERC20Lib.attach(addr1);

//     await token1.approve(proxy.address, amount3);
 

//     console.log("vault1 initial : ", await token1.balanceOf(addr1));
//     console.log(" user initial : ", await token1.balanceOf(account1.address));
//     console.log(
//       " user vault initial : ",
//       await tst1.balanceOf(account1.address)
//     );
//   });


//   xit("testing some functions", async function() {

//     await token1.approve(addr1, amount4);
//     //await token1.transfer(addr1,amount5);
//     console.log(await tst1.totalAssets())


//   }) 

//   xit("deposit function is working", async function () {

//      await token1.approve(proxy.address, amount5);
//      await token1.approve(account1.address, amount5);
//      await token1.approve(addr1, amount5);

//     console.log("now depositing")
//     const tx3 = await proxy.depositVault(amount5, account1.address, 1);

//     console.log("vault1 final : ", await token1.balanceOf(addr1));
//     console.log(
//       " user after deposit : ",
//       await token1.balanceOf(account1.address)
//     );
//     console.log(
//       "user  vault after deposit : ",
//       await tst1.balanceOf(account1.address)
//     );})

//     it("Mint function working ", async function () {

//     await token1.approve(proxy.address, amount2);
//     await token1.approve(account1.address, amount2);
//     await token1.approve(addr1, amount2);

//     const tx4 = await proxy.mintVault(amount2, account1.address, 1);

//     console.log(
//       "vault1 after mint : ",
//       (await token1.balanceOf(addr1)).toString()
//     );
//     console.log(
//       "user after mint : ",
//       (await token1.balanceOf(account1.address)).toString()
//     );

//     console.log(
//       "user  vault after mint : ",
//       (await tst1.balanceOf(account1.address)).toString()
//     );

//   })

//   it("withdraw function is working", async function () {

  

//       console.log(
//       "vault1 before withdraw : ",
//       (await token1.balanceOf(addr1)).toString()
//     );


//     const tx5 = await proxy.withdrawVault(
//       amount2,
//       account1.address,
//       account1.address,
//       1
//     );

//     console.log(
//       "vault1 after withdraw final : ",
//       (await token1.balanceOf(addr1)).toString()
//     );
//     console.log(
//       "user after withdraw : ",
//       (await token1.balanceOf(account1.address)).toString()
//     );

//     console.log(
//       "user  vault after withdraw : ",
//       (await tst1.balanceOf(account1.address)).toString()
//     );
//   })

//   it("redeem function working", async function () {
//     const tx6 = await proxy.redeemVault(
//       amount2,
//       account1.address,
//       account1.address,
//       1
//     );
//     await tx6.wait();
//     console.log(
//       "vault1 after redeem final : ",
//       (await token1.balanceOf(addr1)).toString()
//     );
//     console.log(
//       "user after redeem : ",
//       (await token1.balanceOf(account1.address)).toString()
//     );

//     console.log(
//       "user  vault after redeem : ",
//       (await tst1.balanceOf(account1.address)).toString()
//     );
//   });
// });
