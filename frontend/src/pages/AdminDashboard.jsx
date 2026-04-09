import { useState, useEffect, useCallback } from 'react';
import { 
  getProducts, 
  getCategories, 
  getAllOrdersApi, 
  createProductApi, 
  deleteProductApi, 
  createCategoryApi, 
  deleteCategoryApi, 
  updateOrderStatusApi,
  updateProductApi,
  updateCategoryApi,
} from '../services/api';
import Button from '../components/Button';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodResponse, catData, ordData] = await Promise.all([
        getProducts({ page: currentPage, limit: 10 }), // Standard limit for admin
        getCategories(),
        getAllOrdersApi()
      ]);
      setProducts(prodResponse.data);
      setLastPage(prodResponse.lastPage);
      setTotalProducts(prodResponse.total);
      setCategories(catData);
      setOrders(ordData);
    } catch (error) {
      console.error("Admin fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="p-8 text-center text-textLight">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-secondary p-6 shrink-0">
        <h2 className="text-2xl font-bold mb-8 text-primary font-heading">Admin Panel</h2>
        <nav className="space-y-2">
          {['products', 'categories', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'products') setCurrentPage(1);
              }}
              className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-primary text-white font-medium shadow-md' 
                  : 'text-textMain hover:bg-secondary/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 overflow-auto">
        {activeTab === 'products' && (
          <ProductsManager 
            products={products} 
            categories={categories} 
            refresh={fetchData} 
            showForm={showProductForm}
            setShowForm={setShowProductForm}
            currentPage={currentPage}
            lastPage={lastPage}
            setPage={setCurrentPage}
            totalItems={totalProducts}
          />
        )}
        {activeTab === 'categories' && (
          <CategoriesManager 
            categories={categories} 
            refresh={fetchData}
            showForm={showCategoryForm}
            setShowForm={setShowCategoryForm}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersManager 
            orders={orders} 
            refresh={fetchData} 
          />
        )}
      </div>
    </div>
  );
}

// --- Sub Components ---

function ProductsManager({ products, categories, refresh, showForm, setShowForm, currentPage, lastPage, setPage, totalItems }) {
  const [formData, setFormData] = useState({ 
    name: '', price: '', description: '', stock: 10, categoryId: '', 
    image: '', dimensions: '', material: ''
  });
  const [editingId, setEditingId] = useState(null);

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price,
      description: p.description,
      stock: p.stock,
      categoryId: p.categoryId || (p.category ? p.category.id : ''),
      image: p.images?.[0] || '',
      dimensions: p.dimensions || '',
      material: p.material || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ 
      name: '', price: '', description: '', stock: 10, categoryId: '', 
      image: '', dimensions: '', material: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Destructure everything to avoid any extra fields from spread
      const { name, price, description, stock, categoryId, image, dimensions, material } = formData;
      
      const priceVal = parseFloat(price);
      const stockVal = parseInt(stock);
      const catId = parseInt(categoryId);

      const finalPayload = {
        name,
        description,
        price: isNaN(priceVal) ? 0 : priceVal,
        stock: isNaN(stockVal) ? 0 : stockVal,
        images: image && image.trim() !== '' ? [image] : [],
        dimensions: dimensions || undefined,
        material: material || undefined
      };

      if (!isNaN(catId) && catId !== 0) {
        finalPayload.categoryId = catId;
      }

      if (editingId) {
        await updateProductApi(editingId, finalPayload);
      } else {
        await createProductApi(finalPayload);
      }
      handleCancel();
      refresh();
    } catch (err) {
      alert("Error saving product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      await deleteProductApi(id);
      refresh();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold">Products</h3>
          <p className="text-sm text-textLight">Total: {totalItems} items</p>
        </div>
        <Button onClick={showForm ? handleCancel : () => setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Product'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-sm border border-secondary mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Product Name</label>
            <input required type="text" placeholder="e.g. Modern Sofa" className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Price ($)</label>
            <input required type="number" step="0.01" placeholder="0.00" className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Category</label>
            <select required className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Stock Level</label>
            <input required type="number" placeholder="10" className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Image URL</label>
            <input type="text" placeholder="https://..." className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Dimensions</label>
            <input type="text" placeholder="e.g. 80 x 40 x 45 cm" className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Material</label>
            <input type="text" placeholder="e.g. Solid Wood, Metal" className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} />
          </div>
          


          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-textLight uppercase tracking-wider">Description</label>
            <textarea required rows="3" placeholder="Describe the item..." className="w-full border border-secondary p-2 rounded focus:ring-1 focus:ring-primary outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <Button type="submit" className="md:col-span-2">{editingId ? 'Update Product' : 'Save Product'}</Button>
        </form>
      )}

      <div className="bg-white rounded-md shadow-sm border border-secondary overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary/20">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-textMain">ID</th>
              <th className="p-4 text-xs font-bold uppercase text-textMain">Name</th>
              <th className="p-4 text-xs font-bold uppercase text-textMain">Price</th>
              <th className="p-4 text-xs font-bold uppercase text-textMain">Category</th>
              <th className="p-4 text-xs font-bold uppercase text-textMain text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-secondary hover:bg-secondary/5 transition-colors">
                <td className="p-4 text-sm text-textLight">#{p.id}</td>
                <td className="p-4 font-medium text-sm">{p.name}</td>
                <td className="p-4 text-sm font-semibold">${Number(p.price).toFixed(2)}</td>
                <td className="p-4 text-sm">
                  <span className="px-2 py-1 bg-secondary/30 rounded text-xs capitalize">{p.category?.name || 'Uncategorized'}</span>
                </td>
                <td className="p-4 text-right space-x-3 text-sm">
                  <button onClick={() => startEdit(p)} className="text-blue-500 hover:underline font-bold uppercase text-[10px]">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:underline font-bold uppercase text-[10px]">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lastPage > 1 && (
        <div className="mt-6 flex justify-between items-center bg-white px-6 py-4 rounded-md border border-secondary shadow-sm">
          <p className="text-xs font-medium text-textLight uppercase tracking-wider">Page {currentPage} of {lastPage}</p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="px-3 py-1 text-xs font-bold border border-secondary rounded hover:bg-secondary/30 disabled:opacity-30 transition-colors">PREV</button>
            <button disabled={currentPage === lastPage} onClick={() => setPage(currentPage + 1)} className="px-3 py-1 text-xs font-bold border border-secondary rounded hover:bg-secondary/30 disabled:opacity-30 transition-colors">NEXT</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriesManager({ categories, refresh, showForm, setShowForm }) {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const startEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategoryApi(editingId, { name });
      } else {
        await createCategoryApi({ name });
      }
      handleCancel();
      refresh();
    } catch {
      alert("Error saving category");
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete category?')) {
      await deleteCategoryApi(id);
      refresh();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Categories</h3>
        <Button onClick={showForm ? handleCancel : () => setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Category'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-sm border border-secondary mb-8 flex gap-4">
          <input required type="text" placeholder="Category Name" className="border p-2 rounded flex-1" value={name} onChange={e => setName(e.target.value)} />
          <Button type="submit">{editingId ? 'Update' : 'Save'}</Button>
        </form>
      )}

      <div className="bg-white rounded-md shadow-sm border border-secondary overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/20">
            <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t border-secondary hover:bg-secondary/5">
                <td className="p-4 text-sm">#{c.id}</td>
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-right space-x-4">
                  <button onClick={() => startEdit(c)} className="text-blue-500 hover:underline font-bold uppercase text-[10px]">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline font-bold uppercase text-[10px]">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



function OrdersManager({ orders, refresh }) {
  const handleStatusChange = async (orderId, newStatus) => {
    if (confirm(`Change order #${orderId} status to ${newStatus}?`)) {
      try {
        await updateOrderStatusApi(orderId, newStatus);
        refresh();
      } catch {
        alert("Error updating status");
      }
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Orders ({orders.length})</h3>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-md shadow-sm border border-secondary flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <p className="font-bold text-lg">Order #{order.id}</p>
              <p className="text-sm text-textLight">User ID: {order.userId} | Total: ${order.totalAmount}</p>
              <p className="text-xs text-textLight mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {order.status}
              </span>
              <select className="border rounded p-1 text-sm bg-background focus:ring-1 focus:ring-primary outline-none" value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)}>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-textLight">No orders found.</p>}
      </div>
    </div>
  );
}

