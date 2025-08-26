import React from 'react'
import FilterBar from './filterBar.jsx'
import {ShoppingBag, HeartPulse, Store} from 'lucide-react'
// styles for the component
import '../styles/components.modules.css'

export default function SideNav(props) {
    

    return (
        <>
            <div className="flex flex-col w-48 max-h-screen py-6">
               <div className='flex flex-col justify-between w-full h-48 bg-white shadow-md rounded-lg mb-4'>
                <p> shopping categories will come here</p>

               </div>
                <div className='flex flex-col w-full bg-white shadow-md rounded-lg mb-4 text-left p-2 text-sm text-pine-primary'>
                    <p className='p-1 rounded hover:bg-pine-bg cursor-pointer'> My Store</p>
                    <p className='p-1 rounded hover:bg-pine-bg cursor-pointer'>Recent orders</p>
                </div>
                <div className='flex flex-col w-full h-32 bg-white shadow-md rounded-lg mb-4 text-left p-2 text-sm text-pine-primary'>
                    <p className='flex p-1 rounded hover:bg-pine-bg cursor-pointer'>
                        <ShoppingBag className='w-4 h-4  mr-2'/> Shopping Bag</p>
                    <p className=' flex p-1 rounded hover:bg-pine-bg cursor-pointer'>
                    <Store className='w-4 h-4  mr-2'/> Stores followed</p>
                    <p className='flex p-1 rounded hover:bg-pine-bg cursor-pointer'>
                    <HeartPulse className='w-4 h-4  mr-2'/> My Wishlist</p>
                </div>
            </div>
        </>
    )
}
