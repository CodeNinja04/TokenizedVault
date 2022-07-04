// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IUniversalOneSidedFarm {
    function poolLiquidity(
        address _userAddress, // startegy
        address _fromToken, // quick
        uint256 _fromTokenAmount, // quick amt
        address _pairAddress, // eth-dai-lp
        address _toToken, // any token from pair
        uint256 _slippageAdjustedMinLP // set to 1
    ) external payable returns (uint256);
}