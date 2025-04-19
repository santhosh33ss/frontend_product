export interface ProductDTO {
    _id?: string;
    name: string;
    price: number;
    stock: number;
    description?: string;
    images?: string[]; // base64 or file paths
    createdAt?: string;
  }
  