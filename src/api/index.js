import axios from 'axios';

const API_URL = "https://blomengdalis-tester.com/backend";

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/get-products.php`);
    return response.data;
}

export const createProduct = async (product) => {
    const response = await axios.post(`${API_URL}/create-product.php`, product);
    return response.data;
}