pragma solidity >=0.6.0 <0.8.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

contract GTGSCollectible is ERC721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 STARTING_PRICE = 0.01 ether;

  constructor() public ERC721("GTGSCollectible", "GTGS") {
    //_setBaseURI("http://localhost:3000/previews/");
    for(uint8 i=1;i<=10;i++){
      price[i]=STARTING_PRICE;
    }
  }

  address payable public constant artist = 0x34aA3F359A9D614239015126635CE7732c18fDF3; //austingriffith.eth for testing
  uint16 artistNumerator = 16;
  uint256 public royaltiesSent;

  uint256 public constant HARD_LIMIT = 10;

  uint256 public constant startingAt = 0.01 ether;
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
  mapping ( uint256 => bytes32 ) public tokenEntropy;
  mapping ( uint256 => uint256 ) public artworkOfToken;

  uint256[HARD_LIMIT] public inTheWild = [0,0,0,0,0,0,0,0,0,0];

  mapping ( address => mapping ( uint256 => uint256 ) ) public balance;

  event Stream(uint256 artwork,uint256 token, address indexed owner,uint256 amount,uint256 royalties, bytes32 entropy);

  function mint(uint256 artwork)
      public
      payable
      returns (uint256)
  {
    require(artwork<=HARD_LIMIT,"INVALID ARTWORK");
    require(artwork>=1,"INVALID ARTWORK");

    _tokenIds.increment();

    uint256 id = _tokenIds.current();

    //console.log("PRICE",price[artwork]);

    require( msg.value == price[artwork], "Price has changed, please try again.");

    price[artwork] = nextPrice(artwork);

    //console.log("PRICE IS NOW",price[artwork]);

    _mint(msg.sender, id);

    balance[msg.sender][artwork]++;

    inTheWild[artwork-1]++;

    artworkOfToken[id] = artwork;

    tokenEntropy[id] = keccak256(abi.encodePacked(blockhash(block.number-1),address(this),msg.sender,id,artwork));
    //_setTokenURI(id,string(abi.encodePacked(tokenEntropy[artwork])));

    emit Stream(artwork,id,msg.sender,msg.value,0,tokenEntropy[artwork]);
    return id;
  }

  function burn(uint256 artwork, uint256 id)
      public
      returns (uint256)
  {
    require(artwork<=HARD_LIMIT,"INVALID ARTWORK");
    require(artwork>=1,"INVALID ARTWORK");

    //console.log("starts at price[artwork]",price[artwork]);

    price[artwork] = prevPrice(artwork);

    //console.log("moves to price[artwork]",price[artwork]);

    uint256 royalties = uint256( price[artwork] * artistNumerator ) / denominator;
    //console.log("royalties",royalties);

    artist.transfer( royalties );
    royaltiesSent+=royalties;

    _burn(id);

    balance[msg.sender][artwork]--;

    delete tokenEntropy[id];

    inTheWild[artwork-1]--;

    emit Stream(artwork,id,msg.sender, price[artwork], royalties, 0x0000000000000000000000000000000000000000000000000000000000000000);
    //console.log("price[artwork] - royalties ",price[artwork] - royalties );

    msg.sender.transfer( price[artwork] - royalties );
    //console.log("NOW IT IS",price[artwork]);

    return id;
  }

  function prices() public view returns (uint256[HARD_LIMIT] memory){
    return [
      price[1],
      price[2],
      price[3],
      price[4],
      price[5],
      price[6],
      price[7],
      price[8],
      price[9],
      price[10]
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
    uint256 next = ( uint256(price[id] * numerators[id-1]) / denominator);
    if(next<STARTING_PRICE){
      return STARTING_PRICE;
    }
    return next;
  }

  function prevPrice(uint256 id) public view returns (uint256){
    return ( uint256(price[id] * denominator) / numerators[id-1]);
  }



}
