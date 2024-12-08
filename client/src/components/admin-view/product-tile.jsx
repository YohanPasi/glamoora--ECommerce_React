import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({ 
  product, 
  setFormData, 
  setOpenCreateProductsDialog, 
  setCurrentEditedId, 
  onDelete 
}) {
  return (
    <Card className="w-full max-w-sm mx-auto transform transition duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden">
      <div>
        <div className="relative group">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg group-hover:opacity-80 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-end p-4">
            <h2 className="text-white text-lg font-bold">{product?.title || "Product Title"}</h2>
          </div>
        </div>
      </div>
      <CardContent className="bg-white p-4 rounded-b-lg">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{product?.title || "Product Title"}</h2>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through text-gray-500" : "text-primary"
            } text-lg font-semibold`}
          >
            ${product?.price || "0.00"}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-lg font-bold text-red-500">${product?.salePrice}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 p-4 rounded-b-lg">
        <Button
          className="transition-transform duration-300 hover:scale-110 hover:bg-primary-light"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button 
          className="transition-transform duration-300 hover:scale-110 hover:bg-red-500 hover:text-white"
          onClick={() => onDelete(product)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

AdminProductTile.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    salePrice: PropTypes.number,
    price: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  setOpenCreateProductsDialog: PropTypes.func.isRequired,
  setCurrentEditedId: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired, // Added PropType for onDelete
};

export default AdminProductTile;
