import React from 'react';
import { Link } from 'react-router-dom';
import { BiCategory } from 'react-icons/bi';
import { BsBasket2Fill, BsCreditCard, BsGrid1X2Fill, BsPciCard } from 'react-icons/bs';
import { FaKitMedical } from 'react-icons/fa6';
import { MdPhotoAlbum } from 'react-icons/md';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
    return (
        <aside id='sidebar' className={openSidebarToggle ? 'sidebar-responsive' : ''}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <FaKitMedical className='icon_header' /> PETIFY
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>
            <ul className='sidebar-list'>
                <Link to="/">
                    <li className='sidebar-list-item'>
                        <BsGrid1X2Fill className='icon' /> Dashboard
                    </li>
                </Link>
                <Link to="/medication">
                    <li className='sidebar-list-item'>
                        <FaKitMedical className='icon' /> Medication
                    </li>
                </Link>
                <Link to="/orders">
                    <li className='sidebar-list-item'>
                        <BsCreditCard className='icon' /> Orders
                    </li>
                </Link>
                <Link to="/products">
                    <li className='sidebar-list-item'>
                        <BsBasket2Fill className='icon' /> Products
                    </li>
                </Link>
                <Link to="/promos">
                    <li className='sidebar-list-item'>
                        <BsPciCard className='icon' /> Promos
                    </li>
                </Link>
                <Link to="/banners">
                    <li className='sidebar-list-item'>
                        <MdPhotoAlbum className='icon' /> Banners
                    </li>
                </Link>
                <Link to="/categories">
                    <li className='sidebar-list-item'>
                        <BiCategory className='icon' /> Categories
                    </li>
                </Link>
            </ul>
        </aside>
    );
}

export default Sidebar;
