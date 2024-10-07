import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuHeader from '../components/menuHeader';

import Lottie from 'lottie-react';
import customerAnimation from '../lotties/customerAnimation.json';

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCustomers = async (page) => {
      try {
        const response = await axios.get(`http://localhost:3001/customers`, {
          params: { page, limit: itemsPerPage },
        });
        setCustomers(response.data.customers);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers(currentPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MenuHeader />
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-4xl font-extrabold mb-2 text-center">List of Customers</h2>
        <div className="flex justify-center items-center">
            <Lottie animationData={customerAnimation} loop={true} style={{ height: '200px', width: '200px' }} />
        </div>
        
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-violet-500 text-left text-white font-semibold">
              <th className="py-3 px-4 border-b">Customer ID</th>
              <th className="py-3 px-4 border-b">First Name</th>
              <th className="py-3 px-4 border-b">Last Name</th>
              <th className="py-3 px-4 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.customer_id} className="hover:bg-violet-100">
                  <td className="py-3 px-4 border-b">{customer.customer_id}</td>
                  <td className="py-3 px-4 border-b">{customer.first_name}</td>
                  <td className="py-3 px-4 border-b">{customer.last_name}</td>
                  <td className="py-3 px-4 border-b">{customer.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-6">
          <p className="text-gray-600">Page {currentPage} of {totalPages}</p>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300 outline outline-gray-400 text-black' : 'bg-violet-500 text-white hover:bg-violet-600'}`}
            >
              Previous
            </button>

            <select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md"
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Page {index + 1}
                </option>
              ))}
            </select>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300 outline outline-gray-400 text-black' : 'bg-violet-500 text-white hover:bg-violet-600'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;