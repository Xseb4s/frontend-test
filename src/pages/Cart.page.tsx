import { useCart } from "../hooks/useCart.hook";

const Cart = () => {
  const { cartData } = useCart();

  const renderCartItems = () => {
    if (!Array.isArray(cartData) || cartData.length === 0) {
      return <p>No items in cart</p>;
    }
  
    return cartData.map((product) => (
      <div key={product.id} className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg">
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-lg font-semibold text-gray-800">${product.price}</p>
        
      </div>
    ));
  };

  return (
    <>
      <aside className="bg-gray-400 p-4 w-96 h-screen flex flex-col justify-between py-10">
              <div >
                <h2 className="text-lg font-semibold mb-4 text-center text-white">Cart Items</h2>
                  {renderCartItems()}
              </div>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 mt-4 w-full hover:bg-green-600"
              >
                Checkout
              </button>
      </aside>
    </>
  );
};

export default Cart;
