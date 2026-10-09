import { Image } from "./image";  

class ImageService {
  private readonly baseURL =
    process.env.NEXT_PUBLIC_IMAGE_API_URL ?? 'http://localhost:8080/images';

  async buscar(query: string = '', extension: string = ''): Promise<Image[]> {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('query', query.trim());
    }
    if (extension) {
      params.set('extension', extension);
    }

    const url = params.size > 0 ? `${this.baseURL}?${params.toString()}` : this.baseURL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Falha ao buscar imagens: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
// React Hook
export const useImageService = () => new ImageService();
 
