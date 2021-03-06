import '../styles/globals.css'
import './app.css'
import Link from 'next/link'

function EkatalogMarketplace({Component, pageProps}) {
  return (
    <div>
      <nav className='border-b p-6' style={{backgroundColor:'gray'}}>
        <p className='text-4x1 font-bold text-white'>E-Catalog</p>
        <div className='flex mt-4 justify-center'>
          <Link href='/'>
            <a className='mr-4'>
              Auditor
            </a>
          </Link>
          <Link href='/mint-item'>
            <a className='mr-6'>
              Create Product
            </a>
          </Link>
          <Link href='/my-nfts'>
            <a className='mr-6'>
              Produk Tayang
            </a>
          </Link>
          <Link href='/account-dashboard'>
            <a className='mr-6'>
              Akun Penyedia
            </a>
          </Link>
          </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default EkatalogMarketplace 