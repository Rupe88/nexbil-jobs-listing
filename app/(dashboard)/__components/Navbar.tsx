import React from 'react'
import NavbarRoutes from './NavbarRoutes'
import Logo from './Logo'

const Navbar = () => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>

        {/* mobile routes */}
       <Logo/>
        {/* <MobileSidebar/> */}

        {/* sidebar routes */}
        <NavbarRoutes/>
    </div>
  )
}

export default Navbar