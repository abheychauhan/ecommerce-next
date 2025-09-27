import React from 'react'

function Loading() {
  return (
    <div className="w-full fixed h-screen bg-white "> <img src='/load/loading.gif' alt="Loading..." className="mx-auto w-full h-full object-cover absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 "/></div>
  )
}

export default Loading