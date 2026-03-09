import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderingStore from "../store/orderingStore";
import "./CategoryListComponent.css";

const CategoryListComponent = () => {
  const {
    catalogModels,
    catalogItems,
    cartItems,
    loading,
    selectedCatalogId,
    getCatalogModels,
    getCatalogItems,
    addToCart,
    updateQty,
    deleteCartItem,
    getCart
  } = orderingStore();

  const [cartMap, setCartMap] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    getCatalogModels();
    getCart();
  }, []);

  /* ================= MAP CART ================= */

  useEffect(() => {
    const map = {};
    cartItems.forEach((item) => {
      map[item.item_id] = {
        quantity: Number(item.quantity),
        cart_id: item.cart_id
      };
    });
    setCartMap(map);
  }, [cartItems]);

  /* ================= HELPERS ================= */

  const getImage = (item) => {
    if (Array.isArray(item?.images) && item.images.length > 0)
      return item.images[0];

    if (Array.isArray(item?.image) && item.image.length > 0)
      return item.image[0];

    if (typeof item?.image === "string")
      return item.image;

    return "https://via.placeholder.com/150";
  };

  const getQty = (id) => cartMap[id]?.quantity || 0;
  const getCartId = (id) => cartMap[id]?.cart_id;

  /* ================= HANDLERS ================= */

  const handleCategorySelect = (catalogId) => {
    getCatalogItems(catalogId);
  };

  const handleAdd = async (item) => {
    setIsUpdating(true);
    await addToCart({
      item_id: item.id,
      item_name: item.name,
      description: item.description,
      price: item.variant?.price || item.price,
      compare_price: item.variant?.compare_price || item.compare_price,
      variant_id: item.variant?.id,
      variant_name: item.variant?.variant_name,
      quantity: 1
    });
    await getCart();
    setIsUpdating(false);
  };

  const handleIncrease = async (item) => {
    const cartId = getCartId(item.id);
    if (!cartId) return;
    
    setIsUpdating(true);
    await updateQty(cartId, "inc");
    await getCart();
    setIsUpdating(false);
  };

  const handleDecrease = async (item) => {
    const cartId = getCartId(item.id);
    const qty = getQty(item.id);
    
    if (!cartId) return;

    setIsUpdating(true);
    if (qty === 1) {
      await deleteCartItem(cartId);
    } else {
      await updateQty(cartId, "dec");
    }
    await getCart();
    setIsUpdating(false);
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const totalPrice = cartItems
    .reduce((sum, item) => sum + Number(item.total || 0), 0)
    .toFixed(2);

  /* ================= UI ================= */

  return (
    <div className="catalog-page">

      <header className="header">
        <h1>{selectedCatalogId ? "Items" : "Catalog"}</h1>
        <Link to="/">Home</Link>
      </header>

      {loading && <p className="loading">Loading...</p>}

      {!selectedCatalogId && (
        <div className="category-grid">

          {catalogModels.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => handleCategorySelect(cat.id)}
            >
              <img src={getImage(cat)} alt={cat.name} />

              <div>
                <h3>{cat.name}</h3>
                <p>{cat.description || "View items"}</p>
              </div>

            </div>
          ))}

        </div>
      )}

      {selectedCatalogId && (
        <div className="items-grid">

          {catalogItems.map((item) => {

            const qty = getQty(item.id);

            return (
              <div key={item.id} className="item-card">

                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="item-image-container">
                    <img src={getImage(item)} alt={item.name} className="item-image" />
                  </div>
                  <h4 className="item-name">{item.name}</h4>
                  <p className="price">₹{item.price}</p>
                </Link>

                {qty === 0 ? (
                  <button
                    className="add-btn"
                    onClick={() => handleAdd(item)}
                    disabled={isUpdating}
                  >
                    ADD
                  </button>
                ) : (
                  <div className="qty-box">

                    <button 
                      onClick={() => handleDecrease(item)}
                      disabled={isUpdating}
                      className="qty-btn"
                    >
                      −
                    </button>

                    <span className="qty-value">{qty}</span>

                    <button 
                      onClick={() => handleIncrease(item)}
                      disabled={isUpdating}
                      className="qty-btn"
                    >
                      +
                    </button>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

      {totalItems > 0 && (
        <div className="cart-bar">

          <Link to="/checkout">
            View Cart ({totalItems}) - ₹{totalPrice}
          </Link>

        </div>
      )}

    </div>
  );
};

export default CategoryListComponent;

