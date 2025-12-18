// App.jsx - TO'G'RI VERSIYA
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InfoPanel from './components/InfoPanel';
import ProductsTable from './components/ProductsTable';
import AddProductForm from './components/AddProductForm';
import EditProductModal from './components/EditProductModal';
const queryClient = new QueryClient();

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://6905b069ee3d0d14c13361c0.mockapi.io/product')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Xatolik:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Mahsulotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="admin-container">
        <header className="admin-header">
          <h1>🛍️ Mahsulotlar Admin Paneli</h1>
        </header>

        <main className="admin-main">
          <InfoPanel />
          <AddProductForm />
          <ProductsTable onEditClick={setEditingProduct} />
        </main>

        {editingProduct && (
          <EditProductModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
          />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;