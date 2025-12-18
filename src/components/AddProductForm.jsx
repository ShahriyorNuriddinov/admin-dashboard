// AddProductForm.jsx - TO'G'RI VERSIYA
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'https://6905b069ee3d0d14c13361c0.mockapi.io/product';

const AddProductForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'smartphone',
    img: ''
  });

  // useMutation - yangi mahsulot qo'shish
  const addMutation = useMutation({
    mutationFn: (newProduct) => axios.post(API_URL, newProduct),
    onSuccess: () => {
      // Muvaffaqiyatli qo'shilgandan so'ng:
      // 1. Formani tozalash
      setFormData({
        title: '',
        price: '',
        category: 'smartphone',
        img: ''
      });
      
      // 2. Products so'rovini yangilash
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // 3. Xabar ko'rsatish
      alert('Mahsulot muvaffaqiyatli qo\'shildi!');
    },
    onError: (error) => {
      alert(`Xatolik: ${error.message}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price) {
      alert('Iltimos, mahsulot nomi va narxini kiriting!');
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price), // String -> Number
      // Agar ID avtomatik yaratilmasa
      id: Date.now() // Vaqtinchalik ID
    };

    addMutation.mutate(productData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-product-form">
      <h2>➕ Yangi Mahsulot Qo'shish</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Mahsulot Nomi *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masalan: iPhone 15 Pro"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Narxi (so'm) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Masalan: 15000000"
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kategoriya</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="smartphone">📱 Telefon</option>
              <option value="smartwatch">⌚ Smart Watch</option>
              <option value="laptop">💻 Noutbuk</option>
              <option value="gaming">🎮 Gaming</option>
              <option value="camera">📸 Kamera</option>
              <option value="accessories">🔧 Aksessuar</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Rasm URL (ixtiyoriy)</label>
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? 'Qo\'shilmoqda...' : '✅ Mahsulot Qo\'shish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;