import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartSummary() {
  const { cartCount, cartTotal } = useCart();

  return (
    /*
     * BOOTSTRAP FEATURE #2: Badge (position-absolute overlay)
     * Uses Bootstrap's Badge component with position utilities
     * (badge, rounded-pill, position-absolute, top-0, start-100,
     * translate-middle) to overlay the item count on the cart button.
     * Location: src/components/CartSummary.tsx
     */
    <Link
      to="/cart"
      className="btn btn-outline-primary position-relative"
      style={{ whiteSpace: 'nowrap' }}
    >
      🛒 Cart
      {cartCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {cartCount}
          <span className="visually-hidden">items in cart</span>
        </span>
      )}
      {cartCount > 0 && (
        <span className="ms-2 text-muted fw-normal">${cartTotal.toFixed(2)}</span>
      )}
    </Link>
  );
}
