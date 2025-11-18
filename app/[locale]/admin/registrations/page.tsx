'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLocale } from 'next-intl';
import Navigation from '@/components/Navigation';
import AdminNav from '@/components/AdminNav';
import Link from 'next/link';

interface Registration {
  _id: string;
  name: string;
  alien_number: string;
  passport_number?: string;
  nationality: string;
  phone: string;
  visa_type: string;
  message?: string;
  country?: string;
  createdAt: string;
}

export default function AdminRegistrationsPage() {
  const locale = useLocale();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRegistrations();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRegistrations, 30000);
    return () => clearInterval(interval);
  }, [currentPage, filterType]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(filterType !== 'all' && { visa_type: filterType }),
      });

      const response = await fetch(`/api/admin/registrations?${params}`);
      const data = await response.json();

      if (response.ok) {
        setRegistrations(data.data);
        setTotalPages(data.pagination.pages);
        setTotalCount(data.pagination.total);
      } else {
        toast.error('Failed to fetch registrations');
      }
    } catch (error) {
      toast.error('Error fetching registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Registration deleted successfully');
        fetchRegistrations();
      } else {
        toast.error('Failed to delete registration');
      }
    } catch (error) {
      toast.error('Error deleting registration');
    }
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.alien_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm);
    return matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Alien Number', 'Passport Number', 'Nationality', 'Phone', 'Service Type', 'Country', 'Date'];
    const rows = registrations.map((reg) => [
      reg.name,
      reg.alien_number,
      reg.passport_number || '',
      reg.nationality,
      reg.phone,
      reg.visa_type.replace('_', ' '),
      reg.country || '',
      new Date(reg.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Registrations Management</h1>
            <p className="text-gray-600 mt-1">
              Manage and view all registration submissions
              {totalCount > 0 && (
                <span className="ml-2 text-blue-600 font-semibold">({totalCount} total)</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/${locale}/admin`}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Export CSV
            </button>
            <button
              onClick={fetchRegistrations}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, alien number, nationality, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Service Type</label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="income_tax">Income Tax Refund</option>
                <option value="house_rent">House Rent Tax Refund</option>
                <option value="family_tax">Family Tax Refund</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-xl">Loading registrations...</div>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No registrations have been submitted yet.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alien Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nationality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRegistrations.map((registration) => (
                      <tr key={registration._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {registration.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.alien_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.nationality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {registration.visa_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(registration)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(registration._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} registrations
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Registration Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="mt-1 text-gray-900">{selectedRegistration.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Alien Registration Number</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.alien_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Passport Number</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.passport_number || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nationality</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.nationality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service Type</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.visa_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Country</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.country || 'N/A'}</p>
                  </div>
                </div>

                {selectedRegistration.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Additional Information</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.message}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted Date</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedRegistration.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedRegistration._id);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
