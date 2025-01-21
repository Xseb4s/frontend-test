import Cart from "./pages/Cart.page"
import Products from "./pages/Products.page"

const App = () =>{

    return (
      <>
        <div className="flex bg-gray-100">
            <Products/>
            <Cart/>
        </div>
      </>
    )
  }
  
  export default App
  