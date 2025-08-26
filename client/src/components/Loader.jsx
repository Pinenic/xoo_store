import { Spinner } from 'flowbite-react'
import React from 'react'

export default function Loader(props) {
    

    return (
        <>
        <div className="flex border-2 h-full items-center">

        <div className="flex items-center h-fit w-fit  mx-[50%]">
            <Spinner size='xl' color='info'/>
        </div>
        </div>
            
        </>
    )
}
