import {ethers} from 'ethers'
import {useState} from 'react'
import Web3Modal from 'web3modal'
import {create as ipfsHttpClient} from 'ipfs-http-client'      
import { nftaddress, nftmarketaddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import {useRouter} from 'next/router'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'

// in this component we set the ipfs up to host our nft data of
// file storage 

// const projectId = '2A2zqFMq2ksMxLBy925BYrPptMn';
// const projectSecret = 'f1645ca43cc626a9a78325327a0d53d4';

// const client = {
//     host: 'ipfs.infura.io',
//     port: 5001,
//     path: '/api/v0/pin/add?arg=QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn',
//     method: 'POST',
//     auth: projectId + ':' + projectSecret,
// };

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function MintItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({price: '', name:'',
description:'', merek:''})
    const router = useRouter()


    // set up a function to fireoff when we update files in our form - we can add our 
    // NFT images - IPFS

    async function onChange(e) {
        const file = e.target.files[0]
        try {
        const added = await client.add(
            file, {
                progress: (prog) => console.log(`received: ${prog}`)
            })
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file:', error)
        }
    }

    async function createMarket() {
        const {name, description, price, merk} = formInput 
        if(!name || !description || !price || !fileUrl) return 
        // upload to IPFS
        const data = JSON.stringify({
            name, description, merk, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            // run a function that creates sale and passes in the url 
            createSale(url)
            } catch (error) {
                console.log('Error uploading file:', error)
            }
    }

    async function createSale(url) {
        // create the items and list them on the marketplace
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        // we want to create the token
        // console.log("Test0", url)
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        // console.log("Test01", signer)
        let transaction = await contract.mintToken(url)
        // console.log("Test1")
        let tx = await transaction.wait()
        // console.log("Test2")
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        
        // list the item for sale on the marketplace 
        contract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {value: listingPrice})
        await transaction.wait()
        router.push('./')
    }

    return (
        <div className='flex justify-center'>
            <div className='w-1/2 flex flex-col pb-12'>
                <input
                placeholder='Nama Produk'
                className='mt-8 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, name: e.target.value})} 
                />
                <input
                placeholder='Komoditas'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, komoditas: e.target.value})} 
                />
                <select className='mt-2 border rounded p-4' 
                onChange={ e => updateFormInput({...formInput, merk: e.target.value})} 
                >
                    <option value="">Pilih Merk</option>
                    <option value="merek 1">Merek 1</option>
                    <option value="merek 2">Merek 2</option>
                </select>    
                <input
                placeholder='Penyedia'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, penyedia: e.target.value})} 
                />   
                <input
                placeholder='No Produk (penyedia)'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, no_produk: e.target.value})} 
                />     
                <select className='mt-2 border rounded p-4' 
                onChange={ e => updateFormInput({...formInput, jenis_produk: e.target.value})} 
                >
                    <option>Lokal</option>
                    <option>Import</option>
                </select>     
                <select className='mt-2 border rounded p-4' 
                onChange={ e => updateFormInput({...formInput, unit_pengukuran: e.target.value})} 
                >
                    <option>Pilih Semua</option>
                    <option>pengukuran 1</option>
                    <option>pengukuran 2</option>
                </select>  
                <input
                placeholder='Berlaku Sampai'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, berlaku_sampai: e.target.value})} 
                />      
                <input
                placeholder='Jumlah Stock Produk'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, stock_produk: e.target.value})} 
                />      
                <input
                placeholder='Jumlah Stock Inden'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, stock_inden: e.target.value})} 
                />          
                <select className='mt-2 border rounded p-4' 
                onChange={ e => updateFormInput({...formInput, unit_pengukuran: e.target.value})} 
                >
                    <option>Pilih Kategori Produk</option>
                    <option>kategori 1</option>
                    <option>kategori 2</option>
                </select>    
                <input
                placeholder='TKDN(%)'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, tkdn: e.target.value})} 
                />                                        
                <textarea
                placeholder='Product Description'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, description: e.target.value})} 
                />
                <input
                placeholder='Product Price in Eth'
                className='mt-2 border rounded p-4'
                onChange={ e => updateFormInput({...formInput, price: e.target.value})} 
                />
                <input
                type='file'
                name='Asset'
                className='mt-4'
                onChange={onChange} 
                /> {
                fileUrl && (
                    <img className='rounded mt-4' width='350px' src={fileUrl} />
                )}
                <button onClick={createMarket}
                className='font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg'
                >
                    Save Product
                </button>
            </div>
        </div>
    )

}