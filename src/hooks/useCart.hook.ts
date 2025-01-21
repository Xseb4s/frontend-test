import { useState, useEffect } from 'react';
import { AddCart, ReadCart } from '../service/cart.service';
import { ProductsInterface } from '../types/products.interface';

export const useCart = () => {
    const [cartData, setData] = useState<ProductsInterface[]>([]);
    const [error, setError] = useState<boolean>(false);

    const getCart = async () => {
        const { data, error } = await ReadCart();
        if (error) {
            console.error(error);
            setError(error);
        } else {
            setData(data.cart || []);
        }
    };

    const addCart = async (id: number) => {
        try {
            const { data } = await AddCart(id);

            if (data.cart) {
                setData(data.cart);
            } else {
                await getCart();
            }
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };

    useEffect(() => {
        getCart();
    }, [cartData]);

    return { cartData, addCart, error };
};
