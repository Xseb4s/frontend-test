import Card from "../components/card.component";
import { useCart } from "../hooks/useCart.hook";
import useProducts from "../hooks/useProducts.hook";

const Products = () => {
  const { productData, findBestCombination, filteredData } = useProducts();
  const { addCart } = useCart();

  const handleSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const budget = parseInt(e.target.value, 10);
    if (!isNaN(budget)) {
      findBestCombination(budget);
    }
  };

  const renderProducts = () => {
    const productsToRender = filteredData.length > 0 ? filteredData : productData;
    return productsToRender.map((product) => (
        <Card key={product.id}>
            <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-lg font-semibold text-gray-800">${product.price}</p>
                <button
                    className="bg-green-500 text-white px-4 py-2 mt-4 w-full hover:bg-green-600"
                    onClick={() => addCart(product.id)}
                >
                    Add to cart
                </button>
            </div>
        </Card>
    ));
};


  return (
    <>
      <div className="flex-1 p-10 flex flex-col items-center">
        {/* usé un select, para hacerlo más fácil */}
        <select
          name="amount"
          className="w-1/4 p-2 border-0 border-gray-400 focus:outline-none focus:border-gray-600"
          onChange={handleSearch}
        >
          <option value={0}>Select max amount</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={110}>110</option>
          <option value={120}>120</option>
          <option value={150}>150</option>
          <option value={200}>200</option>
        </select>
        <div className="grid gap-4 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full max-w-screen-xl mt-10">
          {renderProducts()}
        </div>
      </div>
    </>
  );
};

export default Products;
