// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import {ERC20Lib} from "./utils/ERC20Lib.sol";
import {IERC4626} from "./utils/IERC4626.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Factory is ReentrancyGuard {
    using SafeERC20 for ERC20Lib;
    using SafeERC20 for IERC20;
    using Clones for address;
    using Counters for Counters.Counter;
    Counters.Counter private pid;

    address public vaultImplementation;

    constructor(address _vaultImplementation) {
        require(_vaultImplementation != address(0),"address is zero");
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

    event WithdrawVault(
        uint256 _amount,
        address indexed receiver,
        address owner,
        uint256 _pid
    );

    event MintVault(uint256 shares, address receiver, uint256 _pid);

    event RedeemVault(
        uint256 _amount,
        address indexed receiver,
        address owner,
        uint256 _pid
    );

    // create clones (minimal proxy eip 1167)
    // it deployes vaults using minimal proxy
    function createVault(
        IERC20 _asset,
        string memory name,
        string memory symbol
    ) external nonReentrant returns (address clone) {
        bytes32 salt = keccak256(
            abi.encodePacked(_asset, name, symbol, msg.sender)
        );

        clone = Clones.cloneDeterministic(vaultImplementation, salt);

        IERC4626(clone).init(msg.sender, name, symbol, 10000e18);
        IERC4626(clone).initialize(_asset);

        getVault[pid.current()] = clone;
        pid.increment();
        allVaults.push(clone);

        emit VaultCreated(clone, address(_asset), name, symbol);

        return clone;
    }

    // used to deposit assets to vauls via factory using _pid
    function depositVault(
        uint256 _amount,
        address receiver,
        uint256 _pid
    ) external nonReentrant returns (uint256 shares) {
        require(_amount > 0, "amount is less than 0");

        bool s1 = IERC20(IERC4626(getVault[_pid]).asset()).approve(
            receiver,
            _amount
        );
        bool s2 = IERC20(IERC4626(getVault[_pid]).asset()).approve(
            getVault[_pid],
            _amount
        );

        bool s3 = IERC20(IERC4626(getVault[_pid]).asset()).approve(
            address(this),
            _amount
        );

        bool s4 = IERC20(IERC4626(getVault[_pid]).asset()).transferFrom(
            msg.sender,
            address(this),
            _amount
        ); // transfer asset from user to proxy

        shares = IERC4626((address(getVault[_pid]))).deposit(_amount, receiver); // trnasfer of asset from proxy to vault

        emit Depositvault(msg.sender, _pid, _amount);
    }

    function withdrawVault(
        uint256 _amount,
        address receiver,
        address owner,
        uint256 _pid
    ) external nonReentrant returns (uint256 shares) {
        require(_amount > 0, "amount is less than 0");

        shares = IERC4626((address(getVault[_pid]))).withdraw(
            _amount,
            receiver,
            owner
        );

        emit WithdrawVault(_amount, receiver, owner, _pid);
    }

    function mintVault(
        uint256 shares,
        address receiver,
        uint256 _pid
    ) external nonReentrant returns (uint256 _assets) {
        require(shares > 0, "amount is less than 0");

        uint256 assets = IERC4626((address(getVault[_pid]))).previewMint(
            shares
        );

        bool s1 = IERC20(IERC4626(getVault[_pid]).asset()).approve(
            receiver,
            shares
        );
        bool s2 = IERC20(IERC4626(getVault[_pid]).asset()).approve(
            getVault[_pid],
            assets
        );

        bool s3 = IERC20(IERC4626(getVault[_pid]).asset()).transferFrom(
            msg.sender,
            address(this),
            assets
        );

        _assets = IERC4626((address(getVault[_pid]))).mint(shares, receiver);

        emit MintVault(shares, receiver, _pid);
    }

    function redeemVault(
        uint256 _amount,
        address receiver,
        address owner,
        uint256 _pid
    ) external nonReentrant returns (uint256 shares) {
        require(_amount > 0, "amount is less than 0");
        shares = IERC4626((address(getVault[_pid]))).withdraw(
            _amount,
            receiver,
            owner
        );

        emit RedeemVault(_amount, receiver, owner, _pid);
    }
}