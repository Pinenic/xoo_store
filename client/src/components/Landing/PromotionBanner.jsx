import React from 'react'

export default function PromotionBanner(props) {
    

    return (
        <>
            <div className="flex border-2 h-72 w-[95%] m-auto rounded-2xl bg-blue-700 p-4 self-center mt-20">
                <div className="flex flex-col text-center justify-center w-1/2">
                    <h1 className='text-3xl text-white font-semibold '><b className='text-8xl'>30% </b> Off</h1>
                    <p className='text-white text-lg font-medium p-2 '>Exlusive deal Just for today</p>
                    <a href="#" className='border-2 rounded-xl bg-white w-32 p-2 text-blue-700 mt-4 md:mr-32 hover:bg-white/90 font-semibold self-center'>View Deal</a>
                </div>
                {/** the promotion image */}
                <div className='flex items-center w-1/2'>
                    <img src="https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/public/11/public-uploaded-image-1755688873441.jpg" alt="..." className='item-center m-auto my-auto rounded-lg h-64'/>
                </div>

            </div>
        </>
    )
}
