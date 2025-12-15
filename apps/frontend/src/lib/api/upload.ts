import { apiClient } from './client';

export const uploadApi = {
  /**
   * Upload a single image
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.instance.post('/api/v1/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  },

  /**
   * Upload multiple images (max 8)
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.instance.post('/api/v1/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.urls;
  },
};





