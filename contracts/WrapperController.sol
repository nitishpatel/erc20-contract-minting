// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


interface IERC20 {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
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
    uint256 orderId = 0;
    mapping (uint256 => uint256) public barNumberToBalances;
    
    // reassignment of barNumber and tokenbalances
    struct ReAssignment{
        uint256 oldBarNumber;
        uint256 newBarNumber;
        uint256 tokenBalance;
    }

    mapping (uint256 => ReAssignment) public reAssignments;

    constructor(address tokenAddress) {
        token = tokenAddress;
    }

    function mint(address to, uint256 amount,uint256 barNumber) public onlyOwner {
        IERC20(token).mint(to, amount);
        barNumberToBalances[barNumber] += amount;
    }

    function burn(uint256[] memory amount,uint256[] memory barNumber) public onlyOwner {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amount.length; i++) {
            totalAmount += amount[i];
            barNumberToBalances[barNumber[i]] -= amount[i];
        }
        console.log("totalAmount",totalAmount);
        IERC20(token).burn(address(this),totalAmount);

        // Reassignment of barNumber and tokenbalances
        for(uint256 i = 0; i<barNumber.length; i++){
            if (barNumberToBalances[barNumber[i]] < 1000){
                for(uint256 j = 0; j<barNumber.length; j++){
                   if(barNumber[i]!=barNumber[j]){
                        if(barNumberToBalances[barNumber[j]] < 1000){
                            barNumberToBalances[barNumber[i]] = barNumberToBalances[barNumber[i]] + barNumberToBalances[barNumber[j]];
                            reAssignments[orderId] = ReAssignment(barNumber[j],barNumber[i],barNumberToBalances[barNumber[j]]);
                            barNumberToBalances[barNumber[j]] = 0;
                            orderId++;
                        }
                   }
                }
            }
        }

    }
    function getReAssignment(uint256 orderNumber) public view returns (ReAssignment memory){
        return reAssignments[orderNumber];
    }
    function getBarBalance(uint256 barNumber) public view returns (uint256){
        return barNumberToBalances[barNumber];
    }
        
}