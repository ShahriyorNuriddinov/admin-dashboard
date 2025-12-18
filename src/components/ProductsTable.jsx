import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'https://6905b069ee3d0d14c13361c0.mockapi.io/product';

const fetchProducts = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

const ProductsTable = ({ onEditClick }) => {
  const queryClient = useQueryClient();
  
  // Mahsulotlarni olish
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  // O'chirish mutatsiyasi
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="products-table">
        <div className="table-header">
          <h2>📋 Barcha Mahsulotlar</h2>
        </div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="products-table">
        <div className="table-header">
          <h2>📋 Barcha Mahsulotlar</h2>
          <p className="product-count">0 ta mahsulot</p>
        </div>
        <div className="no-products">
          <p>Hech qanday mahsulot topilmadi. Yangi mahsulot qo'shing!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-table">
      <div className="table-header">
        <h2>📋 Barcha Mahsulotlar</h2>
        <p className="product-count">{products.length} ta mahsulot</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Rasm</th>
              <th>Nomi</th>
              <th>Narxi</th>
              <th>Kategoriya</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  <img 
                    src={product.img} 
                    alt={product.title}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                    }}
                  />
                </td>
                <td>{product.title}</td>
                <td className="price-cell">
                  {product.price.toLocaleString()} so'm
                </td>
                <td>
                  <span className={`category-badge category-${product.category}`}>
                    {product.category}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => onEditClick(product)}
                    >
                      ✏️ Tahrirlash
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? '...' : '🗑️ O\'chirish'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;