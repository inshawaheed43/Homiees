import React, { useRef, useEffect } from 'react';
import {  useLocation } from 'react-router-dom';
import homieesGreyLogo from '../assets/houses/homiees-logo-grey.png';
import { Link } from 'react-router-dom';


export const Footer = () => {
  const location = useLocation();

  const visiblePaths = ['/', '/about', '/search'];
  if (!visiblePaths.includes(location.pathname)) return null;

  

  return (
    <footer

      className="bg-[#354f69] my-7 rounded-lg w-[96%] mx-7 top-[15vh] relative text-[#F5EDE8] overflow-x-visible"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        <div>
          <div className="flex items-center mb-4">
            <Link to="/">
              <img
                src={homieesGreyLogo}
                alt="Homiees Logo"
                className="max-w-32  sm:max-w-28 relative top-1 -left-6 text-white"
              />
            </Link>
            <span className="text-xl font-bold relative -left-10 ">Homiees</span>
          </div>
          <p className='text-sm w-28 relative left-[4.7vw]   top-[-4.4vh]'  >Rent, Sell, Live! </p>
          <p className="mb-4 text-lg -top-6 relative">
            A contemporary theme we designed specifically for real estate and property showcase websites, equipped with every
            option, element and feature your site may need.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-xl  mb-8  top-5 relative  ">Contact us</h3>
          <p className='text-lg '>Staten Island, NY 10314, USA</p>
          <p className='text-lg '>+111 222 369 45</p>
          <p className='text-lg '>+123 456 789 11</p>
          <p className='text-lg '>newhome@example.com</p>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-8 top-5 relative ">Categories</h3>
          <ul className="space-y-3  text-lg mt-4">
            <li><a href="#" className="hover:underline">Recent property</a></li>
            <li><a href="#" className="hover:underline">To Sell</a></li>
            <li><a href="#" className="hover:underline">To Buy</a></li>
            <li><a href="#" className="hover:underline">To Rent</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl  mb-8  top-5 relative ">Links</h3>
          <ul className="space-y-3  text-lg">
            <li><a href="#" className="hover:underline">Latest News</a></li>
            <li>
              <Link to="/about" className="hover:underline">
              About Us
              </Link>
           </li>
            <li><a href="#" className="hover:underline">FAQ Page</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 py-4 px-4 text-sm flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto relative -top-4">
        <p className="mb-2 md:mb-0">© 2025 Homiees, All Rights Reserved</p>
        <p>
          <span className="font-semibold">Follow us:</span>{' '}
          <a href="#" className="ml-2 hover:underline">Instagram</a>{' '}
          <a href="#" className="ml-2 hover:underline">Facebook</a>{' '}
          <a href="#" className="ml-2 hover:underline">Youtube</a>{' '}
          <a href="#" className="ml-2 hover:underline">Twitter</a>
        </p>
      </div>
    </footer>
  
  );
};
