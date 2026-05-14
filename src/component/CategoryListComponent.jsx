import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import orderingStore from "../store/orderingStore";
import useSessionStore from "../store/useSessionStore";
import "./CategoryListComponent.css";

const CategoryListComponent = () => {
  const {
    catalogModels,
    catalogItems,
    cartItems,
    loading,
    errorMessage,
    selectedCatalogId,
    mainCatalogues,
    getCatalogModels,
    getCatalogItems,
    getMainCatalogues,
    clearCatalog,
    addToCart,
    updateQty,
    deleteCartItem,
    getCart
  } = orderingStore();

  const { isLoggedIn } = useSessionStore();
  const navigate = useNavigate();

  const [cartMap, setCartMap] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [addError, setAddError] = useState(null);
  const [selectedMainCatalogue, setSelectedMainCatalogue] = useState(null);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    getMainCatalogues();
    getCatalogModels();
    getCart();
  }, []);

  /* ================= MAP CART ================= */

  useEffect(() => {
    const map = {};
    cartItems.forEach((item) => {
      const variantKey = item.variant_id
        ? `${item.item_id}_${item.variant_id}`
        : `${item.item_id}`;
      map[variantKey] = { quantity: Number(item.quantity), cart_id: item.cart_id };
      if (!item.variant_id) {
        map[`${item.item_id}`] = { quantity: Number(item.quantity), cart_id: item.cart_id };
      }
    });
    setCartMap(map);
  }, [cartItems]);

  /* ================= HELPERS ================= */

  const getImage = (item) => {
    if (Array.isArray(item?.images) && item.images.length > 0) return item.images[0];
    if (Array.isArray(item?.image) && item.image.length > 0) return item.image[0];
    if (typeof item?.image === "string") return item.image;
    return "https://via.placeholder.com/150";
  };

  const getKey = (itemId, variantId = null) =>
    variantId ? `${itemId}_${variantId}` : `${itemId}`;

  const getQty = (itemId, variantId = null) => {
    const exactKey = getKey(itemId, variantId);
    if (cartMap[exactKey]) return cartMap[exactKey].quantity;
    return cartMap[`${itemId}`]?.quantity || 0;
  };

  const getCartId = (itemId, variantId = null) => {
    const exactKey = getKey(itemId, variantId);
    if (cartMap[exactKey]) return cartMap[exactKey].cart_id;
    return cartMap[`${itemId}`]?.cart_id;
  };

  /* ================= FILTERED SUB-CATEGORIES ================= */

  const filteredCatalogModels = useMemo(() => {
    if (!selectedMainCatalogue) return [];
    return catalogModels.filter(
      (cat) => Number(cat.main_catalogue_id) === Number(selectedMainCatalogue.id)
    );
  }, [selectedMainCatalogue, catalogModels]);

  /* ================= HANDLERS ================= */

  const handleMainCatalogueSelect = (mc) => {
    setSelectedMainCatalogue(mc);
    setAddError(null);
  };

  const handleSubCategorySelect = (cat) => {
    setAddError(null);
    getCatalogItems(cat.id);
  };

  const handleBackToSubCategories = () => {
    clearCatalog();
    setAddError(null);
  };

  const handleBackToMainCatalogues = () => {
    clearCatalog();
    setSelectedMainCatalogue(null);
    setAddError(null);
  };

  const handleAdd = async (item) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setAddError(null);
    setIsUpdating(true);
    const success = await addToCart({
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
    if (!success) setAddError(errorMessage || "Failed to add item. Please try again.");
    setIsUpdating(false);
  };

  const handleIncrease = async (item) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    const cartId = getCartId(item.id, item?.variant?.id || item?.variant_id || null);
    if (!cartId) return;
    setIsUpdating(true);
    await updateQty(cartId, "inc");
    await getCart();
    setIsUpdating(false);
  };

  const handleDecrease = async (item) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    const cartId = getCartId(item.id, item?.variant?.id || item?.variant_id || null);
    const qty = getQty(item.id, item?.variant?.id || item?.variant_id || null);
    if (!cartId) return;
    setIsUpdating(true);
    if (qty === 1) { await deleteCartItem(cartId); } else { await updateQty(cartId, "dec"); }
    await getCart();
    setIsUpdating(false);
  };

  const handleProductClick = (itemId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/product/${itemId}`);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.total || 0), 0).toFixed(2);

  /* ================= UI ================= */

  const showItems = !!selectedCatalogId;
  const showSubCategories = !!selectedMainCatalogue && !showItems;
  const showMainCatalogues = !selectedMainCatalogue && !showItems;

  return (
    <div className="catalog-page">

      <header className="header">
        {showItems ? (
          <button className="back-btn" onClick={handleBackToSubCategories}>
            &#8592; {selectedMainCatalogue?.name || "Categories"}
          </button>
        ) : showSubCategories ? (
          <button className="back-btn" onClick={handleBackToMainCatalogues}>
            &#8592; Categories
          </button>
        ) : (
          <h1>Catalog</h1>
        )}
        <Link to="/">Home</Link>
      </header>

      {loading && <p className="loading">Loading...</p>}

      {addError && (
        <div className="cart-error-banner" onClick={() => setAddError(null)}>
          {addError}
        </div>
      )}

      {/* ====== LEVEL 1: MAIN CATALOGUES ====== */}

      {showMainCatalogues && (
        <div className="main-catalogue-grid">
          {mainCatalogues.map((mc) => (
            <div
              key={mc.id}
              className="main-catalogue-card"
              onClick={() => handleMainCatalogueSelect(mc)}
            >
              {mc.image && (
                <img src={mc.image} alt={mc.name} className="main-cat-image" />
              )}
              <span className="main-cat-name">{mc.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* ====== LEVEL 2: SUB-CATEGORIES ====== */}

      {showSubCategories && (
        <>
          <h2 className="sub-cat-heading">{selectedMainCatalogue.name}</h2>
          <div className="main-catalogue-grid">
            {filteredCatalogModels.map((cat) => (
              <div
                key={cat.id}
                className="main-catalogue-card"
                onClick={() => handleSubCategorySelect(cat)}
              >
                <img src={getImage(cat)} alt={cat.name} className="main-cat-image" />
                <span className="main-cat-name">{cat.name}</span>
              </div>
            ))}
            {filteredCatalogModels.length === 0 && !loading && (
              <p className="loading">No sub-categories found.</p>
            )}
          </div>
        </>
      )}

      {/* ====== LEVEL 3: ITEMS ====== */}

      {showItems && (
        <div className="items-grid">
          {catalogItems.map((item) => {
            const qty = getQty(item.id);
            return (
              <div key={item.id} className="item-card">
                <div
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleProductClick(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProductClick(item.id);
                    }
                  }}
                >
                  <div className="item-image-container">
                    <img src={getImage(item)} alt={item.name} className="item-image" />
                  </div>
                  <h4 className="item-name">{item.name}</h4>
                  <p className="price">&#8377;{item.price}</p>
                </div>
                {qty === 0 ? (
                  <button className="add-btn" onClick={() => handleAdd(item)} disabled={isUpdating}>
                    ADD
                  </button>
                ) : (
                  <div className="qty-box">
                    <button onClick={() => handleDecrease(item)} disabled={isUpdating} className="qty-btn">&#8722;</button>
                    <span className="qty-value">{qty}</span>
                    <button onClick={() => handleIncrease(item)} disabled={isUpdating} className="qty-btn">+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalItems > 0 && (
        <div className="cart-bar">
          <Link to="/checkout">View Cart ({totalItems}) - &#8377;{totalPrice}</Link>
        </div>
      )}

    </div>
  );
};

export default CategoryListComponent;
