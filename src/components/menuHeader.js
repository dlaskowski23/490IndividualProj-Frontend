import React, { useState } from 'react';
import Lottie from 'lottie-react';
import headerAnimation from '../lotties/headerAnimation.json';

function MenuHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-500 p-5">
      <div className="container mx-auto flex justify-between items-center">
        <div className='flex items-center space-x-2'>
          <div className="text-white text-2xl font-extrabold">SakilaDB</div>
          <div className="flex items-center">
            <Lottie 
              animationData={headerAnimation} 
              loop={true} 
              style={{ height: '40px', width: '40px' }}
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10">
          <a href="/" className="text-white hover:text-gray-300">Home</a>
          <a href="/films" className="text-white hover:text-gray-300">Film Page</a>
          <a href="/customers" className="text-white hover:text-gray-300">Customer Page</a>
        </div>

        {/* Hamburger Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isOpen ? "M4 6h16M4 12h16m-7 6h7" : "M6 18L18 6M6 6l12 12"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3">
          <a href="/" className="block text-white py-2 px-4">Home</a>
          <a href="/films" className="block text-white py-2 px-4">Film Page</a>
          <a href="/customers" className="block text-white py-2 px-4">Customer Page</a>
        </div>
      )}
    </nav>
  );
}

export default MenuHeader;
