// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChimeraFactory is ERC721, Ownable {

    // ----------- EVENTS -----------
    event GeneContributed(address indexed contributor, uint8 geneType, uint8 value);
    event Born(address indexed bornBy, uint256 timestamp);

    // ----------- STATE VARIABLES -----------
    mapping(uint8 => uint8) public dna;
    mapping(address => bool) public isContributor;
    mapping(address => bool) public hasMinted;
    bool public isBorn;
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    // ----------- CONSTRUCTOR -----------
    constructor() ERC721("Cyber Chimera", "DCHIM") Ownable(msg.sender) {}

    // ----------- WRITE FUNCTIONS -----------

    /**
     * @notice Contribute a gene. Replaces previous value for the same geneType.
     * @param geneType The type of gene to contribute, as per the spec.
     * @param value The value index for the gene, as per the spec.
     */
    function contribute(uint8 geneType, uint8 value) external {
        require(!isBorn, "Chimera already born.");
        // Basic validation for demo purposes
        require(geneType < 6, "Invalid gene type"); 
        require(value < 8, "Invalid gene value");

        dna[geneType] = value;
        if (!isContributor[msg.sender]) {
            isContributor[msg.sender] = true;
        }
        emit GeneContributed(msg.sender, geneType, value);
    }

    /**
     * @notice Finalize the Chimera's DNA, making it immutable. Only owner can call.
     */
    function birth() external onlyOwner {
        require(!isBorn, "Chimera already born.");
        isBorn = true;
        emit Born(msg.sender, block.timestamp);
    }

    /**
     * @notice Allows a verified contributor to mint one NFT after birth.
     */
    function mint() external {
        require(isBorn, "Chimera not born yet.");
        require(isContributor[msg.sender], "Not a contributor.");
        require(!hasMinted[msg.sender], "Already minted.");

        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, _nextTokenId);
        _nextTokenId++;
    }

    /**
     * @notice Set the base URI for all token metadata. Only owner can call.
     * @dev The URI should end with a forward slash '/'.
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    // ----------- READ FUNCTIONS -----------

    function getGene(uint8 geneType) external view returns (uint8) {
        return dna[geneType];
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}