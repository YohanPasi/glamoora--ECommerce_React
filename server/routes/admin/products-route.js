const express = require('express');
const { 
        handleImageUpload,
        addProduct,
        fetchAllProduct,
        editProduct,
        deleteProduct,} = require('../../controllers/admin/products-controller');

const { upload } = require('../../helpers/cloudianary');

const router = express.Router();


// Image Upload Route
router.post('/upload-image', upload.single('my_file'), async (req, res, next) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Proceed to the controller
    await handleImageUpload(req, res);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

router.post('/add', addProduct);
router.put('/edit/:id', editProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/get', fetchAllProduct);


module.exports = router;
