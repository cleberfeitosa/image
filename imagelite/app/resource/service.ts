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

  async enviar(file: File, name: string, tags: string[]): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  tags.forEach((tag) => formData.append('tags', tag));

  const response = await fetch(this.baseURL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao enviar imagem: ${response.status} ${response.statusText}`,
    );
  }
}

}
// React Hook
export const useImageService = () => new ImageService();
 
