import React from 'react'

const  page =async ({params}) => {

    const slug = (await params).slug
    console.log("slug",slug)
    return (
    <div>
      <h1>{slug}</h1>
    </div>
  )
}

export default page
