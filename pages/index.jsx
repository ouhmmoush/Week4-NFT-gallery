import { useState } from 'react';
import { NFTCard } from "./components/nftCard";


const Home = () => {
  const [wallet, setWallet] = useState('');
  const [collection, setCollection] = useState('');
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const fetchNfts = async () => {
    let nfts;
    const apiKey = process.env.API_KEY
    const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTs/`;
    var requestOptions = {
      method: 'GET',
    };
    if (!collection.length) {
      console.log('Fetching nfts by owner');

      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log('Fetching nfts owend by address filtered by collection');
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log(nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNftsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET',
      };
      const apiKey = process.env.API_KEY
      const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&&withMetadata=${true}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log('NFts in collection', nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full items-center justify-center gap-y-2">
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => setWallet(e.target.value)} value={wallet} type="text" placeholder='Add your wallet address' />
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => setCollection(e.target.value)} value={collection} type="text" placeholder='Add the collection address' />
        <label className="text-gray-600 "><input className="mr-2" onChange={(e) => setFetchForCollection(e.target.checked)} type="checkbox" />Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={() => {
          if (fetchForCollection)
            fetchNftsForCollection()
          else fetchNfts()
        }}>Fetch</button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
