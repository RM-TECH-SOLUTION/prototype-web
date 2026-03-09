import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderingStore from '../store/orderingStore';
import './ProductDetailComponent.css';

const ProductDetailComponent = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { catalogItems, cartItems, addToCart, updateQty } = orderingStore();

  // Find product from catalogItems
  const product = catalogItems.find(item => item.id === parseInt(productId));

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullSpec, setShowFullSpec] = useState(false);

  if (!product) {
    return (
      <div style={styles.container}>
        <div style={styles.notFound}>
          <h2>Product not found</h2>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getImageUri = (item) => {
    if (Array.isArray(item?.images) && item.images.length > 0) return item.images[0];
    if (Array.isArray(item?.image) && item.image.length > 0) return item.image[0];
    if (typeof item?.image === 'string') return item.image;
    return 'https://via.placeholder.com/300';
  };

  const images = Array.isArray(product?.images) ? product.images : [];

  // Check if product already in cart
  const cartItem = cartItems.find(ci => ci.item_id === product.id);
  const currentQty = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if (selectedVariant) {
      await addToCart(
        product.id,
        quantity,
        selectedVariant.variant_id,
        selectedVariant.variant_name
      );
      setQuantity(1);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={styles.title}>{product.name}</h1>
      </div>

      {/* Product Details */}
      <div style={styles.content}>
        {/* Image Gallery */}
        <div style={styles.imageSection}>
          <div style={styles.mainImage}>
            <img src={getImageUri(product)} alt={product.name} style={styles.img} />
          </div>
          {images.length > 1 && (
            <div style={styles.thumbnails}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Variant ${idx}`}
                  style={{
                    ...styles.thumbnail,
                    border: idx === activeImageIndex ? '2px solid #E50914' : '2px solid #444',
                  }}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div style={styles.detailsSection}>
          {/* Price */}
          <div style={styles.priceSection}>
            <span style={styles.price}>₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span style={styles.mrp}>₹{product.mrp}</span>
            )}
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div style={styles.variantSection}>
              <label style={styles.variantLabel}>Select Variant:</label>
              <div style={styles.variantOptions}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.variant_id}
                    style={{
                      ...styles.variantBtn,
                      backgroundColor: selectedVariant?.variant_id === variant.variant_id ? '#E50914' : '#2A2A2A',
                      color: selectedVariant?.variant_id === variant.variant_id ? '#fff' : '#ccc',
                    }}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Control */}
          <div style={styles.quantitySection}>
            <label style={styles.quantityLabel}>Quantity:</label>
            <div style={styles.quantityControl}>
              <button
                style={styles.qtyBtn}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={styles.qtyInput}
              />
              <button
                style={styles.qtyBtn}
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div style={styles.descriptionSection}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.description}>{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div style={styles.specsSection}>
              <button
                style={styles.specsToggle}
                onClick={() => setShowFullSpec(!showFullSpec)}
              >
                {showFullSpec ? '▼ Hide Specifications' : '▶ Show Specifications'}
              </button>
              {showFullSpec && (
                <div style={styles.specsList}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} style={styles.specItem}>
                      <span style={styles.specKey}>{key}:</span>
                      <span style={styles.specValue}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actionsSection}>
            <button style={styles.addBtn} onClick={handleAddToCart}>
              {currentQty > 0 ? `Add More (${currentQty} in cart)` : 'Add to Cart'}
            </button>
            {currentQty > 0 && (
              <button style={styles.checkoutBtn} onClick={handleCheckout}>
                Go to Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
    alignItems: 'center',
    marginBottom: '30px',
    gap: '15px',
  },
  backBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#E50914',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    gap: '20px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  mainImage: {
    width: '100%',
    aspectRatio: '1',
    backgroundColor: '#2A2A2A',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnails: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    cursor: 'pointer',
    objectFit: 'cover',
    transition: 'border-color 0.3s',
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#E50914',
  },
  mrp: {
    fontSize: '20px',
    color: '#888',
    textDecoration: 'line-through',
  },
  variantSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  variantLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ccc',
  },
  variantOptions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  variantBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #444',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  quantitySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  quantityLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ccc',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '150px',
  },
  qtyBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#2A2A2A',
    color: '#E50914',
    border: '1px solid #E50914',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  qtyInput: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2A2A2A',
    border: '1px solid #444',
    borderRadius: '6px',
    color: '#fff',
    textAlign: 'center',
    fontSize: '16px',
  },
  descriptionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  description: {
    fontSize: '14px',
    color: '#aaa',
    lineHeight: '1.6',
    margin: 0,
  },
  specsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  specsToggle: {
    backgroundColor: 'transparent',
    border: '1px solid #444',
    color: '#E50914',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  specsList: {
    backgroundColor: '#2A2A2A',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  specItem: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    borderBottom: '1px solid #3A3A3A',
  },
  specKey: {
    color: '#888',
    fontSize: '14px',
  },
  specValue: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
  },
  actionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px',
  },
  addBtn: {
    backgroundColor: '#E50914',
    color: '#fff',
    padding: '15px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  checkoutBtn: {
    backgroundColor: '#2A2A2A',
    color: '#E50914',
    padding: '15px',
    borderRadius: '30px',
    border: '2px solid #E50914',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default ProductDetailComponent;
