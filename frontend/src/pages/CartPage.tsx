import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="display-5 fw-bold text-primary mb-0">Shopping Cart</h1>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            &larr; Continue Shopping
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5 mb-4">Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            &larr; Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th className="text-end">Price</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.bookId}>
                        <td>{item.title}</td>
                        <td className="text-end">${item.price.toFixed(2)}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">${item.subtotal.toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFromCart(item.bookId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold table-secondary">
                      <td colSpan={3} className="text-end">
                        Total:
                      </td>
                      <td className="text-end">${cartTotal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col d-flex justify-content-between">
              <button
                className="btn btn-outline-danger"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate(-1)}
              >
                &larr; Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
