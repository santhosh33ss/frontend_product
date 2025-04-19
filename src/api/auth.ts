import axios from 'axios';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';

const API_URL = 'http://localhost:5000/api/users'; // adjust if needed

export const registerUser = async (data: RegisterDTO) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data: LoginDTO) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};
