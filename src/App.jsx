import { useState, useEffect } from "react";

// Constants
const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

export default function App() {
  // The cart is an array of objects { id, name, price, quantity }
  const [cartItems, setCartItems] = useState([]);

  // Track free gift message state
  const [freeGiftAddedMessage, setFreeGiftAddedMessage] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Add product to cart
  const handleAddToCart = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem) {
        // Increment quantity
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
          },
        ];
      }
    });
  };

  // Update quantity in cart by delta (+1 or -1)
  const handleCartQuantityChange = (productId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  // Remove an item from cart
  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Check free gift logic when subtotal changes
  useEffect(() => {
    const hasFreeGift = cartItems.some((item) => item.id === FREE_GIFT.id);

    if (subtotal >= THRESHOLD && !hasFreeGift) {
      setCartItems((prev) => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setFreeGiftAddedMessage(true);
    } else if (subtotal < THRESHOLD && hasFreeGift) {
      setCartItems((prev) => prev.filter((item) => item.id !== FREE_GIFT.id));
      setFreeGiftAddedMessage(false);
    }
  }, [subtotal, cartItems]);

  const amountRemaining = THRESHOLD - subtotal > 0 ? THRESHOLD - subtotal : 0;
  const progressPercentage = Math.min(
    (subtotal / THRESHOLD) * 100,
    100
  ).toFixed(0);

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      {/* Products List */}
      <div className="products">
        <h2>Products</h2>
        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button
                className="add-button"
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary & Progress */}
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <p>
          Subtotal: <strong>₹{subtotal}</strong>
        </p>

        {subtotal < THRESHOLD ? (
          <>
            <p>
              Add <strong>₹{amountRemaining}</strong> more to get a{" "}
              <strong>FREE Wireless Mouse!</strong>
            </p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </>
        ) : (
          <p className="free-gift-message">You got a free Wireless Mouse!</p>
        )}
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        <h2>Cart Items</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <strong>{item.name}</strong> — ₹{item.price} x {item.quantity}{" "}
                  = ₹{item.price * item.quantity}
                  {item.id === FREE_GIFT.id && (
                    <span className="free-gift-label"> (FREE GIFT)</span>
                  )}
                </div>
                {item.id !== FREE_GIFT.id && (
                  <div className="cart-item-controls">
                    <button
                      className="minus-button"
                      onClick={() => handleCartQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="item-quantity">{item.quantity}</span>
                    <button
                      className="plus-button"
                      onClick={() => handleCartQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
