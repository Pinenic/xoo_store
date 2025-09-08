import React from 'react'
import Carousel from '../components/Carousel.jsx'
import books from '../assets/images/books.png'
import elecs from '../assets/images/elecs.png'
import fashion from '../assets/images/fashion.png'
import toys from '../assets/images/toys.png'
import HomeG from '../assets/images/HomeG.png'
import ProductCard from '../components/ProductCard.jsx'
import useProducts from '../hooks/useProducts.js'

export default function Home(props) {
    const {products, loading, error} = useProducts(6);

    return (
        <>
            <div className="flex flex-col max-w-screen min-h-screen bg-white">
            <div className="flex h-8 mx-auto px-4 sm:px-8">
                <ul className="flex flex-wrap gap-4 sm:gap-8 text-xs sm:text-sm mt-1">
                    <li><a href="#">Electronics</a></li>
                    <li><a href="#">Fashion</a></li>
                    <li><a href="#">Home & Garden</a></li>
                    <li><a href="#">Toys & Games</a></li>
                    <li><a href="#">Books</a></li>
                </ul>
            </div>
            <Carousel />
            <div className="flex-1 flex flex-col  justify-center px-4 sm:px-8 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-pine-primary">Browse by category</h2>
                    <ul className='flex flex-wrap gap-8 p-8 items-center justify-evenly'>
                        <li><img src={elecs} alt="elecs" className='w-32 rounded' /></li>
                        <li><img src={fashion} alt="fashion" className='w-32 rounded' /></li>
                        <li><img src={toys} alt="toys" className='w-32 rounded' /></li>
                        <li><img src={HomeG} alt="HomeG" className='w-32 rounded' /></li>
                        <li><img src={books} alt="books" className='w-32 rounded' /></li>
                    </ul>
            </div>
        
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 text-center mt-16">
                <h2 className="text-xl sm:text-2xl font-semibold text-pine-primary text-left">Featured Products</h2>
                <ul className="flex gap-4">
                    {products.map((product)=>(
                    <li>
                        <ProductCard product={product}/>
                    </li>))}
                </ul>
            </div>
        
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-pine-primary">Latest Arrivals</h2>
                <p className="text-sm sm:text-gray-600 mt-2">Discover the freshest additions to our pineapple collection.</p>
            </div>
        </div>           
        </>
    )
}
