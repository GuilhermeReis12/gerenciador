import { get } from 'lodash';
import { toast } from 'react-toastify';
import { api } from '../utils/axios';

export const handleUpload = async (
  file: any,
  selectedType: string,
  selectedCategory: string
) => {
  const data = new FormData();
  data.append('file', file);
  data.append('selected_type', selectedType);
  data.append('selected_category', selectedCategory);
  try {
    const response = await api.post(`//`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (e) {
    toast.error(
      get(e, 'response.data.file[0]', 'Imagem enviada é inválida'),
      {}
    );
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    });
    return Promise.reject(e);
  }
};
