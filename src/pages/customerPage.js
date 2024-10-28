import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MenuHeader from '../components/menuHeader';

import Lottie from 'lottie-react';
import customerAnimation from '../lotties/customerAnimation.json';

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchParam, setSearchParam] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formValues, setFormValues] = useState({ firstName: '', lastName: '', email: '' });
  const [customerDetails, setCustomerDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [rentalId, setRentalId] = useState('');


  const fetchCustomers = useCallback(async (page) => {
    try {
      let params = { page, limit: itemsPerPage };

      if (searchParam && searchValue) {
        params[searchParam] = searchValue;
      }

      const response = await axios.get(`http://localhost:3001/customers`, {
        params,
      });
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, [itemsPerPage, searchParam, searchValue]);

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage, fetchCustomers]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCustomers(page);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleParamChange = (e) => {
    setSearchParam(e.target.value);
  };

  const handleAddButtonClick = () => {
    setModalType('add');
    setFormValues({ firstName: '', lastName: '', email: '' });
    setIsModalOpen(true);
  };

  const handleEditButtonClick = (customer) => {
    setModalType('edit');
    setSelectedCustomer(customer);
    setFormValues({
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
    });
    setIsModalOpen(true);
  };

  const handleDeleteButtonClick = async (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.first_name} ${customer.last_name}?`)) {
      try {
        await axios.delete(`http://localhost:3001/customers/${customer.customer_id}`);
        fetchCustomers(currentPage);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormValues({ firstName: '', lastName: '', email: '' });
    setSelectedCustomer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post('http://localhost:3001/customers', formValues);
      fetchCustomers(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleUpdateCustomer = async () => {
    try {
      await axios.put(`http://localhost:3001/customers/${selectedCustomer.customer_id}`, formValues);
      fetchCustomers(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleViewDetailsClick = async (customerId, page = 1) => {
    try {
      const response = await axios.get(`http://localhost:3001/customers/${customerId}/details`, {
        params: { page, limit: 10 },
      });
      setCustomerDetails(response.data.customer);
      setTotalPages(response.data.totalPages);
      setModalCurrentPage(response.data.currentPage);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleReturnRental = async () => {
    try {
      await axios.put(`http://localhost:3001/rentals/${rentalId}/return`);      
      alert("Rental marked as returned!");
      setRentalId('');
      handleViewDetailsClick(customerDetails.customer_id, modalCurrentPage);
    } catch (error) {
      console.error('Error marking rental as returned:', error);
      alert("Failed to mark rental as returned.");
    }
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setCustomerDetails(null);
    setRentalId('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MenuHeader />
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-4xl font-extrabold mb-2 text-center">List of Customers</h2>
        <div className="flex justify-center items-center">
          <Lottie animationData={customerAnimation} loop={true} style={{ height: '200px', width: '200px' }} />
        </div>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <select
              value={searchParam}
              onChange={handleParamChange}
              className="border p-2.5 border-violet-500 bg-violet-100 rounded mr-2"
            >
              <option value="">Select Search Criteria</option>
              <option value="customerId">Customer ID</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
            </select>
            <input
              type="text"
              placeholder="Enter search value"
              value={searchValue}
              onChange={handleSearchChange}
              className="border p-2 border-violet-500 rounded"
            />
          </div>
          <button
            onClick={handleAddButtonClick}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 outline outline-2 outline-green-500 outline-offset-2"
          >
            + Add Customer
          </button>
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-violet-500 text-white font-semibold">
              <th className="py-3 px-4 text-left border-b">Customer ID</th>
              <th className="py-3 px-4 text-left border-b">First Name</th>
              <th className="py-3 px-4 text-left border-b">Last Name</th>
              <th className="py-3 px-4 text-left border-b">Email</th>
              <th className="py-3 px-4 border-b"></th>
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
                  <td className="py-3 px-4 border-b">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditButtonClick(customer)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteButtonClick(customer)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewDetailsClick(customer.customer_id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
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
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 
                'bg-gray-300 outline outline-gray-400 text-black' : 'bg-violet-500 text-white hover:bg-violet-600'}`}
              >
                Next
              </button>
            </div>
          </div>
  
          {detailsModalOpen && customerDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg outline outline-offset-4 outline-white">
                    <h3 className="text-2xl text-center font-bold mb-4">Customer Details</h3>
                    <div className='flex justify-center space-x-4'>
                      <p><strong>Name:</strong> {customerDetails.first_name} {customerDetails.last_name}</p>
                      <p><strong>Email:</strong> {customerDetails.email}</p>
                    </div>
                    <h4 className="text-xl font-bold text-center mt-4">Rental History</h4>
                    <table className="min-w-full bg-gray-200 mt-4 shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-violet-500 text-white text-left font-semibold">
                                <th className="py-2 px-4">Rental ID</th>
                                <th className="py-2 px-4">Film Title</th>
                                <th className="py-2 px-4">Rented On</th>
                                <th className="py-2 px-4">Returned On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerDetails.Rentals.map((rental) => (
                                <tr key={rental.rental_id}>
                                    <td className="py-2 px-4">{rental.rental_id}</td>
                                    <td className="py-2 px-4">{rental.Inventory.Film.title}</td>
                                    <td className="py-2 px-4">{new Date(rental.rental_date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">
                                        {rental.return_date ? new Date(rental.return_date).toLocaleDateString() : 'Not returned yet'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={() => {
                                const newPage = modalCurrentPage - 1;
                                setModalCurrentPage(newPage);
                                handleViewDetailsClick(customerDetails.customer_id, newPage);
                            }}
                            disabled={modalCurrentPage === 1}
                            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
                        >
                            Previous
                        </button>
                        <p>Page {modalCurrentPage} of {totalPages}</p>
                        <button
                            onClick={() => {
                                const newPage = modalCurrentPage + 1;
                                setModalCurrentPage(newPage);
                                handleViewDetailsClick(customerDetails.customer_id, newPage);
                            }}
                            disabled={modalCurrentPage === totalPages}
                            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
                        >
                            Next
                        </button>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xl text-center font-bold mt-4">Return a Rental</h4>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Enter Rental ID to return"
                          value={rentalId}
                          onChange={(e) => setRentalId(e.target.value)}
                          className="p-2 border border-violet-500 bg-violet-100 rounded w-3/4"
                        />
                        <button
                          onClick={handleReturnRental}
                          className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 w-1/4"
                        >
                          Return Rental
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                          onClick={handleCloseDetailsModal}
                          className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
                      >
                          Close
                      </button>
                    </div>
                    
              </div>
            </div>
          )}
  
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg outline outline-offset-4 outline-white">
                <h3 className="text-2xl font-bold text-center mb-4">{modalType === 'add' ? 'Add New Customer' : 'Edit Customer'}</h3>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  className="border p-2 border-violet-500 rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  className="border p-2 rounded border-violet-500 w-full mb-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className="border p-2 rounded border-violet-500 w-full mb-2"
                />
                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={handleCloseModal}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modalType === 'add' ? handleAddCustomer : handleUpdateCustomer}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    {modalType === 'add' ? '+ Add' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default CustomerPage;