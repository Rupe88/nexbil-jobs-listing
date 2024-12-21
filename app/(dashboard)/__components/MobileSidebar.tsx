import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const MobileSidebar = () => {
  return (
    <Sheet>
  <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
    <Menu/>
  </SheetTrigger>
  <SheetContent className='md:hidden pr-4 hover:opacity-75 transition'>
   <Sidebar/>
  </SheetContent>
</Sheet>

  )
}

export default MobileSidebar