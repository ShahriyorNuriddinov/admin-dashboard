import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'https://6905b069ee3d0d14c13361c0.mockapi.io/product';

const EditProductModal = ({ product, onClose }) => {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({
    title: '',
    img: ''
  });

  useEffect(() => {
    if (product) {
      setEditData({
        title: product.title,
        img: product.img
      });
    }
  }, [product]);

  const editMutation = useMutation({
    mutationFn: ({ id, ...updates }) => 
      axios.put(`${API_URL}/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
      alert('Mahsulot muvaffaqiyatli yangilandi!');
    },
    onError: (error) => {
      alert(`Xatolik: ${error.message}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editData.title.trim()) {
      alert('Mahsulot nomi bo\'sh bo\'lishi mumkin emas!');
      return;
    }

    editMutation.mutate({
      id: product.id,
      ...editData
    });
  };

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Mahsulotni Tahrirlash</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Yangilangan nomi *</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              placeholder="Yangi mahsulot nomi"
              required
            />
          </div>

          <div className="form-group">
            <label>Yangilangan rasm URL</label>
            <input
              type="text"
              value={editData.img}
              onChange={(e) => setEditData({...editData, img: e.target.value})}
              placeholder="Yangi rasm manzili"
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? 'Saqlanmoqda...' : '✅ Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;