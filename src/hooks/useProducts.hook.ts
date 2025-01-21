import { useState, useEffect } from 'react';
import { ReadProducts } from '../service/product.service';
import { ProductsInterface } from '../types/products.interface';

const useProducts = () => {
    const [productData, setProductData] = useState<ProductsInterface[]>([]);
    const [filteredData, setFilteredData] = useState<ProductsInterface[]>([]);
    const [error, setError] = useState<boolean>(false);

    const getProducts = async () => {
        const { data, error } = await ReadProducts();
        if (error) {
            console.log(error);
            setError(error);
        } else {
            setProductData(data);
        }
    };

    const findBestCombination = (budget: number): ProductsInterface[] => {
        const n = productData.length;
        const dp = Array.from({ length: n + 1 }, () => 
            Array(budget + 1).fill(0)
        );

        for (let i = 1; i <= n; i++) {
            for (let w = 1; w <= budget; w++) {
                const { price } = productData[i - 1];
                if (price <= w) {
                    dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - price] + price);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        let w = budget;
        const selectedProducts: ProductsInterface[] = [];

        for (let i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                const product = productData[i - 1];
                selectedProducts.push(product);
                w -= product.price;
            }
        }

        setFilteredData(selectedProducts.reverse());
        return selectedProducts;
    };

    useEffect(() => {
        getProducts(); 
    }, []);

    return { 
        productData,
        filteredData,
        findBestCombination, 
        error 
    };
};

export default useProducts;
