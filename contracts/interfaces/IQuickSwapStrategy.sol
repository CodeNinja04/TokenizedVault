pragma solidity ^0.8.4;

interface IQuickSwapStrategy {

function deposit(address _token, uint256 _amount) external returns (uint256);

function withdraw(address _token, uint256 _amount) external returns (uint256);





}