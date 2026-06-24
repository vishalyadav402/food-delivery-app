import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Master = ({children}) => {
  return (
    <div>
    <Header/>
    <div className='min-h-[75vh]'>
    {children}
    </div>
    <Footer/>
    </div>
  )
}

export default Master