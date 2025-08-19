import React from 'react'

export default function ProductCard({product}) {
    

    return (
        <>
            <div className="flex flex-col text-left w-48 h-72 p-4 gap-3 cursor-pointer hover:bg-pine-highlight/10 rounded-lg">
                <img src={product.thumbnail} alt={product.title} className='rounded-lg bg-pine-highlight/30'/>
                <h3 className='text-md overflow-hidden line-clamp-2 h-16' >
                    {product.title}
                </h3>
                <p className='font-semibold'>K {product.price}</p>
            </div>
        </>
    )
}
