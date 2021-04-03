pragma solidity >=0.6.0 <0.8.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract GTGSCollectible is ERC721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("GTGSCollectible", "GTGS") {
    _setBaseURI("http://localhost:3000/previews/");
  }

  address payable public constant artist = 0x34aA3F359A9D614239015126635CE7732c18fDF3; //austingriffith.eth for testing
  uint16 artistNumerator = 16;
  uint256 public royaltiesSent;

  uint256 public constant HARD_LIMIT = 10;

  uint256 public constant startingAt = 0.005 ether;
  uint16[HARD_LIMIT] public numerators = [
     1002,
     1004,
     1006,
     1008,
     1010,
     1012,
     1014,
     1018,
     1020,
     1024
  ];
  uint16 public constant denominator = 1000;

  mapping ( uint256 => uint256 ) public price;
  //mapping (uint256 => bytes32) public bytes32TokenURI;

  uint256[HARD_LIMIT] public inTheWild = [0,0,0,0,0,0,0,0,0,0];

  mapping ( address => mapping ( uint256 => uint256 ) ) public balance;

  event Mint(uint256 artwork,uint256 token, address indexed owner);

  event Burn(uint256 artwork,uint256 token, address indexed owner);


  function mint(uint256 artwork)
      public
      payable
      returns (uint256)
  {
    require(artwork<=HARD_LIMIT,"INVALID ARTWORK");

    _tokenIds.increment();
    uint256 id = _tokenIds.current();

  //  console.log("starting price",price[artwork]);

    price[artwork] = nextPrice(artwork);

//    console.log("NOW IT IS",price[artwork]);

    require( msg.value >= price[artwork], "Someone beat you to that price, try again.");

    _mint(msg.sender, id);
    balance[msg.sender][artwork]++;
    inTheWild[artwork-1]++;
    //bytes32TokenURI[id] = keccak256(abi.encodePacked(blockhash(block.number-1),msg.sender,id));
    _setTokenURI(id,string(abi.encodePacked(artwork)));

    emit Mint(artwork,id,msg.sender);
    return id;
  }

  function burn(uint256 artwork, uint256 id)
      public
      returns (uint256)
  {
    require(artwork<=HARD_LIMIT,"INVALID ARTWORK");

  //  console.log("price[artwork]",price[artwork]);

    uint256 royalties = uint256( price[artwork] * artistNumerator ) / denominator;
//    console.log("royalties",royalties);

    artist.transfer( royalties );
    royaltiesSent+=royalties;

  //  console.log("price[artwork] - royalties ",price[artwork] - royalties );

    msg.sender.transfer( price[artwork] - royalties );

    price[artwork] = prevPrice(artwork);

  //  console.log("NOW IT IS",price[artwork]);

    _burn(id);

    balance[msg.sender][artwork]--;
    inTheWild[artwork-1]--;

    emit Burn(artwork,id,msg.sender);

    return id;
  }

  function prices() public view returns (uint256[HARD_LIMIT] memory){
    return [
      nextPrice(1),
      nextPrice(2),
      nextPrice(3),
      nextPrice(4),
      nextPrice(5),
      nextPrice(6),
      nextPrice(7),
      nextPrice(8),
      nextPrice(9),
      nextPrice(10)
    ];
  }

  function burns() public view returns (uint256[HARD_LIMIT] memory){
    return [
      prevPrice(1),
      prevPrice(2),
      prevPrice(3),
      prevPrice(4),
      prevPrice(5),
      prevPrice(6),
      prevPrice(7),
      prevPrice(8),
      prevPrice(9),
      prevPrice(10)
    ];
  }

  function counts() public view returns (uint256[HARD_LIMIT] memory){
    return [
      inTheWild[0],
      inTheWild[1],
      inTheWild[2],
      inTheWild[3],
      inTheWild[4],
      inTheWild[5],
      inTheWild[6],
      inTheWild[7],
      inTheWild[8],
      inTheWild[9]
    ];
  }

  function balances(address yourAddress) public view returns (uint256[HARD_LIMIT] memory){
    return [
      balance[yourAddress][1],
      balance[yourAddress][2],
      balance[yourAddress][3],
      balance[yourAddress][4],
      balance[yourAddress][5],
      balance[yourAddress][6],
      balance[yourAddress][7],
      balance[yourAddress][8],
      balance[yourAddress][9],
      balance[yourAddress][10]
    ];
  }


  function nextPrice(uint256 id) public view returns (uint256){
    if(price[id]<=startingAt)
      return ( uint256(startingAt * numerators[id-1]) / denominator);
    else
      return ( uint256(price[id] * numerators[id-1]) / denominator);
  }

  function prevPrice(uint256 id) public view returns (uint256){
    if(price[id]<=startingAt) return startingAt;
    return ( uint256(price[id] * denominator) / numerators[id-1]);
  }



}
