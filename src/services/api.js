import axios from 'axios';

const API_URL = 'https://6905b069ee3d0d14c13361c0.mockapi.io/product';

export const productAPI = {
  getProducts: async () => {
    const { data } = await axios.get(API_URL);
    return data;
  },

  addProduct: async (product) => {
    const { data } = await axios.post(API_URL, product);
    return data;
  },

  updateProduct: async (id, updates) => {
    const { data } = await axios.put(`${API_URL}/${id}`, updates);
    return data;
  },
  deleteProduct: async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  }
};