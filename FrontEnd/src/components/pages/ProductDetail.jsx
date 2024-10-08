import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../constants/Axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../sharepages/Loading";

const ProductDetail = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await Axios.get(`/products/${id}/variants`);
        const product = response.data;
        setProductData(product);

        if (product.variants.length > 0) {
          setSelectedVariant(product.variants[0]);
          if (product.variants[0].sizes.length > 0) {
            setSelectedSize(product.variants[0].sizes[0]);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!productData) {
    return <div>Product not found</div>;
  }

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const addToCart = async () => {
    if (!selectedVariant || !selectedSize) {
      toast.error("Please select a size and color");
      return;
    }

    try {
      const response = await Axios.post("/add-to-cart", {
        product_variant_id: selectedVariant.id,
        size_id: selectedSize.id,
        quantity: 1,
      });
      if (response.status === 201 || response.status === 202) {
        toast.success("Added to cart");
      }
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  return (
    <div className="product-detail p-4 mx-auto max-w-screen-lg flex">
      {/* Left Side: Image and Toast */}
      <div className="w-2/3 pr-4">
        <div className="mb-4">
          {selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 ? (
            <img
              src={selectedVariant.images[0].url}
              alt={productData.name}
              className="w-full"
            />
          ) : (
            <div>No image available</div>
          )}
        </div>
        <ToastContainer />
      </div>

      {/* Right Side: Product Details and Add to Cart */}
      <div className="w-1/3">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">{productData.name}</h1>
          <div className="text-2xl font-bold text-red-600">
            ${productData.price.toFixed(2)}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">COLOR</h3>
          <div className="flex flex-wrap">
            {productData.variants.map((variant, index) => (
              <button
                key={index}
                className={`border-2 p-2 m-1 ${selectedVariant === variant ? "border-black" : "border-gray-300"}`}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">SELECT A SIZE</h3>
          <div className="flex flex-wrap">
            {selectedVariant && selectedVariant.sizes.map((size, index) => (
              <button
                key={index}
                className={`border p-2 m-1 ${selectedSize === size ? "bg-black text-white" : "bg-white"}`}
                onClick={() => handleSizeClick(size)}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            className="bg-black text-white py-2 px-4 font-bold"
            onClick={addToCart}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
