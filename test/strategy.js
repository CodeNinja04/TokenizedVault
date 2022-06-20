const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const provider = waffle.provider;

const toWei = (value) => ethers.utils.parseEther(value.toString());

describe("Vault", function () {
    var account1;
    var account2;
    var proxy;
    var token;
    var token1;
    var addr;
    var addr1;
    var eth_dai;
    var tst;
    var tst1;
    var ETH_DAI;
    var DAI;
    var WETH;
    var LP;
    var Reward_Token;
    var quick;

    const amount1 = ethers.utils.parseEther("100");
    const amount2 = ethers.utils.parseEther("4");
    const amount3 = ethers.utils.parseEther("1");
    const amount4 = ethers.utils.parseEther("50");
    const amount5 = ethers.utils.parseEther("8");
    const acc = ethers.utils.getAddress("0x8d6b2dba9e85b897dc97ed262c1aa3e4d76477df")
    const weth = ethers.utils.getAddress('0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619');
    const dai = ethers.utils.getAddress('0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063');
    const eth_dai_lp = ethers.utils.getAddress('0x4a35582a710e1f4b2030a3f826da20bfb6703c09');
    const reward_token = ethers.utils.getAddress('0xf28164a485b0b2c90639e47b0f377b4a438a16b1');

    it("contracts deployed", async function () {
        //[account1, account2] = await ethers.getSigners();

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [acc],
        });

        account1 = await ethers.getSigner(acc);

        await network.provider.send("hardhat_setBalance", [
            acc,
            "0x10000000000000000000000000000000000000000000000000000000000",
        ]);

        console.log(account1.address);

        const Token = await ethers.getContractFactory("Token");

        WETH = Token.attach(weth);
        DAI = Token.attach(dai);
        LP=Token.attach(eth_dai_lp);
        
        token = await Token.connect(account1).deploy("token0", "TKN0", toWei(10000));
        await token.deployed();

        token1 = await Token.connect(account1).deploy("token1", "TKN1", toWei(10000));
        await token1.deployed();

        const Vault = await ethers.getContractFactory("VaultERC4626");

        const vault = await Vault.connect(account1).deploy();
        await vault.deployed();

        const Proxy = await ethers.getContractFactory("Factory");
        proxy = await Proxy.connect(account1).deploy(vault.address);
        await proxy.deployed();
    });

    it("deploy strategy" ,async function () {

        const Quick = await ethers.getContractFactory("QuickSwapFarmsStrategy");
        quick = Quick.connect(account1).deploy()
        await quick.deployed()

        console.log(quick)
        
    })



    it("vaults created", async function () {
        const tx = await proxy.connect(account1).createVault(token.address, "test", "TSTKN");
        const tx1 = await proxy.connect(account1).createVault(token1.address, "test1", "TSTKN1");
        await proxy.connect(account1).createVault(eth_dai_lp,"ETH-DAI-VAULT","TKNETHDAI");

        addr = await proxy.allVaults(0);
        addr1 = await proxy.allVaults(1);
        eth_dai=await proxy.allVaults(2);

        const Token = await ethers.getContractFactory("Token");

        console.log(await Token.attach(eth_dai).symbol());


        const ERC20Lib = await ethers.getContractFactory("VaultERC4626");
        tst = ERC20Lib.attach(addr);
        tst1 = ERC20Lib.attach(addr1);
        ETH_DAI=ERC20Lib.attach(eth_dai);

        await token1.approve(proxy.address, amount3);


        console.log("vault1 initial : ", await LP.balanceOf(eth_dai));
        console.log(" user initial : ", await LP.balanceOf(account1.address));
        console.log(
            " user vault initial : ",
            await ETH_DAI.balanceOf(account1.address)
        );
    });


    it("testing some functions", async function () {

    //    await LP.approve(account1.address,amount5); 
    //    await LP.transfer(account1.address,amount2);
    //    console.log("working trabnsfer")

        console.log(account1.address)
    })

    it("deposit function is working", async function () {

        await LP.connect(account1).approve(proxy.address, amount5);
        await LP.connect(account1).approve(account1.address, amount5);
        await LP.connect(account1).approve(eth_dai, amount5);

        // await LP.transfer(account1.address,amount2)
        // console.log("vault1 after transfer : ", await LP.balanceOf(eth_dai));

        console.log("now depositing")
        const tx3 = await proxy.connect(account1).depositVault(amount2, account1.address, 2);

        console.log("vault1 final : ", await LP.balanceOf(eth_dai));
        console.log(
            " user after deposit : ",
            await LP.balanceOf(account1.address)
        );
        console.log(
            "user  vault after deposit : ",
            await ETH_DAI.balanceOf(account1.address)
        );
    })

    it("Mint function working ", async function () {

        await LP.approve(proxy.address, amount2);
        await LP.approve(account1.address, amount2);
        await LP.approve(eth_dai, amount2);

        const tx4 = await proxy.mintVault(amount2, account1.address, 2);

        console.log(
            "vault1 after mint : ",
            (await LP.balanceOf(addr1)).toString()
        );
        console.log(
            "user after mint : ",
            (await LP.balanceOf(account1.address)).toString()
        );

        console.log(
            "user  vault after mint : ",
            (await ETH_DAI.balanceOf(account1.address)).toString()
        );

    })

    it("withdraw function is working", async function () {



        console.log(
            "vault1 before withdraw : ",
            (await LP.balanceOf(eth_dai)).toString()
        );


        const tx5 = await proxy.withdrawVault(
            amount2,
            account1.address,
            account1.address,
            2
        );

        console.log(
            "vault1 after withdraw final : ",
            (await LP.balanceOf(addr1)).toString()
        );
        console.log(
            "user after withdraw : ",
            (await LP.balanceOf(account1.address)).toString()
        );

        console.log(
            "user  vault after withdraw : ",
            (await ETH_DAI.balanceOf(account1.address)).toString()
        );
    })

    xit("redeem function working", async function () {
        const tx6 = await proxy.redeemVault(
            amount2,
            account1.address,
            account1.address,
            2
        );
        await tx6.wait();
        console.log(
            "vault1 after redeem final : ",
            (await LP.balanceOf(addr1)).toString()
        );
        console.log(
            "user after redeem : ",
            (await LP.balanceOf(account1.address)).toString()
        );

        console.log(
            "user  vault after redeem : ",
            (await tst1.balanceOf(account1.address)).toString()
        );
    });
});
