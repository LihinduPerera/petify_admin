import React from 'react'
import { BiCategory,} from 'react-icons/bi'
import { BsBasket2Fill, BsCreditCard, BsGrid1X2Fill, BsPciCard } from 'react-icons/bs'
import { FaDog, FaKitMedical } from 'react-icons/fa6'
import { MdPhotoAlbum } from 'react-icons/md'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id='sidebar' className={openSidebarToggle ? "sidebar-responsive" : ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <FaDog className='icon_header'/> PETIFY
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
        <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
                <a href="">
                    <BsGrid1X2Fill className='icon'/>DashBoard
                </a>
            </li>
        <li className='sidebar-list-item'>
                <a href="">
                    <FaKitMedical className='icon'/>Medication
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsCreditCard className='icon'/>Orders
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsBasket2Fill className='icon'/>Products
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsPciCard className='icon'/>Promos
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <MdPhotoAlbum className='icon'/>Banners
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BiCategory className='icon'/>Categories
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar