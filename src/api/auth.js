import axios from 'axios';

const API_URL = "https://blomengdalis-tester.com/backend";

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login.php`, credentials);
    return response.data;
}

export const register = async (user) => {
    const response = await axios.post(`${API_URL}/register.php`, user);
    return response.data;
}
