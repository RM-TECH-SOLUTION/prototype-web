import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderingStore from '../store/orderingStore';
import './ProductDetailComponent.css';

const ProductDetailComponent = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { catalogItems, cartItems, addToCart, updateQty, deleteCartItem, getCart } = orderingStore();

  // Find product from catalogItems
  const product = catalogItems.find(item => item.id === parseInt(productId));

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullSpec, setShowFullSpec] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize variant and quantity when product loads
  useEffect(() => {
    if (product) {
      setSelectedVariant(product?.variants?.[0] || null);
      // Check if product is already in cart
      const cartItem = cartItems.find(ci => ci.item_id === product.id);
      if (cartItem) {
        setQuantity(parseInt(cartItem.quantity) || 1);
      } else {
        setQuantity(1);
      }
    }
  }, [product, cartItems]);

  // Re-check cart when cartItems change
  useEffect(() => {
    if (product) {
      const cartItem = cartItems.find(ci => ci.item_id === product.id);
      if (cartItem && !isUpdating) {
        setQuantity(parseInt(cartItem.quantity) || 1);
      }
    }
  }, [cartItems, product, isUpdating]);

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">
          <h2>Product not found</h2>
          <button className="product-back-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getImageUri = (item, index = 0) => {
    if (Array.isArray(item?.images) && item.images.length > 0) {
      return item.images[index] || item.images[0];
    }
    if (Array.isArray(item?.image) && item.image.length > 0) {
      return item.image[index] || item.image[0];
    }
    if (typeof item?.image === 'string') return item.image;
    return 'https://via.placeholder.com/300';
  };

  // Get all images from product
  const getAllImages = () => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images;
    }
    if (Array.isArray(product?.image) && product.image.length > 0) {
      return product.image;
    }
    if (typeof product?.image === 'string') {
      return [product.image];
    }
    return ['https://via.placeholder.com/300'];
  };

  const images = getAllImages();

  // Check if product already in cart
  const cartItem = cartItems.find(ci => ci.item_id === product.id);
  const currentQty = cartItem ? parseInt(cartItem.quantity) : 0;
  const cartId = cartItem?.cart_id;

  const handleAddToCart = async () => {
    if (selectedVariant) {
      await addToCart({
        item_id: product.id,
        item_name: product.name,
        description: product.description || '',
        price: selectedVariant.price || product.price,
        compare_price: selectedVariant.compare_price || product.mrp,
        quantity: 1,
        variant_id: selectedVariant.variant_id,
        variant_name: selectedVariant.variant_name
      });
      await getCart();
      setQuantity(1);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Handle increment - update cart directly
  const handleIncrement = async () => {
    if (cartId) {
      setIsUpdating(true);
      await updateQty(cartId, 'inc');
      await getCart();
      setIsUpdating(false);
    } else {
      // If not in cart, add to cart with current quantity + 1
      const newQty = quantity + 1;
      await addToCart({
        item_id: product.id,
        item_name: product.name,
        description: product.description || '',
        price: selectedVariant?.price || product.price,
        compare_price: selectedVariant?.compare_price || product.mrp,
        quantity: newQty,
        variant_id: selectedVariant?.variant_id,
        variant_name: selectedVariant?.variant_name
      });
      await getCart();
      setQuantity(newQty);
    }
  };

  // Handle decrement - update cart directly or remove if qty becomes 0
  const handleDecrement = async () => {
    if (cartId) {
      setIsUpdating(true);
      if (currentQty <= 1) {
        await deleteCartItem(cartId);
        setQuantity(1);
      } else {
        await updateQty(cartId, 'dec');
      }
      await getCart();
      setIsUpdating(false);
    } else if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle manual quantity input
  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    const newQty = Math.max(1, val);
    setQuantity(newQty);
  };

  const handleQuantityBlur = async () => {
    if (cartId && quantity !== currentQty) {
      // If quantity changed manually, we need to sync with cart
      // For now, just ensure it's at least 1
      setQuantity(Math.max(1, quantity));
    }
  };

  return (
    <div className="product-detail-container">
      {/* Header */}
      <div className="product-header">
        <button className="product-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="product-title">{product.name}</h1>
      </div>

      {/* Product Details */}
      <div className="product-detail-content">
        {/* Image Gallery */}
        <div className="product-image-section">
          <div className="product-main-image">
            <img 
              src={getImageUri(product, activeImageIndex)} 
              alt={product.name} 
              className="product-main-img"
            />
          </div>
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Variant ${idx}`}
                  className={`product-thumbnail ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="product-details-section">
          {/* Price */}
          <div className="product-price-section">
            <span className="product-price">₹{selectedVariant?.price || product.price}</span>
            {(selectedVariant?.compare_price || product.mrp) && 
             (selectedVariant?.compare_price || product.mrp) > (selectedVariant?.price || product.price) && (
              <span className="product-mrp">₹{selectedVariant?.compare_price || product.mrp}</span>
            )}
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="product-variant-section">
              <label className="product-variant-label">Select Variant:</label>
              <div className="product-variant-options">
                {product.variants.map((variant) => (
                  <button
                    key={variant.variant_id}
                    className={`product-variant-btn ${selectedVariant?.variant_id === variant.variant_id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Control - Integrated with Cart */}
          <div className="product-quantity-section">
            <label className="product-quantity-label">
              {currentQty > 0 ? `In Cart: ${currentQty}` : 'Quantity:'}
            </label>
            <div className="product-quantity-control">
              <button
                className="product-qty-btn"
                onClick={handleDecrement}
                disabled={isUpdating}
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                className="product-qty-input"
                min="1"
              />
              <button
                className="product-qty-btn"
                onClick={handleIncrement}
                disabled={isUpdating}
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="product-description-section">
              <h3 className="product-section-title">Description</h3>
              <p className="product-description">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="product-specs-section">
              <button
                className="product-specs-toggle"
                onClick={() => setShowFullSpec(!showFullSpec)}
              >
                {showFullSpec ? '▼ Hide Specifications' : '▶ Show Specifications'}
              </button>
              {showFullSpec && (
                <div className="product-specs-list">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="product-spec-item">
                      <span className="product-spec-key">{key}</span>
                      <span className="product-spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="product-actions-section">
            <button 
              className="product-add-btn" 
              onClick={handleAddToCart}
              disabled={isUpdating}
            >
              {currentQty > 0 ? `Add More (${currentQty} in cart)` : 'Add to Cart'}
            </button>
            {currentQty > 0 && (
              <button className="product-checkout-btn" onClick={handleCheckout}>
                Go to Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
