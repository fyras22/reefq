'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CubeIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: { url: string; alt: string; isPrimary: boolean }[];
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  has3D: boolean;
  hasAR: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  
  // Filtering and sorting
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const searchTerm = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const filterParam = searchParams.get('filter') || 'all';
    
    setCurrentPage(page);
    setSearch(searchTerm);
    setSortField(sort);
    setSortOrder(order);
    setFilter(filterParam);
    
    fetchProducts(page, searchTerm, sort, order, filterParam);
  }, [searchParams]);
  
  const fetchProducts = async (
    page: number, 
    searchTerm: string, 
    sort: string, 
    order: string, 
    filterParam: string
  ) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sort,
        order,
      });
      
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterParam !== 'all') queryParams.append('filter', filterParam);
      
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products);
      setTotalProducts(data.total);
      setTotalPages(Math.ceil(data.total / pageSize));
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search, page: 1 });
  };
  
  const handleSortChange = (field: string) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    updateQueryParams({ sort: field, order: newOrder });
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    updateQueryParams({ filter: newFilter, page: 1 });
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateQueryParams({ page });
  };
  
  const updateQueryParams = (params: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    
    router.push(`/dashboard/admin/products?${newParams.toString()}`);
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Refresh the product list
      fetchProducts(currentPage, search, sortField, sortOrder, filter);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err instanceof Error ? err.message : 'An error occurred while deleting the product');
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const getProductImage = (product: Product) => {
    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage?.url || '/images/placeholder-product.jpg';
  };
  
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortOrder === 'asc' 
      ? <ArrowUpIcon className="h-4 w-4 ml-1" /> 
      : <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };
  
  return (
    <div className="min-h-screen bg-background pt-16 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your product catalog
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              type="button"
              onClick={() => router.push('/dashboard/admin/products/new')}
              className="inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Product
            </Button>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-nile-teal focus:border-nile-teal"
                  />
                </div>
                <Button type="submit" variant="outline" className="ml-2">
                  Search
                </Button>
              </form>
              
              <div className="flex-shrink-0">
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                >
                  <option value="all">All Products</option>
                  <option value="featured">Featured</option>
                  <option value="new">New Arrivals</option>
                  <option value="bestseller">Bestsellers</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                  <option value="has3D">With 3D Model</option>
                  <option value="hasAR">With AR Model</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 text-red-700">
              {error}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {renderSortIcon('price')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('stock')}
                  >
                    <div className="flex items-center">
                      Stock
                      {renderSortIcon('stock')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('createdAt')}
                  >
                    <div className="flex items-center">
                      Created
                      {renderSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image 
                              src={getProductImage(product)}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                              width={40}
                              height={40}
                            />
                            {product.has3D && (
                              <div className="absolute -top-1 -right-1 bg-nile-teal rounded-full p-0.5">
                                <CubeIcon className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                        {product.salePrice && product.salePrice < product.price && (
                          <div className="text-sm text-green-600">
                            Sale: {formatPrice(product.salePrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {product.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                          {product.new && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                          {product.bestseller && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Bestseller
                            </span>
                          )}
                          {!product.featured && !product.new && !product.bestseller && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => router.push(`/jewelry/${product._id}`)}
                            className="text-gray-600 hover:text-gray-900"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/admin/products/${product._id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalProducts)}
                  </span>{' '}
                  of <span className="font-medium">{totalProducts}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show pagination numbers around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNum === currentPage
                            ? 'z-10 bg-nile-teal text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile-teal'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 