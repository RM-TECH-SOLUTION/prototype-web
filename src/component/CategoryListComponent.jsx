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

  /* ================= HANDLERS ================= */

  const handleCategorySelect = (catalogId) => {
    getCatalogItems(catalogId);
  };

  const handleAdd = async (item) => {
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
  };

  const handleIncrease = async (item) => {
    if (!cartMap[item.id]) return;
    await updateQty(cartMap[item.id].cart_id, "inc");
  };

  const handleDecrease = async (item) => {
    if (!cartMap[item.id]) return;

    if (cartMap[item.id].quantity === 1) {
      await deleteCartItem(cartMap[item.id].cart_id);
    } else {
      await updateQty(cartMap[item.id].cart_id, "dec");
    }
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

                <img src={getImage(item)} alt={item.name} />

                <h4>{item.name}</h4>

                <p className="price">₹{item.price}</p>

                {qty === 0 ? (
                  <button
                    className="add-btn"
                    onClick={() => handleAdd(item)}
                  >
                    ADD
                  </button>
                ) : (
                  <div className="qty-box">

                    <button onClick={() => handleDecrease(item)}>
                      -
                    </button>

                    <span>{qty}</span>

                    <button onClick={() => handleIncrease(item)}>
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