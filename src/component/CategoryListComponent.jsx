import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderingStore from '../store/orderingStore';
import './CategoryListComponent.css';

const CategoryListComponent = () => {
  const { catalogModels, getCatalogModels, loading, catalogItems, getCatalogItems, selectedCatalogId } = orderingStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getCatalogModels();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    getCatalogItems(categoryId);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1C1C1C',
      color: '#fff',
      padding: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    navLink: {
      color: '#E50914',
      textDecoration: 'none',
    },
    categoryGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    categoryCard: {
      backgroundColor: '#2A2A2A',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    categoryImage: {
      width: '80px',
      height: '80px',
      borderRadius: '10px',
      objectFit: 'cover',
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    categoryDesc: {
      fontSize: '14px',
      color: '#aaa',
    },
    loadingText: {
      textAlign: 'center',
      color: '#aaa',
      marginTop: '20px',
    },
    itemsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
      marginTop: '20px',
    },
    itemCard: {
      backgroundColor: '#2A2A2A',
      borderRadius: '15px',
      padding: '15px',
    },
    itemImage: {
      width: '100%',
      height: '120px',
      borderRadius: '10px',
      objectFit: 'cover',
      marginBottom: '10px',
    },
    itemName: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    itemPrice: {
      fontSize: '16px',
      color: '#E50914',
      fontWeight: 'bold',
    },
    itemComparePrice: {
      fontSize: '12px',
      color: '#666',
      textDecoration: 'line-through',
      marginLeft: '8px',
    },
    addButton: {
      backgroundColor: '#E50914',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '10px',
      marginTop: '10px',
      width: '100%',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    backButton: {
      backgroundColor: '#333',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '10px',
      marginBottom: '20px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          {selectedCatalogId ? 'Items' : 'Categories'}
        </h1>
        <Link to="/" style={styles.navLink}>Home</Link>
      </header>

      {selectedCatalogId && (
        <button style={styles.backButton} onClick={() => setSelectedCategory(null)}>
          ← Back to Categories
        </button>
      )}

      {loading && <p style={styles.loadingText}>Loading...</p>}

      {!selectedCatalogId ? (
        <div style={styles.categoryGrid}>
          {catalogModels.map((category) => (
            <div 
              key={category.id} 
              style={styles.categoryCard}
              onClick={() => handleCategorySelect(category.id)}
            >
              <img 
                src={category.image || 'https://via.placeholder.com/80'} 
                alt={category.name}
                style={styles.categoryImage}
              />
              <div style={styles.categoryInfo}>
                <h3 style={styles.categoryName}>{category.name}</h3>
                <p style={styles.categoryDesc}>{category.description || 'View items'}</p>
              </div>
            </div>
          ))}
          {catalogModels.length === 0 && !loading && (
            <p style={styles.loadingText}>No categories available</p>
          )}
        </div>
      ) : (
        <div style={styles.itemsGrid}>
          {catalogItems.map((item) => (
            <div key={item.id} style={styles.itemCard}>
              <img 
                src={item.image || 'https://via.placeholder.com/150'} 
                alt={item.name}
                style={styles.itemImage}
              />
              <h4 style={styles.itemName}>{item.name}</h4>
              <div>
                <span style={styles.itemPrice}>₹{item.price}</span>
                {item.compare_price && (
                  <span style={styles.itemComparePrice}>₹{item.compare_price}</span>
                )}
              </div>
              <button style={styles.addButton}>Add to Cart</button>
            </div>
          ))}
          {catalogItems.length === 0 && !loading && (
            <p style={styles.loadingText}>No items available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryListComponent;

