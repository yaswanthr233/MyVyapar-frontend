import './inventory.css'
import { IoIosAdd } from "react-icons/io";
import { useContext,useEffect ,useState} from 'react';
import ProductContext from '../../context/productContext.jsx';
import Cookie from 'js-cookie';
import { RiBox2Line } from "react-icons/ri";
import { BsBoxSeamFill } from "react-icons/bs";
import { IoIosWarning } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { PulseLoader } from "react-spinners";
import { MdModeEdit,MdDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import Popup from 'reactjs-popup';
import { RiAddCircleFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { RiBox1Line } from "react-icons/ri";
import { IoCloudUpload } from "react-icons/io5";



const Inventory = () => {
    const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
        return;
    }

    setProductImage(file);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'MyVyapar');

    try {
        const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL,
            {
                method: 'POST',
                body: data
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Image upload failed');
        }

        setProductForm(prev => ({
            ...prev,
            productImage: result.secure_url
        }));

        console.log(result.secure_url);
    } catch (error) {
        console.error('Image upload error:', error);
    }
};
    const defaultImage = "https://res.cloudinary.com/duokznlha/image/upload/v1795336423/Eco_Fertilizer_Bag_with_Sprout_and_Granules_hhqo15.png";
    const {products, changeProducts, totalProducts, lowStockProducts, inStockProducts} = useContext(ProductContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddProductPopup, setShowAddProductPopup] = useState(false);
    const [productImage, setProductImage] = useState(null);
    const [isGstIncluded,setIsGstIncluded] = useState(true)
    const [productForm,setProductForm] = useState({
        productName:'',
        category:'',
        sku:'',
        hsnCode:'',
        productImage:'',
        purchasePrice:0,
        sellingPrice:'',
        productDescription:'',
        gstRate:0,
        unit:'',
        quantity:0,
        taxInclusive:isGstIncluded
    })
    const onDecideFinalPrice = (e) => {
    const price = Number(e.target.value) || 0;

    setProductForm(prev => ({
        ...prev,
        sellingPrice: price
    }));
    };
    const sellingPrice = Number(productForm.sellingPrice) || 0;
    const gstRate = Number(productForm.gstRate) || 0;

    const gstAmount = sellingPrice * gstRate / 100;

    const inclusivePrice = isGstIncluded
        ? sellingPrice
        : sellingPrice + gstAmount;

    const exclusivePrice = isGstIncluded
        ? sellingPrice / (1 + gstRate / 100)
        : sellingPrice;

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookie.get('token')}`
                    }
                }
                console.log("API URL:", import.meta.env.VITE_API_URL);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/products/`, options);
                const data = await response.json();
                if(response.ok){
                    changeProducts(data);
                } else {
                    setError(data.message || 'Please Try Again Later');
                }
            } catch(err){
                setError(err.message || 'An error occurred while fetching products.');
            } finally{
                setLoading(false);
                
            }
        }
        fetchProducts();
        
    },[]);

    const onAddProduct = async (e) => {
        e.preventDefault();
        if(!productForm.productName || !productForm.category || !productForm.sku || !productForm.hsnCode || !productForm.purchasePrice || !productForm.sellingPrice || !productForm.quantity || !productForm.unit || !productForm.gstRate){
            alert('Please fill all required fields');
        }
        try{
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookie.get('token')}`
                },
                body: JSON.stringify(productForm)
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/`, options);
            const data = await response.json();
            if(response.ok){
                changeProducts({
                    products: [...products, data.product],
                    totalProducts: totalProducts + 1,
                    lowStockProducts: lowStockProducts,
                    inStockProducts: inStockProducts
                });
                setShowAddProductPopup(false);
                setProductForm({
                    productName:'',
                    category:'',
                    sku:'',
                    hsnCode:'',
                    productImage:'',
                    purchasePrice:0,
                    quantity:0,
                    unit:'',
                    sellingPrice:0,
                    gstRate:0
                });
                setProductImage(null);
            } else {
                alert(data.message || 'Please Try Again Later');
            }
        } catch(err){
            alert(err.message || 'An error occurred while adding the product.');
        }
    }

    

    const renderLoadingSpinner = () => {
        return (
            <div className="loading-spinner">
                <PulseLoader color="#3661d7" />
            </div>
        )
    }

    const renderProductsTable = () => {
        return (
            <>
            <div className="inventory-table-container larger-devices">
                <table className="inventory-table">
                    <thead className="inventory-table-header">
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="inventory-table-body">
                        {
                            
                            products.map((product) => 
                                {
                                    return (
                                <tr className="inventory-table-row" key={product._id}>
                                    <td className="inventory-product-name-image-container">
                                        <img src={product.productImage || defaultImage} alt={product.productName}  className="inventory-product-image"/>
                                        <span className="inventory-product-text">{product.productName}</span>
                                    </td>
                                    <td className="inventory-product-text">{product.category}</td>
                                    <td className="inventory-product-text">{product.quantity}</td>
                                    <td className="inventory-product-text">₹ {product.sellingPrice}</td>
                                    <td className="inventory-product-text">
                                        <div className="inventory-product-actions-container">
                                            <button className="inventory-product-action-btn edit-btn">
                                                <MdModeEdit color="#0044cb" size="24px" />
                                            </button>
                                            <button className="inventory-product-action-btn delete-btn">
                                                <MdDelete color="#ff0000" size="24px" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                )})
                        }
                    </tbody>
                </table>
            </div>
            <ul className="inventory-table-container-small small-devices">
                {
                    products.map((product) => {
                        const stockClass = product.quantity < 10
                            ? "inventory-product-stock-container-small low-stock"
                            : "inventory-product-stock-container-small";
                        return (
                        <li className="inventory-table-row-small" key={product._id}>
                            <img src={product.productImage || defaultImage} alt={product.productName} className="inventory-product-image"/>
                            <div className="inventory-product-info-small">
                                <p className="inventory-product-text-productName">{product.productName}</p>
                                <p className="inventory-product-text-category">{product.category}</p>
                                <p className="inventory-product-text-sellingPrice">₹ {product.sellingPrice}</p>
                            </div>
                            <div className={stockClass}>
                                <p className={`inventory-product-text-stock ${product.quantity < 10 ? 'warning' : ''}`}>
                                    {product.quantity}
                                </p>
                            </div>
                            <button className="inventory-product-action-btn-small ">
                            <CiMenuKebab color="#000" size="24px" />
                            </button>
                        </li>
                    )})
                }
            </ul>
            </>
        )
    }

    const erroView = () => {
        return (
            <div className="error-view">
                <img src="https://res.cloudinary.com/duokznlha/image/upload/v1789262807/ChatGPT_Image_Sep_13_2026_06_56_06_AM_kw7mzh.png" alt="Error" className="error-image" />
                <p className="error-message">{error}</p>
            </div>
        )
    }

    return (
        <>
        
        {
            showAddProductPopup && (
                <Popup className="add-product-popup" open={showAddProductPopup} onClose={() => setShowAddProductPopup(false)} modal 
                overlayStyle={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(3px)'
                }}
                contentStyle={{
                    height: '80%',
                    width: '80%',
                    padding: '0px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                    }}>    
                    <form className="add-product-popup-container" onSubmit={onAddProduct}>
                        <div className="add-product-popup-header">
                            <div className="add-product-popup-header-content-container">
                            <RiAddCircleFill color="#004cd0" size="36px" className="add-product-popup-icon" />
                            <h2 className="add-product-popup-title">Add Product</h2>
                            </div>
                            <div>
                            <button className="add-product-popup-close-btn" onClick={() => setShowAddProductPopup(false)}>
                                <IoClose size="24px" color="#000" />
                            </button>
                            </div>
                        </div>
                        <div className="add-product-popup-content">
                            <div className="add-product-popup-form-group">
                                <label htmlFor="productName" className="add-product-popup-form-label">Product Name <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input type="text" id="productName" name="productName" placeholder="Enter product name" className="add-product-popup-form-input" onChange={(e) => {
                                        setProductForm(prev => ({
                                            ...prev,
                                            productName: e.target.value
                                        }));
                                    }} />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="category" className="add-product-popup-form-label">Category <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input type="text" id="category" name="category" placeholder="Enter product category" className="add-product-popup-form-input" onChange={(e) => {
                                        setProductForm(prev => ({
                                            ...prev,
                                            category: e.target.value
                                        }));
                                    }} />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="sku" className="add-product-popup-form-label">SKU <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input type="text" id="sku" name="sku" placeholder="Enter product SKU" className="add-product-popup-form-input" onChange={(e) => {
                                        setProductForm(prev => ({
                                            ...prev,
                                            sku: e.target.value
                                        }));
                                    }} />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="hsnCode" className="add-product-popup-form-label">HSN Code <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input type="text" id="hsnCode" name="hsnCode" placeholder="Enter product HSN Code" className="add-product-popup-form-input" onChange={(e) => {
                                        setProductForm(prev => ({
                                            ...prev,
                                            hsnCode: e.target.value
                                        }));
                                    }} />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="purchasePrice" className="add-product-popup-form-label">Purchase Price <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input type="number" id="purchasePrice" name="purchasePrice" placeholder="Enter product purchase price" className="add-product-popup-form-input" onChange={(e) => {
                                        setProductForm(prev => ({
                                            ...prev,
                                            purchasePrice: e.target.value
                                        }));
                                    }} />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="sellingPrice" className="add-product-popup-form-label">Selling Price <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input
                                        type="number"
                                        id="sellingPrice"
                                        name="sellingPrice"
                                        placeholder="Enter product selling price"
                                        className="add-product-popup-form-input"
                                        value={productForm.sellingPrice}
                                        onChange={onDecideFinalPrice}
                                    />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="sellingPrice" className="add-product-popup-form-label">Quantity <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        placeholder="Enter product quantity"
                                        className="add-product-popup-form-input"
                                        value={productForm.quantity}
                                        onChange={(e) => {
                                            setProductForm(prev => ({
                                                ...prev,
                                                quantity: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="sellingPrice" className="add-product-popup-form-label">Unit <span className="required">*</span></label>
                                <select className="add-product-popup-form-input" onChange={(e) => {
                                        setProductForm(prev => ({
                                                    ...prev,
                                                    unit: e.target.value
                                                }));
                                            }}>
                                    <option value="">Select Unit</option>
                                    <option value="bag">Bag</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="g">Gram (g)</option>
                                    <option value="l">Liter (l)</option>
                                    <option value="ml">Milliliter (ml)</option>
                                    <option value="pcs">Pieces (pcs)</option>
                                </select>
                            </div>
                            <div className="add-product-image-upload-container-in-popup">
                                <p className="add-product-popup-product-image-text">Product Image (Optional)</p>
                                <div className="add-product-popup-form-group-image-upload-container">
                                    <IoCloudUpload color="#000" size="36px" className="add-product-popup-form-icon-image-upload" />
                                    <div className="add-product-popup-form-input-container-image-upload">
                                    <input type="file" id="productImage" name="productImage" className="add-product-popup-form-input-image-upload" onChange={handleImageUpload} />
                                    </div>
                                    <div>
                                        <p className="add-product-popup-uploaded-product-image-file small">{productImage ? productImage.name : "No file chosen"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="gstRate" className="add-product-popup-form-label">GST Rate(%) <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container">
                                    <RiBox1Line color="#000" size="20px" className="add-product-popup-form-icon" />
                                    <input type="number" id="gstRate" name="gstRate" placeholder="Enter GST rate"  className="add-product-popup-form-input" value={productForm.gstRate} onChange={(e) => {
                                        setProductForm(prev => ({
                                                    ...prev,
                                                    gstRate: e.target.value
                                                }));
                                            }}
                                        />
                                </div>
                            </div>
                            <div className="add-product-popup-form-group-radio">
                                <label htmlFor="isSellingPriceGSTIncluded" className="add-product-popup-form-label">Is Sellig Price GST Included? <span className="required">*</span></label>
                                <div className="add-product-popup-form-input-container-radio">
                                    <input type="radio" id="isSellingPriceGSTIncludedYes" name="isSellingPriceGSTIncluded" value="yes" className="add-product-popup-form-radio-input" 
                                        checked={isGstIncluded === true} onChange={() => {setIsGstIncluded(true); setProductForm(prev => ({...prev, taxInclusive: true }))}} />
                                    <label htmlFor="isSellingPriceGSTIncludedYes" className="add-product-popup-form-radio-label">Yes</label>
                                    <input type="radio" id="isSellingPriceGSTIncludedNo" name="isSellingPriceGSTIncluded" value="no" className="add-product-popup-form-radio-input" checked={isGstIncluded === false} onChange={() => {setIsGstIncluded(false); setProductForm(prev => ({...prev, taxInclusive: false }))}} />
                                    <label htmlFor="isSellingPriceGSTIncludedNo" className="add-product-popup-form-radio-label">No</label>
                                </div>
                            </div>
                            <div className="add-product-popup-form-group-preview">
                                <label className="add-product-popup-form-label">Price Preview</label>
                                <div className="add-product-popup-form-preview-yes-no-container">
                                    <div>
                                        <p className="gst-preview-text green">If Yes (GST Inclusive) (Final Price)</p>
                                        <p className="gst-final-price included-price">₹ {inclusivePrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="gst-preview-text blue">If No (GST Exclusive)</p>
                                        <p className="gst-final-price exclusive-price">₹ {exclusivePrice.toFixed(2)}</p>
                                    </div>    
                                </div>
                            </div>
                            <div className="add-product-popup-form-group">
                                <label htmlFor="productDescription" className="add-product-popup-form-label description">Product Description (Optional)</label>
                                <textarea id="productDescription" name="productDescription" placeholder="Enter product description" className="add-product-popup-form-input-textarea" value={productForm.productDescription} onChange={(e) => {
                                        setProductForm(prev => ({
                                                    ...prev,
                                                    productDescription: e.target.value
                                                }));
                                            }}></textarea>
                            </div>
                            <div className="add-product-submit-container">
                                <button type="submit" >Add Product</button>
                            </div>
                        </div>
                    </form>  
                    </Popup>
                )
            }
        <div className="inventory-container">
            <div className="inventory-header">
                <div>
                    <h1 className="inventory-title">Inventory <span className="inventory-subtitle">Management</span></h1>
                    <p className="inventory-description">Manage your products and stock</p>
                </div>
                <button className="inventory-add-btn" onClick={() => setShowAddProductPopup(true)}>
                    <IoIosAdd color="#ffffff" size="20px" />
                    <span>Add Product</span>
                </button>
            </div>
            {
            error?erroView():
            <>
            <div className="inventory-status-constainer">
                <div className="inventory-status-card d-none-small-devices">
                    <div className="inventory-status-icon-container">
                        <RiBox2Line color="#d17001" size="36px" className="inventory-status-icon-large-devices" />
                        <RiBox2Line color="#d17001" size="16px"  className="inventory-status-icon-small-devices" />
                    </div>
                    <div className="inventory-status-info">
                        <p className="inventory-status-text">Total Products</p>
                        <p className="inventory-products-detail">{totalProducts}</p>
                    </div>
                </div>
                <div className="inventory-status-card">
                    <div className="inventory-status-icon-container color-green">
                        <BsBoxSeamFill color="#008d21" size="36px" className="inventory-status-icon-large-devices" />
                        <BsBoxSeamFill color="#008d21" size="18px"  className="inventory-status-icon-small-devices" />  
                    </div>
                    <div className="inventory-status-info">
                        <p className="inventory-status-text">In Stock Products</p>
                        <p className="inventory-products-detail">{inStockProducts}</p>
                    </div>
                </div>
                <div className="inventory-status-card">
                    <div className="inventory-status-icon-container warning-color">
                        <IoIosWarning color="#d10101" size="36px" className="inventory-status-icon-large-devices" />
                        <IoIosWarning color="#d10101" size="18px" className="inventory-status-icon-small-devices" />
                    </div>
                    <div className="inventory-status-info">
                        <p className="inventory-status-text">Low Stock Products</p>
                        <p className="inventory-products-detail">{lowStockProducts}</p>
                    </div>
                </div>
            </div>    
            <div className="search-container">
                <IoSearch color="#000" size="20px" className="search-icon" />
                <input type="text" placeholder="Search products..." className="search-input" />
            </div>
            {loading? renderLoadingSpinner() : renderProductsTable()}
            </>
            }
        </div>
        </>
    )
}

export default Inventory;         