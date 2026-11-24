import './editpopup.css';
import { IoClose } from "react-icons/io5";
import Popup from 'reactjs-popup';
import { RiBox1Line } from "react-icons/ri";
import { useState } from 'react';
import ProductContext from '../../context/productContext.jsx';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import LoadingView from '../LoadingView/loadingView.jsx';

const EditPopup = ({ product, onClose }) => {

    const {products,changeProducts,lowStockProducts,inStockProducts,totalProducts} = useContext(ProductContext);
    const [existingProduct, setExistingProduct] = useState(product);
    const [isLoading, setIsLoading] = useState(false);
    const sellingPrice = Number(existingProduct.sellingPrice);
    const gstRate = Number(existingProduct.gstRate);
    const finalPrice = existingProduct.taxInclusive ? sellingPrice : sellingPrice + (sellingPrice * gstRate / 100);
    const onUpdateProduct = async (e) => {
        e.preventDefault();
        try{
            setIsLoading(true);
            const sellingPrice = Number(existingProduct.sellingPrice);
            const gstRate = Number(existingProduct.gstRate);
            const finalPrice = existingProduct.taxInclusive ? sellingPrice : sellingPrice + (sellingPrice * gstRate / 100);
            existingProduct.sellingPrice = finalPrice;
            const actualPrice = existingProduct.taxInclusive ? sellingPrice - (sellingPrice * gstRate / 100) : sellingPrice;
            existingProduct.actualPrice = actualPrice;
            const productToUpdate = {
                ...existingProduct,
                sellingPrice: finalPrice,
                actualPrice: actualPrice
            };
            const token = Cookies.get('token');
            const options = {
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productToUpdate)
            };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${existingProduct._id}`, options);
            if(!response.ok){
                alert('Failed to update product');
                return;
            }
            const updatedProduct = await response.json();
            const updatedProducts = products.map((p) => p._id === updatedProduct.product._id ? updatedProduct.product : p);
            changeProducts({
                    products: updatedProducts,
                    totalProducts,
                    lowStockProducts,
                    inStockProducts
                });
            onClose();
        } catch(err){
            alert('Error updating product: ' + err.message);
        } finally{
            setIsLoading(false);
        }
    }
    
    return (
        <Popup open={true} onClose={onClose}  
        overlayStyle={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(3px)'
                }}
                contentStyle={{
                    height: '80%',
                    width: '80%',
                    padding: '10px 20px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                    }}>
            <div className="edit-popup">
                <div className="edit-popup-header">
                    <h2 className="edit-popup-title">Edit Product</h2>
                    <button className="edit-popup-close-btn" onClick={onClose}>
                        <IoClose size="24px" />
                    </button>
                </div>
                <div className="edit-popup-content">
                    <form className="edit-popup-form" onSubmit={onUpdateProduct}>
                    <div className="edit-popup-form-group">
                        <label htmlFor="productName">Product Name:</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="text" id="productName" name="productName" placeholder="Enter product name" className="edit-product-popup-form-input" value={existingProduct.productName} onChange={(e) => setExistingProduct({...existingProduct, productName: e.target.value})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="category">Category :</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="text" id="category" name="category" placeholder="Enter category" className="edit-product-popup-form-input" value={existingProduct.category} onChange={(e) => setExistingProduct({...existingProduct, category: e.target.value})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="sku">SKU :</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="text" id="sku" name="sku" placeholder="Enter SKU" className="edit-product-popup-form-input" value={existingProduct.sku} onChange={(e) => setExistingProduct({...existingProduct, sku: e.target.value})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="hsn-code">HSN Code :</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="text" id="hsn-code" name="hsn-code" placeholder="Enter HSN code" className="edit-product-popup-form-input" value={existingProduct.hsnCode? existingProduct.hsnCode : ''} onChange={(e) => setExistingProduct({...existingProduct, hsnCode: e.target.value})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="purchase-price">Purchase Price:</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="number" id="purchase-price" name="purchase-price" placeholder="Enter purchase price" className="edit-product-popup-form-input" value={existingProduct.purchasePrice} onChange={(e) => setExistingProduct({...existingProduct, purchasePrice: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="selling-price">Selling Price:</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="number" id="selling-price" name="selling-price" placeholder="Enter selling price" className="edit-product-popup-form-input" value={existingProduct.sellingPrice} onChange={(e) => setExistingProduct({...existingProduct, sellingPrice: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="quantity">Quantity :</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="number" id="quantity" name="quantity" placeholder="Enter quantity" className="edit-product-popup-form-input" value={existingProduct.quantity} onChange={(e) => setExistingProduct({...existingProduct, quantity: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="gst-rate">GST Rate:</label>
                        <div className="edit-product-popup-form-input-container">
                            <RiBox1Line color="#000" size="20px" className="edit-product-popup-form-icon" />
                            <input type="number" id="gst-rate" name="gst-rate" placeholder="Enter GST rate" className="edit-product-popup-form-input" value={existingProduct.gstRate} onChange={(e) => setExistingProduct({...existingProduct, gstRate: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="edit-popup-form-group">
                        <label htmlFor="isSellingPriceGSTIncluded" className="edit-product-popup-form-label">Is Sellig Price GST Included? <span className="required">*</span></label>
                                <div className="edit-product-popup-form-input-container-radio">
                                    <input type="radio" id="isSellingPriceGSTIncludedYes" name="isSellingPriceGSTIncluded" value="yes" className="edit-product-popup-form-radio-input" 
                                            checked={existingProduct.taxInclusive === true} onChange={() => {setExistingProduct({...existingProduct, taxInclusive: true});}} />
                                    <label htmlFor="isSellingPriceGSTIncludedYes" className="edit-product-popup-form-radio-label">Yes</label>
                                    <input type="radio" id="isSellingPriceGSTIncludedNo" name="isSellingPriceGSTIncluded" value="no" className="edit-product-popup-form-radio-input" checked={existingProduct.taxInclusive === false} onChange={() => {setExistingProduct({...existingProduct, taxInclusive: false});}} />
                                    <label htmlFor="isSellingPriceGSTIncludedNo" className="edit-product-popup-form-radio-label">No</label>
                        </div>
                    </div>
                    <div className="edit-product-popup-form-group-preview">
                         <label className="edit-product-popup-form-label-preview">Price Preview</label>
                                <div className="edit-product-popup-form-preview-yes-no-container">
                                    <p className="gst-final-price">
                                        Final Price: <span className="final-price-preview-text">₹ {finalPrice.toFixed(2)}</span>
                                    </p>   
                                </div>
                            </div>
                    <div className="edit-popup-form-group btn-container">
                        {
                            isLoading ? <LoadingView/> :
                        <button type="submit" className="edit-popup-form-button">Update Product</button>
                        }
                    </div>
                    </form>
                </div>
            </div>
        </Popup>
    );
}

export default EditPopup;