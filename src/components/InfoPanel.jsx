import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'https://6905b069ee3d0d14c13361c0.mockapi.io/product';

const fetchProducts = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

const InfoPanel = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isLoading) {
    return (
      <div className="info-panel">
        <h2>📊 Ma'lumotlar Paneli</h2>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  const totalValue = products.reduce((sum, product) => sum + product.price, 0);
  const totalCount = products.length;

  return (
    <div className="info-panel">
      <h2>📊 Ma'lumotlar Paneli</h2>
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Jami Mahsulotlar</h3>
            <p className="stat-value">{totalCount}</p>
            <p className="stat-label">ta mahsulot</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Umumiy Qiymat</h3>
            <p className="stat-value">{totalValue.toLocaleString()}</p>
            <p className="stat-label">so'm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;