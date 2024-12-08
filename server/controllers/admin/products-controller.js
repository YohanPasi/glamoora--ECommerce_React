const { imageUploadUtil } = require("../../helpers/cloudianary");
const Product = require('../../models/productModel')

const handleImageUpload = async (req, res) => {
    try {
        if (!req.file) {
            console.error("No file received");
            return res.status(400).json({ success: false, message: "No file received" });
        }

        console.log("File received:", req.file);

        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        const result = await imageUploadUtil(base64Image);
        
        console.log("Image uploaded successfully:", result);

        res.status(200).json({
            success: true,
            url: result.secure_url,
        });
    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({
            success: false,
            message: "Error occurred during image upload",
        });
    }
};

// Add Product
const addProduct = async (req, res) => {
    try {
      const {
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
      } = req.body;
  
      const product = new Product({
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
      });
  
      await product.save();
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({
        success: false,
        message: "Error occurred during product addition",
      });
    }
  };
  

// Fetch All Products
const fetchAllProduct = async (req, res) => {
    try {
      // Correctly fetch all products
      const listOfProducts = await Product.find({}); // `Product` must be a valid Mongoose model
      res.status(200).json({
        success: true,
        data: listOfProducts,
      });
    } catch (error) {
      console.error("Product fetching error:", error);
      res.status(500).json({
        success: false,
        message: "Error occurred during product fetching",
      });
    }
  };
  

// Edit Product
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;

        const findProduct = await Product.findById(id);
        if (!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price || findProduct.price;
        findProduct.salePrice = salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;

        await findProduct.save();
        res.status(200).json({
            success: true,
            data: findProduct,
        });
    } catch (error) {
        console.error("Product updating error:", error);
        res.status(500).json({
            success: false,
            message: "Error occurred during product updating",
        });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Product deleting error:", error);
        res.status(500).json({
            success: false,
            message: "Error occurred during product deleting",
        });
    }
};

module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProduct,
    editProduct,
    deleteProduct,
};
