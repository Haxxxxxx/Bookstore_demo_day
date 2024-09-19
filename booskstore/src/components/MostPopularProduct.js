import React, { useState, useEffect } from 'react';
import { getMostPopularProduct } from '../api/bookApi';

const MostPopularProduct = () => {
    const [popularProduct, setPopularProduct] = useState(null);

    useEffect(() => {
        const fetchPopularProduct = async () => {
            const product = await getMostPopularProduct();
            setPopularProduct(product);
        };

        fetchPopularProduct();
    }, []);

    return (
        <div>
            {popularProduct ? (
                <>
                <p>{popularProduct.title} - Added {popularProduct.times_added} times</p>
                </>
            ) : (
                <>
                <p>Loading...</p>
                </>
            )}
        </div>
    );
};

export default MostPopularProduct;
