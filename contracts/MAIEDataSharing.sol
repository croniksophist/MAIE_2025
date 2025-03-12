// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MAIEDataSharing {
    address public owner;

    struct Dataset {
        string name;
        string ipfsHash;
        address owner;
        uint256 price;
        bool available;
    }

    mapping(uint256 => Dataset) public datasets;
    mapping(address => uint256) public balances;
    uint256 public datasetCount;

    event DatasetAdded(uint256 datasetId, string name, address indexed owner, uint256 price);
    event DatasetPurchased(uint256 datasetId, address indexed buyer);

    constructor() {
        owner = msg.sender;
    }

    function addDataset(string memory _name, string memory _ipfsHash, uint256 _price) public {
        datasetCount++;
        datasets[datasetCount] = Dataset(_name, _ipfsHash, msg.sender, _price, true);
        emit DatasetAdded(datasetCount, _name, msg.sender, _price);
    }

    function purchaseDataset(uint256 _datasetId) public payable {
        Dataset storage dataset = datasets[_datasetId];
        require(dataset.available, "Dataset not available");
        require(msg.value >= dataset.price, "Insufficient funds");

        dataset.available = false;
        balances[dataset.owner] += msg.value;
        emit DatasetPurchased(_datasetId, msg.sender);
    }

    function withdrawFunds() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds available");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
