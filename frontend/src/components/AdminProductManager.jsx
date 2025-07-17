import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBoxOpen, FaTimes } from 'react-icons/fa';

const CATEGORY_MAP = {
  Men: ['T-Shirts', 'Shirts', 'Shorts', 'Joggers & Pants'],
  Women: ['T-Shirts', 'Crop Tops', 'Dresses', 'Joggers & Pants', 'Shorts', 'Sports Bra'],
  Accessories: ['Bags', 'Hats', 'Slides', 'Bottle'],
};

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: 'Men',
  subcategory: 'T-Shirts',
  images: [],
  colors: '',
  sizes: '',
};

function AdminProductManager() {
  const [category, setCategory] = useState('Men');
  const [subcategory, setSubcategory] = useState('T-Shirts');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/admin/products/category/${category}/subcategory/${subcategory}`
      );
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setProducts([]);
    }
    setLoading(false);
  };

  const handleTab = (cat) => {
    setCategory(cat);
    setSubcategory(CATEGORY_MAP[cat][0]);
  };

  const handleSubcategory = (sub) => {
    setSubcategory(sub);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description') {
      const words = value.split(/\s+/).filter(Boolean);
      if (words.length > 200) return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (form.images.length + files.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }
    setForm((f) => ({ ...f, images: [...f.images, ...files] }));
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (idx) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const openAddForm = () => {
    setForm({ ...initialForm, category, subcategory });
    setImagePreviews([]);
    setEditId(null);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      images: [],
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
    });
    setImagePreviews(product.images || []);
    setEditId(product.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.images.length + imagePreviews.length < 1) {
      setError('At least 1 image is required.');
      return;
    }
    if (form.images.length + imagePreviews.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }
    const colorsArr = form.colors.split(',').map(c => c.trim()).filter(Boolean);
    const sizesArr = form.sizes.split(',').map(s => s.trim()).filter(Boolean);
    if (form.colors && colorsArr.length === 0) {
      setError('Please enter at least one valid color or leave the field empty.');
      return;
    }
    if (form.sizes && sizesArr.length === 0) {
      setError('Please enter at least one valid size or leave the field empty.');
      return;
    }
    const data = new FormData();
    data.append('product', new Blob([
      JSON.stringify({
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        subcategory: form.subcategory,
        colors: colorsArr,
        sizes: sizesArr,
      })
    ], { type: 'application/json' }));
    form.images.forEach((img) => data.append('images', img));
    try {
      if (editId) {
        await axios.put(`/admin/products/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowForm(false);
      fetchProducts();
    } catch (e) {
      setError('Failed to save product.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (e) {
      alert('Failed to delete.');
    }
  };

  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads/products/')) return `http://localhost:8080${img}`;
    return `http://localhost:8080/uploads/products/${img}`;
  };

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full text-gray-900">
      {/* Category Tabs */}
      <div className="flex space-x-4 mb-4">
        {Object.keys(CATEGORY_MAP).map((cat) => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-full font-bold shadow-md transition-all duration-200 border-2 ${category === cat ? 'bg-white text-purple-700 border-purple-600 scale-105' : 'bg-purple-700 text-white border-transparent hover:bg-purple-800'}`}
            onClick={() => handleTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Subcategory Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_MAP[category].map((sub) => (
          <button
            key={sub}
            className={`px-4 py-1 rounded-full font-semibold border-2 transition-all duration-200 ${subcategory === sub ? 'bg-blue-100 text-blue-700 border-blue-600 scale-105' : 'bg-blue-700 text-white border-transparent hover:bg-blue-800'}`}
            onClick={() => handleSubcategory(sub)}
          >
            {sub}
          </button>
        ))}
      </div>
      {/* Search Bar and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2 w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-gray-800"
          />
        </div>
        <button
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-600 transition"
          onClick={openAddForm}
        >
          <FaPlus /> Add Product
        </button>
      </div>
      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16"><span className="text-lg text-gray-500">Loading...</span></div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
          <span className="text-lg text-gray-500">No products found.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform border-2 border-blue-100">
              {p.images && p.images.length > 0 ? (
                <img
                  src={getImageUrl(p.images[0])}
                  alt="thumb"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-blue-300 shadow bg-white mb-4"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl border-2 border-blue-300 mb-4">No Image</div>
              )}
              <div className="w-full flex flex-col items-center">
                <span className="font-bold text-lg text-gray-800 mb-1 truncate w-full text-center" title={p.name}>{p.name}</span>
                <span className="text-blue-700 font-extrabold text-xl mb-2">Rs {p.price}</span>
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">{p.category} / {p.subcategory}</span>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1 rounded-full font-bold hover:bg-blue-700 shadow-md transition"
                    onClick={() => openEditForm(p)}
                  ><FaEdit /> Edit</button>
                  <button
                    className="flex items-center gap-1 bg-red-600 text-white px-4 py-1 rounded-full font-bold hover:bg-red-700 shadow-md transition"
                    onClick={() => handleDelete(p.id)}
                  ><FaTrash /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative shadow-2xl">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowForm(false)}
            ><FaTimes /></button>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">{editId ? 'Edit' : 'Add'} Product</h3>
            {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {form.description.split(/\s+/).filter(Boolean).length} / 200 words
                </div>
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Price (Rs)</label>
                <input type="number" name="price" value={form.price} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required min="0" />
              </div>
              <div className="mb-3 flex space-x-2">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select name="category" value={form.category} onChange={e => {
                    handleFormChange(e);
                    setSubcategory(CATEGORY_MAP[e.target.value][0]);
                    setForm(f => ({ ...f, subcategory: CATEGORY_MAP[e.target.value][0] }));
                  }} className="border rounded px-2 py-1">
                    {Object.keys(CATEGORY_MAP).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Subcategory</label>
                  <select name="subcategory" value={form.subcategory} onChange={handleFormChange} className="border rounded px-2 py-1">
                    {CATEGORY_MAP[form.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={form.colors}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. Black, White, Blue"
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. S, M, L, XL"
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Images (1-5)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                <div className="flex space-x-2 mt-2">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded" />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 group-hover:opacity-100"
                        onClick={() => removeImage(idx)}
                        title="Remove"
                      ><FaTimes /></button>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold mt-4 hover:bg-blue-700">{editId ? 'Update' : 'Add'} Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductManager; 