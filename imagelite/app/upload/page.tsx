'use client';

import Link from 'next/link';
import ImagePreview from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button, Input, Template } from '@/components';
import { useImageService } from '@/resource/service';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

export default function UploadPage() {
  const imageService = useImageService();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(file: File | null) {
    setFile(file);
    setPreviewUrl(
      file && ACCEPTED_IMAGE_TYPES.includes(file.type)
        ? URL.createObjectURL(file)
        : null,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess(false);

    const imageName = name.trim();
    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!imageName) {
      setError('Informe o nome da imagem.');
      return;
    }

    if (!file) {
      setError('Selecione um arquivo de imagem.');
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('O arquivo deve estar no formato PNG, JPG, JPEG ou GIF.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('O arquivo deve ter no máximo 20 MB.');
      return;
    }

    if (tags.length === 0) {
      setError('Informe pelo menos uma tag.');
      return;
    }

    setIsLoading(true);
    try {
      await imageService.enviar(file, imageName, tags);
      setSuccess(true);
      setName('');
      setFile(null);
      setPreviewUrl(null);
      setTagsText('');
      formRef.current?.reset();
    } catch (cause) {
      console.error('Erro ao enviar imagem:', cause);
      setError(
        cause instanceof TypeError
          ? 'Não foi possível conectar à API. Verifique se o backend está em execução.'
          : cause instanceof Error
            ? cause.message
            : 'Não foi possível enviar a imagem.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Template>
      <main className="mx-auto max-w-xl p-4">
        <h1 className="mb-4 text-2xl font-bold">Enviar imagem</h1>

        <form
          ref={formRef}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="Nome da imagem"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <div className="flex flex-col gap-3">
            <p>
              Arquivo da imagem (PNG, JPG, JPEG ou GIF; máximo de 20 MB)
            </p>
            <input
              ref={fileInputRef}
              className="hidden"
              id="image-file"
              type="file"
              accept=".png,.jpg,.jpeg,.gif"
              onChange={(event) =>
                handleFileChange(event.currentTarget.files?.[0] ?? null)
              }
            />
            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                aria-label="Selecionar arquivo de imagem"
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar arquivo
              </Button>
              <p
                className="break-all text-sm text-gray-600"
                id="image-file-status"
                aria-live="polite"
              >
                {file?.name ?? 'Nenhum arquivo selecionado'}
              </p>
            </div>
            {previewUrl && file && (
              <div className="flex flex-col gap-2">
                <p className="font-medium">Pré-visualização</p>
                <ImagePreview
                  src={previewUrl}
                  alt={`Pré-visualização de ${file.name}`}
                  width={640}
                  height={360}
                  unoptimized
                  className="max-h-72 w-full rounded border border-gray-300 object-contain"
                />
              </div>
            )}
          </div>

          <Input
            label="Tags separadas por vírgula"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="natureza, viagem"
            required
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar imagem'}
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-red-600" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 text-green-700" role="status">
            Imagem enviada com sucesso!
          </p>
        )}

        <Link className="mt-4 inline-block underline" href="/galeria">
          Voltar para a galeria
        </Link>
      </main>
    </Template>
  );
}