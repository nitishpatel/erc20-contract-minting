// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";


interface IERC20 {
    function mint(address to, uint256 amount) external;
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract WrapperController is Ownable {
    address public token;
    string public barNumber;
    string public warrantNumber;
    constructor(address tokenAddress) {
        token = tokenAddress;
    }

    function mint(address to, uint256 amount,string memory _barNumber,string memory _warrantNumber) public onlyOwner {
        IERC20(token).mint(to, amount);
        barNumber = _barNumber;
        warrantNumber = _warrantNumber;
    }

}