import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Shadcn Dialog
import { Fragment, useEffect, useState } from "react";
import ProductImageUpload from "./image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, fetchAllProduct, editProduct, deleteProduct } from "@/store/admin/product-slice";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin-view/product-tile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"; // Shadcn Alert Dialog
import { Badge } from "@/components/ui/badge";
import { addProductFormElements } from "@/config"; // Ensure this path is correct


const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProduct() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // For detailed view
  const [activityLogs, setActivityLogs] = useState([]); // For activity logs
  const [isAlertOpen, setIsAlertOpen] = useState(false); // For delete confirmation
  const [productToDelete, setProductToDelete] = useState(null); // Product for deletion

  const { productList, isLoading } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);

  const logActivity = (action) => {
    setActivityLogs((prev) => [...prev, action]);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
        await dispatch(deleteProduct(productToDelete._id)).unwrap();
        toast({
            title: "Product Deleted",
            description: `${productToDelete.title} has been deleted successfully.`,
            variant: "success",
        });
        logActivity(`Deleted product: ${productToDelete.title}`);
        setIsAlertOpen(false);
        setProductToDelete(null);
        dispatch(fetchAllProduct()); // Refresh product list
    } catch (error) {
        toast({
            title: "Error",
            description: error || "Failed to delete the product.",
            variant: "destructive",
        });
    }
};

  const filteredProducts = productList.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "stock") return b.totalStock - a.totalStock;
    return 0;
  });

  const validateForm = () => {
    if (!uploadedImageUrl && !currentEditedId) {
      toast({
        title: "Image Required",
        description: "Please upload an image for the product.",
        variant: "destructive",
      });
      return false;
    }

    const requiredFields = ["title", "category", "brand", "price", "totalStock"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: `${field.charAt(0).toUpperCase() + field.slice(1)} Required`,
          description: `Please provide a valid ${field}.`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const action = currentEditedId
        ? editProduct({ id: currentEditedId, formData: { ...formData, image: uploadedImageUrl } })
        : addNewProduct({ ...formData, image: uploadedImageUrl });

      const response = await dispatch(action).unwrap();

      if (response.success) {
        dispatch(fetchAllProduct());
        setFormData(initialFormData);
        setImageFile(null);
        setUploadedImageUrl("");
        toast({
          title: currentEditedId ? "Product Updated Successfully" : "Product Added Successfully",
          description: `Your product has been ${currentEditedId ? "updated" : "added"} successfully.`,
        });
        logActivity(
          `${currentEditedId ? "Updated" : "Added"} product: ${formData.title} at ${new Date().toLocaleTimeString()}`
        );
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
      } else {
        throw new Error(response.message || "Operation failed.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      {/* Search and Sorting */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md p-2 w-1/3"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="title">Title</option>
          <option value="stock">Stock</option>
        </select>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <p>Loading products...</p>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((productItem) => (
            <AdminProductTile
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              key={productItem._id}
              product={productItem}
              onClick={() => setSelectedProduct(productItem)} // For detailed view
              onDelete={() => {
                setProductToDelete(productItem);
                setIsAlertOpen(true);
              }} // For delete confirmation
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Alert Dialog for Deletion */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            </AlertDialogHeader>
            <p>{productToDelete?.title}</p>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogContent>
    </AlertDialog>


      {/* Detailed Product View with Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title}</DialogTitle>
          </DialogHeader>
          <div>
            <p>{selectedProduct?.description}</p>
            <p>Category: {selectedProduct?.category}</p>
            <p>Brand: {selectedProduct?.brand}</p>
            <p>Price: ${selectedProduct?.price}</p>
            <p>Stock: {selectedProduct?.totalStock}</p>
            <Badge variant="secondary">{selectedProduct?.category}</Badge>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFormData(initialFormData);
            setUploadedImageUrl("");
            setCurrentEditedId(null);
          }
          setOpenCreateProductsDialog(isOpen);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                isSubmitting
                  ? currentEditedId
                    ? "Updating..."
                    : "Adding..."
                  : currentEditedId
                  ? "Update"
                  : "Add"
              }
              formControls={addProductFormElements}
              disabled={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Activity Logs */}
      <div className="mt-6 bg-gray-100 p-4 rounded-md shadow">
        <h3 className="text-lg font-bold">Activity Logs</h3>
        <ul>
          {activityLogs.map((log, index) => (
            <li key={index} className="text-sm text-gray-700">
              {log}
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
}

export default AdminProduct;
