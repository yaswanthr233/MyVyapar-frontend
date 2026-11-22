import React from 'react'

const ProductContext = React.createContext({
    products: [],
    totalProducts: 0,
    lowStockProducts: 0,
    inStockProducts: 0,
    changeProducts: () => {}
});

export default ProductContext;