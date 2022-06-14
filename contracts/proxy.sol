// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";

import {Vault} from "./ERC4626.sol";
import {ERC20Lib} from "./utils/ERC20Lib.sol";

import "./utils/IERC4626.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import {FixedPointMathLib} from "./utils/FixedPointMathLib.sol";

contract Factory is ReentrancyGuard {
    using SafeERC20 for ERC20Lib;
    using SafeERC20 for ERC20;
    using FixedPointMathLib for uint256;
    using Clones for address;
    using Counters for Counters.Counter;
    using Address for address;
    Counters.Counter private pid;

    address public vaultImplementation;

    constructor(address _vaultImplementation) {
        vaultImplementation = _vaultImplementation;
    }

    mapping(uint256 => address) public getVault;

    address[] public allVaults;

    event VaultCreated(
        address indexed addr,
        address indexed asset,
        string name,
        string symbol
    );

    event Depositvault(
        address indexed caller,
        uint256 indexed _pid,
        uint256 assets
    );

    // create clones (minimal proxy eip 1167)
    // it deployes vaults using minimal proxy
    function createVault(
        ERC20 _asset,
        string memory name,
        string memory symbol
    ) public returns (address clone) {
        bytes32 salt = keccak256(
            abi.encodePacked(_asset, name, symbol, msg.sender)
        );

        clone = Clones.cloneDeterministic(vaultImplementation, salt);

        IERC4626(clone).init(msg.sender, name, symbol, 10000e18);
        IERC4626(clone).initialize(_asset);

        getVault[pid.current()] = clone;
        pid.increment();
        allVaults.push(clone);

        emit VaultCreated(clone,address(_asset),name,symbol);

        return clone;
    }

    // used to deposit assets to vauls via factory using _pid
    function depositVault(
        uint256 _amount,
        address receiver,
        uint256 _pid
    ) public payable {
        require(_amount > 0, "amount is less than 0");

        ERC20(IERC4626(getVault[_pid]).asset()).approve(receiver, _amount);
        ERC20(IERC4626(getVault[_pid]).asset()).approve(
            getVault[_pid],
            _amount
        );

        ERC20(IERC4626(getVault[_pid]).asset()).approve(address(this), _amount);

        ERC20(IERC4626(getVault[_pid]).asset()).transferFrom(
            msg.sender,
            address(this),
            _amount
        ); // transfer asset from user to proxy

        IERC4626((address(getVault[_pid]))).deposit(_amount, receiver); // trnasfer of asset from proxy to vault

        emit Depositvault(msg.sender, _pid, _amount);
    }

    function withdrawVault(
        uint256 _amount,
        address receiver,
        address owner,
        uint256 _pid
    ) public  {
    
    
    IERC4626((address(getVault[_pid]))).withdraw(_amount, receiver, owner);

        
    }

    function mintVault(
        uint256 shares,
        address receiver,
        uint256 _pid
    ) public payable {
        uint256 assets = IERC4626((address(getVault[_pid]))).previewMint(
            shares
        );

        console.log(
            "mint",
            IERC4626((address(getVault[_pid]))).previewMint(shares)
        );

        ERC20(IERC4626(getVault[_pid]).asset()).approve(receiver, shares);
        ERC20(IERC4626(getVault[_pid]).asset()).approve(getVault[_pid], assets);
       
        
        // console.log(all);
        ERC20(IERC4626(getVault[_pid]).asset()).transferFrom(
            msg.sender,
            address(this),
            assets
        );
       

        IERC4626((address(getVault[_pid]))).mint(shares, receiver);
    }



function redeemVault(  uint256 _amount,
        address receiver,
        address owner,uint256 _pid) public {

             IERC4626((address(getVault[_pid]))).withdraw(_amount, receiver, owner);

        }
    receive() external payable {}
}
