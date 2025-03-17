import React from 'react'
import { BiCategory, BiPlusMedical, BiSolidPhotoAlbum } from 'react-icons/bi'
import { BsBasket, BsBasket2Fill, BsCarFront, BsCarFrontFill, BsCart3, BsCreditCard, BsFileMedicalFill, BsPciCard } from 'react-icons/bs'
import { DiPhotoshop } from 'react-icons/di'
import { MdOutlineQueryBuilder, MdPhotoAlbum } from 'react-icons/md'
import { RiOrderPlayFill } from 'react-icons/ri'

function Sidebar() {
  return (
    <aside id='sidebar'>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3 className='icon_header'/> Pet Store
            </div>
            <span className='icon close_icon'>X</span>
        </div>
        <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
                <a href="">
                    <BiPlusMedical className='icon'/>Medication
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