import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import skeleton from "../../../public/images/car-skeleton.png"

const LoadingUi = () => {
  return (
    <div>
       <div className="max-w-[calc(100%-18rem)] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Skeleton className="h-48 w-full">
                <img src={skeleton}/>
                </Skeleton>
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingUi
