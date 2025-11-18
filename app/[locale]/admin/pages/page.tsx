'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import Navigation from '@/components/Navigation';
import AdminNav from '@/components/AdminNav';

interface Page {
  _id: string;
  title: string;
  slug: string;
  locale: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPagesPage() {
  const locale = useLocale();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLocale, setFilterLocale] = useState<string>('all');

  useEffect(() => {
    fetchPages();
  }, [filterLocale]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const url = filterLocale !== 'all' 
        ? `/api/admin/pages?locale=${filterLocale}`
        : '/api/admin/pages';
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setPages(data.data);
      } else {
        toast.error('Failed to fetch pages');
      }
    } catch (error) {
      toast.error('Error fetching pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Page deleted');
        fetchPages();
      } else {
        toast.error('Failed to delete page');
      }
    } catch (error) {
      toast.error('Error deleting page');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const page = pages.find(p => p._id === id);
      if (!page) return;

      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...page,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        toast.success(`Page ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchPages();
      } else {
        toast.error('Failed to update page');
      }
    } catch (error) {
      toast.error('Error updating page');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pages Management</h1>
            <p className="text-gray-600 mt-1">Manage all website pages</p>
          </div>
          <Link
            href={`/${locale}/admin/pages/new`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Page
          </Link>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Language:
          </label>
          <select
            value={filterLocale}
            onChange={(e) => setFilterLocale(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="bn">Bengali</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No pages found. Create your first page!
                    </td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {page.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.locale.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleToggleActive(page._id, page.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            page.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {page.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/${locale}/admin/pages/${page._id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(page._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

