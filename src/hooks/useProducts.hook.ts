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
        const sortedProducts = [...productData].sort((a, b) => b.price - a.price);
        let remainingBudget = budget;
    
        const selectedProducts = sortedProducts.reduce((acc, product) => {
            if (product.price <= remainingBudget) {
                acc.push(product);
                remainingBudget -= product.price;
            }
            return acc;
        }, [] as ProductsInterface[]);
    
        setFilteredData(selectedProducts);
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
