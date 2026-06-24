import React from 'react'
import Link from 'next/link'
import Book_Delivery from '../book_delivery/page'

const Header = () => {
  return (
    <div>

        <div className='w-full flex flex-row justify-start items-center gap-0 md:gap-10'>
            <img src="/LogiTrackLogo.png" alt="Logo" className='w-35 md:w-50' />
            <div className="h-px w-300 bg-white"></div>
        </div>

        <div className='w-full flex flex-col p-2'>
            <h1 className='text-lg md:text-xl'>Welcome back, </h1>
            <div className='w-full flex flex-row justify-start items-center border-t border-b border-white py-2 mt-5 text-md md:text-lg'>
                <ul className='flex gap-6'>
                    <li><Link href="/">Track</Link></li>
                    <li><Link href="/book_delivery">Book Delievery</Link></li>
                </ul>
            </div>
        </div>
    </div>
    
  )
}

export default Header
