import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../api/api";

function ProductsCRUD() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then(res => res.data.products),
    onSuccess: (data) => setProducts(data.slice(0, 10)), // faqat 10ta product
  });

  const addProduct = useMutation({
    mutationFn: (newProduct) => {
      setProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
    },
  });

  const updateProduct = useMutation({
    mutationFn: (product) => {
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, ...product } : p))
      );
    },
  });
  const deleteProduct = useMutation({
    mutationFn: (id) => {
      setProducts(prev => prev.filter(p => p.id !== id));
    },
  });

  return (
    <div style={{ padding: "24px" }}>
      <h1>Products</h1>
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "8px" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginRight: "8px" }}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          style={{ marginRight: "8px" }}
        />
        <button
          onClick={() => {
            if (!title || !price || !thumbnail) return;
            addProduct.mutate({ title, price: parseFloat(price), thumbnail });
            setTitle("");
            setPrice("");
            setThumbnail("");
          }}
        >
          Add Product
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "220px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }}
            />
            <h3>{product.title}</h3>
            <p style={{ fontWeight: "bold" }}>${product.price}</p>
            <button
              style={{ marginRight: "8px" }}
              onClick={() =>
                updateProduct.mutate({
                  id: product.id,
                  title: product.title + " (Updated)",
                  price: product.price + 10,
                })
              }
            >
              Update
            </button>
            <button onClick={() => deleteProduct.mutate(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsCRUD;
