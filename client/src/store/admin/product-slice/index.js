import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    productList: [],
    error: null, // Error state for better handling
};

// Thunk to add a new product
export const addNewProduct = createAsyncThunk(
    '/product/addnewproduct',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/admin/product/add',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data; // Ensure backend sends correct response structure
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error adding new product");
        }
    }
);

// Thunk to fetch all products
export const fetchAllProduct = createAsyncThunk(
    '/product/fetchallproduct',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/product/get');
            return response.data; // Adjust based on backend response
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching products");
        }
    }
);

// Thunk to edit a product
export const editProduct = createAsyncThunk(
    '/product/editproduct',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/admin/product/edit/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data; // Return the necessary data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error editing product");
        }
    }
);

// Thunk to delete a product
export const deleteProduct = createAsyncThunk(
    '/product/deleteproduct',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/product/delete/${id}`);
            return { _id: id }; // Return the deleted product ID
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting product");
        }
    }
);

// Admin Product Slice
const adminProductSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add New Product
            .addCase(addNewProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addNewProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList.push(action.payload); // Add the new product
            })
            .addCase(addNewProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch All Products
            .addCase(fetchAllProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload?.data || []; // Use correct response structure
            })
            .addCase(fetchAllProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Edit Product
            .addCase(editProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.productList.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.productList[index] = action.payload;
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = state.productList.filter(
                    (product) => product._id !== action.payload._id
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default adminProductSlice.reducer;
