import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, Search, PackageOpen, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Select, ConfirmDialog } from './admin/AdminUI';

/**
 * Starting subcategories. This is a seed, not the whole truth: whatever the
 * saved products actually use is merged in on top, so a subcategory added
 * while creating a product becomes a real option everywhere afterwards.
 */
const CATEGORY_MAP = {
  Men: ['T-Shirts', 'Shirts', 'Shorts', 'Joggers & Pants'],
  Women: ['T-Shirts', 'Crop Tops', 'Dresses', 'Joggers & Pants', 'Shorts', 'Sports Bra'],
  Accessories: ['Bags', 'Hats', 'Slides', 'Bottle'],
};

/** Sentinel for the "add a new one" option in the subcategory dropdown. */
const NEW_SUBCATEGORY = '__new__';

const seedSubcategories = () =>
  Object.fromEntries(Object.entries(CATEGORY_MAP).map(([cat, subs]) => [cat, [...subs]]));

const MAX_IMAGES = 6;

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: 'Men',
  subcategory: 'T-Shirts',
  colors: '',
  sizes: '',
};

/**
 * Images are held in ONE list so the count is never ambiguous.
 *   { key, kind: 'existing' | 'new', url, file, color }
 * `color` is the product colour the shot belongs to; '' means it belongs to
 * every colour, which is how products saved before this feature behave.
 * 'existing' entries are already on the server (edit mode) and carry only a
 * url; 'new' entries carry the File plus an object URL for the preview.
 * The previous code kept files in `form.images` and previews in a separate
 * `imagePreviews`, then added the two lengths together — which double-counted
 * in add mode (3 images read as 6) and misaligned the remove-by-index in edit
 * mode.
 */
const releaseObjectUrls = (list) =>
  list.forEach((img) => {
    if (img.kind === 'new') URL.revokeObjectURL(img.url);
  });

function AdminProductManager() {
  const { showToast } = useToast();
  const [category, setCategory] = useState('Men');
  const [subcategory, setSubcategory] = useState('T-Shirts');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  // The colour newly picked files are filed under — "add the colour first".
  const [uploadColor, setUploadColor] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  // The product awaiting delete confirmation, and whether the request is away.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // Known subcategories per category: the seed above plus everything the saved
  // products actually use.
  const [subsByCategory, setSubsByCategory] = useState(seedSubcategories);
  // Set while the admin is typing a brand new subcategory in the form.
  const [newSubcategory, setNewSubcategory] = useState('');

  const subcategoriesFor = (cat) => subsByCategory[cat] || CATEGORY_MAP[cat] || [];
  const formSubcategories = subcategoriesFor(form.category);
  const addingSubcategory = form.subcategory === NEW_SUBCATEGORY;

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subcategory]);

  // Discover the subcategories in use once, on mount.
  useEffect(() => {
    refreshSubcategories();
  }, []);

  /**
   * Rebuild the subcategory lists from what is actually stored. Without this a
   * product filed under a new subcategory would be saved but then be
   * unreachable — the browse pills only show what they know about.
   */
  const refreshSubcategories = async () => {
    try {
      const res = await axios.get('/admin/products');
      const all = Array.isArray(res.data) ? res.data : [];
      const next = seedSubcategories();
      all.forEach((p) => {
        if (!p.category || !p.subcategory) return;
        if (!next[p.category]) next[p.category] = [];
        if (!next[p.category].includes(p.subcategory)) next[p.category].push(p.subcategory);
      });
      setSubsByCategory(next);
    } catch {
      /* keep whatever we already have */
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/admin/products/category/${category}/subcategory/${subcategory}`
      );
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  const handleTab = (cat) => {
    setCategory(cat);
    setSubcategory(subcategoriesFor(cat)[0] || '');
  };

  const handleSubcategory = (sub) => {
    setSubcategory(sub);
  };

  // Colours currently typed into the form, used to file images under.
  const colorList = form.colors
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  // An image whose colour is no longer one of the product's colours falls back
  // to "all colours" rather than vanishing from the gallery.
  const colorOf = (img) => (colorList.includes(img.color) ? img.color : '');

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
    // Clear the input so picking the same file again still fires a change.
    e.target.value = '';
    if (!files.length) return;

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setError(`You can add a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const accepted = files.slice(0, room);
    setError(
      files.length > room
        ? `Only ${room} more image${room === 1 ? '' : 's'} could be added (maximum ${MAX_IMAGES}).`
        : ''
    );

    setImages((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        key: `new-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        kind: 'new',
        file,
        url: URL.createObjectURL(file),
        color: colorList.includes(uploadColor) ? uploadColor : '',
      })),
    ]);
  };

  const setImageColor = (key, color) => {
    setImages((prev) => prev.map((img) => (img.key === key ? { ...img, color } : img)));
  };

  const removeImage = (key) => {
    const target = images.find((img) => img.key === key);
    if (target?.kind === 'new') URL.revokeObjectURL(target.url);
    setImages((prev) => prev.filter((img) => img.key !== key));
    setError('');
  };

  const openAddForm = () => {
    releaseObjectUrls(images);
    setForm({ ...initialForm, category, subcategory });
    setImages([]);
    setNewSubcategory('');
    setUploadColor('');
    setEditId(null);
    setShowForm(true);
    setError('');
  };

  const closeForm = () => {
    releaseObjectUrls(images);
    setImages([]);
    setNewSubcategory('');
    setShowForm(false);
    setError('');
  };

  const openEditForm = (product) => {
    releaseObjectUrls(images);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock ?? '',
      category: product.category,
      subcategory: product.subcategory,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
    });
    setNewSubcategory('');
    const savedColors = product.imageColors || {};
    setImages(
      (product.images || []).map((url, i) => ({
        key: `existing-${i}-${url}`,
        kind: 'existing',
        url,
        color: savedColors[url] || '',
      }))
    );
    setUploadColor('');
    setEditId(product.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (images.length < 1) {
      setError('At least 1 image is required.');
      return;
    }
    if (images.length > MAX_IMAGES) {
      setError(`You can add a maximum of ${MAX_IMAGES} images.`);
      return;
    }
    // Resolve the subcategory before anything else — a new one must be named,
    // and one that only differs by case should reuse the existing spelling
    // rather than creating a near-duplicate.
    let subcategoryValue = form.subcategory;
    if (addingSubcategory) {
      const typed = newSubcategory.trim();
      if (!typed) {
        setError('Please name the new subcategory.');
        return;
      }
      subcategoryValue =
        formSubcategories.find((s) => s.toLowerCase() === typed.toLowerCase()) || typed;
    }

    const keptImages = images.filter((img) => img.kind === 'existing');
    const newImages = images.filter((img) => img.kind === 'new');
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
        // Blank means "not tracked": the product never sells out.
        stock: form.stock === '' ? null : Number(form.stock),
        category: form.category,
        subcategory: subcategoryValue,
        colors: colorsArr,
        sizes: sizesArr,
        // The existing images the admin chose to keep. The server rebuilds the
        // list from these plus whatever is newly uploaded, so removing an image
        // in the edit form now actually removes it.
        images: keptImages.map((img) => img.url),
        // Colour of each kept image, keyed by url.
        imageColors: Object.fromEntries(
          keptImages.filter((img) => colorOf(img)).map((img) => [img.url, colorOf(img)])
        ),
        // Colour of each new upload, in the exact order the files are appended
        // below — that ordering is the contract with the server.
        newImageColors: newImages.map((img) => colorOf(img)),
      })
    ], { type: 'application/json' }));
    newImages.forEach((img) => data.append('images', img.file));
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
      closeForm();
      // Surface the new subcategory in the pills and jump to it, so the piece
      // that was just saved is visible instead of silently filed away.
      await refreshSubcategories();
      if (form.category !== category) setCategory(form.category);
      setSubcategory(subcategoryValue);
      fetchProducts();
    } catch {
      setError('Failed to save product.');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`/admin/products/${pendingDelete.id}`);
      setPendingDelete(null);
      showToast('Product deleted', 'success');
      refreshSubcategories();
      fetchProducts();
    } catch {
      showToast('Could not delete that product', 'error');
    }
    setDeleting(false);
  };

  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads/products/')) return `${window.API_BASE_URL}${img}`;
    return `${window.API_BASE_URL}/uploads/products/${img}`;
  };

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full text-gray-900">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {Object.keys(CATEGORY_MAP).map((cat) => (
          <button
            key={cat}
            type="button"
            className={`h-9 px-4 text-[11px] tracking-label uppercase border transition-colors duration-200 ${
              category === cat
                ? 'bg-black text-white border-black'
                : 'bg-white text-black/55 border-line hover:border-black hover:text-black'
            }`}
            onClick={() => handleTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Subcategory Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subcategoriesFor(category).map((sub) => (
          <button
            key={sub}
            type="button"
            className={`h-8 px-3 text-[10px] tracking-label uppercase border transition-colors duration-200 ${
              subcategory === sub
                ? 'bg-white text-black border-black'
                : 'bg-transparent text-black/45 border-line hover:text-black hover:border-black'
            }`}
            onClick={() => handleSubcategory(sub)}
          >
            {sub}
          </button>
        ))}
      </div>
      {/* Search Bar and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center bg-white border border-line h-10 px-3 w-full md:w-80">
          <Search size={14} strokeWidth={1.6} className="text-black/30 mr-2.5 shrink-0" />
          <input
            type="search"
            placeholder="Search products"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-[13px] placeholder:text-black/30"
          />
        </div>
        <button
          type="button"
          className="h-10 px-5 inline-flex items-center justify-center gap-2 bg-black text-white text-[11px] tracking-label uppercase font-medium hover:bg-carbon transition-colors duration-200"
          onClick={openAddForm}
        >
          <Plus size={14} strokeWidth={2} /> Add Product
        </button>
      </div>
      {/* Product Grid */}
      {loading ? (
        <div className="bg-white border border-line py-20 text-center">
          <span className="text-[10px] tracking-eyebrow uppercase text-black/35">Loading…</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-line flex flex-col items-center py-20">
          <PackageOpen size={26} strokeWidth={1.3} className="text-black/20 mb-4" />
          <span className="text-[13px] text-black/45">
            {search ? `Nothing matches "${search}".` : 'No products in this subcategory yet.'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white border border-line flex flex-col">
              <div className="relative bg-muted aspect-[4/5] overflow-hidden">
                {p.images && p.images.length > 0 ? (
                  <img
                    src={getImageUrl(p.images[0])}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] tracking-label uppercase text-black/25">
                    No image
                  </span>
                )}
                {p.images && p.images.length > 1 && (
                  <span className="absolute top-2 right-2 bg-black/80 text-white text-[9px] tracking-label uppercase px-1.5 py-0.5 tabular-nums">
                    {p.images.length}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-[9px] tracking-label uppercase text-black/35 mb-1.5">
                  {p.subcategory}
                </p>
                <p className="text-[13px] font-medium leading-tight mb-1.5 line-clamp-2" title={p.name}>
                  {p.name}
                </p>
                <p className="text-[13px] tabular-nums mb-1">Rs {p.price}</p>
                <p
                  className={`text-[10px] tracking-label uppercase mb-4 ${
                    p.stock === 0 ? 'text-rose-600' : 'text-black/40'
                  }`}
                >
                  {p.stock == null ? 'Stock not tracked' : p.stock === 0 ? 'Sold out' : `${p.stock} in stock`}
                </p>

                <div className="mt-auto flex gap-2">
                  <button
                    type="button"
                    className="flex-1 h-8 inline-flex items-center justify-center gap-1.5 border border-line text-[10px] tracking-label uppercase hover:border-black hover:bg-muted transition-colors duration-200"
                    onClick={() => openEditForm(p)}
                  ><Pencil size={12} strokeWidth={1.7} /> Edit</button>
                  <button
                    type="button"
                    aria-label={`Delete ${p.name}`}
                    className="w-8 h-8 inline-flex items-center justify-center border border-line text-rose-600 hover:border-rose-600 hover:bg-rose-50 transition-colors duration-200"
                    onClick={() => setPendingDelete(p)}
                  ><Trash2 size={12} strokeWidth={1.7} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {pendingDelete && (
        <ConfirmDialog
          title="Delete product"
          confirmLabel="Delete product"
          busy={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
          body={
            <>
              <strong className="font-medium text-black">{pendingDelete.name}</strong> will be
              removed from the catalogue and will no longer appear in the storefront. This cannot
              be undone.
            </>
          }
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          {/* Capped to the viewport with only the fields scrolling, so the
              title and the submit button stay reachable however many image
              groups the product has. */}
          <div className="bg-white border border-line w-full max-w-lg relative shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-5 z-10 text-black/35 hover:text-black transition-colors duration-200"
              onClick={closeForm}
            ><X size={18} strokeWidth={1.6} /></button>
            <div className="shrink-0 px-8 pt-7 pb-4 border-b border-line">
              <h3 className="text-lg font-medium">{editId ? 'Edit' : 'Add'} product</h3>
              {error && (
                <p className="mt-3 border-l-2 border-rose-500 pl-3 py-1.5 text-[12px] text-rose-600">
                  {error}
                </p>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-4">
                <div className="mb-3">
                  <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleFormChange} className="w-full h-10 border border-line px-3 text-[13px] focus:outline-none focus:border-black transition-colors duration-200" required />
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full h-10 border border-line px-3 text-[13px] focus:outline-none focus:border-black transition-colors duration-200" required />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {form.description.split(/\s+/).filter(Boolean).length} / 200 words
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Price (Rs)</label>
                  <input type="number" name="price" value={form.price} onChange={handleFormChange} className="w-full h-10 border border-line px-3 text-[13px] focus:outline-none focus:border-black transition-colors duration-200" required min="0" />
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleFormChange} className="w-full h-10 border border-line px-3 text-[13px] focus:outline-none focus:border-black transition-colors duration-200" min="0" step="1" placeholder="Leave blank if you do not track stock" />
                  <div className="text-xs text-gray-500 mt-1">
                    Units available. Each order reduces it; at 0 the product shows as sold out.
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Category</label>
                    <Select
                      name="category"
                      value={form.category}
                      className="w-full"
                      onChange={e => {
                        const nextCategory = e.target.value;
                        handleFormChange(e);
                        setNewSubcategory('');
                        setForm(f => ({
                          ...f,
                          subcategory: subcategoriesFor(nextCategory)[0] || NEW_SUBCATEGORY,
                        }));
                      }}
                    >
                      {Object.keys(CATEGORY_MAP).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Subcategory</label>
                    <Select
                      name="subcategory"
                      value={form.subcategory}
                      className="w-full"
                      onChange={handleFormChange}
                    >
                      {formSubcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value={NEW_SUBCATEGORY}>+ Add new subcategory…</option>
                    </Select>
                  </div>
                </div>
                {addingSubcategory && (
                  <div className="mb-3">
                    <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">
                      New subcategory name
                    </label>
                    <input
                      type="text"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      placeholder="e.g. Belts"
                      autoFocus
                      className="w-full h-10 border border-line px-3 text-[13px] focus:outline-none focus:border-black transition-colors duration-200"
                    />
                    <p className="mt-1.5 text-[11px] text-black/40">
                      It will be added under {form.category} and become selectable from then on.
                    </p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Colors (comma separated)</label>
                  <input
                    type="text"
                    name="colors"
                    value={form.colors}
                    onChange={handleFormChange}
                    className="w-full h-10 border border-line px-3 text-[13px] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="e.g. Black, White, Blue"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">Sizes (comma separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    value={form.sizes}
                    onChange={handleFormChange}
                    className="w-full h-10 border border-line px-3 text-[13px] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="e.g. S, M, L, XL"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] tracking-label uppercase text-black/45 mb-2">
                    Images (1-{MAX_IMAGES})
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      {images.length} / {MAX_IMAGES} selected
                    </span>
                  </label>
                  {colorList.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] tracking-label uppercase text-black/45">
                        Add images for
                      </span>
                      <Select
                        size="sm"
                        value={uploadColor}
                        onChange={(e) => setUploadColor(e.target.value)}
                        aria-label="Colour for new uploads"
                      >
                        <option value="">All colours</option>
                        {colorList.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={images.length >= MAX_IMAGES}
                  />
                  {images.length >= MAX_IMAGES && (
                    <div className="text-xs text-gray-500 mt-1">
                      Maximum reached — remove an image to add another.
                    </div>
                  )}
                  {colorList.length === 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Add colours above to file images under a specific colour.
                    </div>
                  )}

                  {/* Grouped by colour, so it is obvious which shots a shopper
                      will see for each swatch. */}
                  <div className="mt-3 space-y-4">
                    {[...colorList, ''].map((groupColor) => {
                      const groupImages = images.filter((img) => colorOf(img) === groupColor);
                      if (groupImages.length === 0) return null;
                      return (
                        <div key={groupColor || '__all__'}>
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            {groupColor || 'All colours'} ({groupImages.length})
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {groupImages.map((img) => (
                              <div key={img.key} className="relative group">
                                <img
                                  src={img.kind === 'existing' ? getImageUrl(img.url) : img.url}
                                  alt="preview"
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                                  onClick={() => removeImage(img.key)}
                                  title="Remove"
                                  aria-label="Remove image"
                                ><X size={11} strokeWidth={2.2} /></button>
                                {colorList.length > 0 && (
                                  <Select
                                    size="xs"
                                    className="mt-1 w-16"
                                    value={colorOf(img)}
                                    onChange={(e) => setImageColor(img.key, e.target.value)}
                                    title="Colour this image belongs to"
                                    aria-label="Colour this image belongs to"
                                  >
                                    <option value="">All</option>
                                    {colorList.map((c) => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </Select>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="shrink-0 px-8 py-4 border-t border-line bg-white">
                <button
                  type="submit"
                  className="w-full h-11 bg-black text-white text-[11px] tracking-label uppercase font-medium hover:bg-carbon transition-colors duration-200"
                >
                  {editId ? 'Update' : 'Add'} product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductManager; 
