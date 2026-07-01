import React from 'react'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'

const AnimeCover = ({ posterSrc }) => {
  if(!posterSrc) {
    return (
      <div className='w-full h-[250px] object-cover rounded-sm' >
        <Skeleton className='w-full h-full' />
      </div>
    )
  }
  return (
    <Image
        className="w-full h-[250px] object-cover rounded-sm animated"
        src={posterSrc}
        alt="cover"
        width={1280}
        height={250}
      />
  )
}

export default AnimeCover