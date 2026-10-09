'use client'

//import { Template } from '../components/Template';
//import { ImageCard } from '../components/Image';
import { Image } from '@/resource/image';
import { Template, ImageCard  } from '@/components';
import {  useImageService } from '@/resource/service';
import { useState } from 'react';


export default function Galeria() {
  
  const useService = useImageService();
  const [images, setImages] = useState<Image[]>([]);
  const [query, setQuery] = useState('');
  const [extension, setExtension] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  async function searchImages(searchQuery = query, searchExtension = extension) {
    setIsLoading(true);
    setError('');

    try {
      const result = await useService.buscar(searchQuery, searchExtension);
      setImages(result);
      setHasSearched(true);
    } catch (cause) {
      console.error('Erro ao buscar imagens:', cause);
      setError(
        cause instanceof TypeError
          ? 'Não foi possível conectar à API. Verifique se o backend está em execução.'
          : cause instanceof Error
            ? cause.message
            : 'Ocorreu um erro inesperado ao buscar imagens.',
      );
    } finally {
      setIsLoading(false);
    }

  }

  /*renderizando a imagem na tela*/
  function renderImageCard(image: Image, index: number) {
    return (
      <ImageCard
        key={image.url ?? image.name ?? index}
        imageName={image.name}
        imageUrl={image.url}
        extension={image.extension}
        imageSize={image.size != null ? `${image.size} bytes` : ''}
        uploadDate={image.uploadDate}
      />
    );
  }

  function renderImageCards() {
    return images.map(renderImageCard);
  }

  return (
    <Template>
      <form
        className="flex flex-wrap items-end gap-4 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void searchImages();
        }}
      >
        <div className="flex flex-col gap-1">
          
          <input
            id="image-query"
            className="h-10 rounded border border-gray-400 px-3 py-2"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
           placeholder="Buscar por nome ou tag"
           />
        </div>
        <div className="flex flex-col gap-1">
          
          <select
            id="image-extension"
            className="h-10 rounded border border-gray-400 px-3 py-2"
            value={extension}
            onChange={(event) => setExtension(event.target.value)}
          >
            <option value="">Todas</option>
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="JPEG">JPEG</option>
            <option value="GIF">GIF</option>
          </select>
        </div>
        <button
          className="h-10 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
        <button
          className="h-10 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 disabled:opacity-50"
          type="button"
          disabled={isLoading}
          onClick={() => {
            setQuery('');
            setExtension('');
            void searchImages('', '');
          }}
        >
          Limpar filtros
        </button>
      </form>

      <section className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full text-center" role="status">
            Carregando imagens...
          </p>
        ) : error ? (
          <p className="col-span-full text-center text-red-600" role="alert">
            {error}
          </p>
        ) : images.length > 0 ? (
          renderImageCards()
        ) : hasSearched ? (
          <p className="col-span-full text-center">
            Nenhuma imagem encontrada.
          </p>
        ) : null}
      </section>
    </Template>
  );
}