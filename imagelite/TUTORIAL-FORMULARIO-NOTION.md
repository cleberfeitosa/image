# ImageLite — formulário de imagens com componentes reutilizáveis

## Objetivo da aula

Vamos criar uma página para enviar imagens à API. Para praticar componentização,
os campos e botões serão componentes separados e reutilizáveis. No fim, o botão
**Add New** da galeria abrirá o formulário, e um link permitirá voltar à galeria.

O fluxo será:

1. Abrir `/galeria`.
2. Clicar em **Add New** para navegar até `/upload`.
3. Preencher e enviar o formulário.
4. Voltar para `/galeria` e pesquisar a imagem enviada.

> Este arquivo é um tutorial. Os passos abaixo não foram aplicados
> automaticamente ao código do projeto.

## Antes de começar

A API Spring já possui o endpoint `POST /images`, que recebe os campos abaixo
em uma requisição `multipart/form-data`:

| Campo | Conteúdo |
| --- | --- |
| `file` | Arquivo da imagem |
| `name` | Nome que aparecerá na galeria |
| `tags` | Uma ou mais tags |

A API aceita PNG, JPG, JPEG e GIF, com até 20 MB por arquivo. Para testar, o
banco de dados, a API e a interface precisam estar em execução.

## Passo 1 — entender a estrutura do projeto

O projeto usa o App Router do Next.js. As pastas dentro de `app` formam os
endereços das páginas:

```text
imagelite/
└── app/
    ├── components/
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── index.tsx
    ├── galeria/
    │   └── page.tsx
    ├── resource/
    │   └── service.ts
    └── upload/
        └── page.tsx
```

- `app/galeria/page.tsx` é a página `/galeria`.
- `app/upload/page.tsx` será a página `/upload`.
- `app/components` guarda componentes que podem ser usados em várias páginas.
- `app/resource/service.ts` contém a comunicação com a API.
- `app/components/index.tsx` reúne as exportações para facilitar os imports.

O nome `page.tsx` é uma convenção do Next.js: uma pasta com esse arquivo
representa uma rota acessível pelo navegador.

## Passo 2 — criar um componente reutilizável para campos

No VS Code, crie `imagelite/app/components/Input.tsx` e coloque este código:

```tsx
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1">
      <span>{label}</span>
      <input
        className={`h-10 rounded border border-gray-400 px-3 py-2 ${className ?? ''}`}
        {...props}
      />
    </label>
  );
}
```

### O que esse componente faz?

- `import type` importa apenas um tipo do React. Ele ajuda o TypeScript a
  verificar as propriedades do campo e não precisa ser incluído no JavaScript
  final da aplicação.
- `InputHTMLAttributes<HTMLInputElement>` representa as propriedades normais de
  um `<input>` HTML, como `type`, `value`, `onChange`, `required` e `accept`.
- `interface InputProps extends ...` cria o tipo das propriedades do nosso
  componente. `extends` reaproveita as propriedades nativas e adiciona `label`.
- `label: string` significa que todo `<Input>` precisa receber um texto para
  identificar o campo.
- `export function Input(...)` declara e exporta o componente. `export` permite
  que outros arquivos o importem.
- `{ label, className, ...props }` separa propriedades especiais:
  - `label` é o texto exibido acima do campo;
  - `className` permite acrescentar classes de estilo;
  - `...props` reúne todas as outras propriedades do input.
- `<label>` associa o texto ao campo e organiza texto e input em coluna.
- `className={`... ${className ?? ''}`}` aplica estilos padrão e, se houver,
  acrescenta estilos recebidos por propriedade. `?? ''` usa texto vazio quando
  nenhuma classe adicional foi enviada.
- `{...props}` repassa as propriedades restantes ao `<input>` HTML. Assim o
  componente pode servir para texto, arquivo ou outros tipos de input.

### Exemplo de uso

```tsx
<Input
  label="Nome da imagem"
  value={name}
  onChange={(event) => setName(event.target.value)}
  required
/>
```

O componente recebe `label`, `value`, `onChange` e `required`. Como encaminha
as propriedades com `{...props}`, o navegador ainda executa o comportamento
normal do input.

## Passo 3 — criar um componente reutilizável para botões

Crie `imagelite/app/components/Button.tsx`:

```tsx
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-800',
  secondary: 'bg-gray-500 text-white hover:bg-gray-700',
  danger: 'bg-red-500 text-white hover:bg-red-700',
};

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`h-10 rounded px-4 py-2 font-bold disabled:opacity-50 ${variantClasses[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### O que esse componente faz?

- `ButtonHTMLAttributes<HTMLButtonElement>` reaproveita as propriedades normais
  de um botão HTML, incluindo `type`, `onClick` e `disabled`.
- `type ButtonVariant = ...` define os únicos estilos permitidos: primário,
  secundário ou perigo. O TypeScript avisa se usarmos outro nome por engano.
- `variant?` é opcional por causa do `?`. Se não for informado, será usado
  `'primary'`.
- `Record<ButtonVariant, string>` descreve um objeto que precisa ter uma classe
  CSS para cada variante possível.
- `children` é o conteúdo entre `<Button>` e `</Button>`, por exemplo o texto
  “Enviar imagem”.
- `variantClasses[variant]` escolhe as classes da variante recebida.
- `{...props}` repassa propriedades como `type`, `onClick` e `disabled` para o
  botão HTML verdadeiro.

### Exemplos de uso

```tsx
<Button type="submit">Enviar imagem</Button>

<Button type="button" variant="secondary">
  Cancelar
</Button>
```

O primeiro botão usa o estilo padrão `primary`. O segundo passa
`variant="secondary"` para mudar sua aparência.

## Passo 4 — exportar os novos componentes

Abra `imagelite/app/components/index.tsx`. Esse arquivo já exporta `Template`
e `ImageCard`. Acrescente as duas linhas:

```tsx
export * from './Button';
export * from './Input';
```

O arquivo deve ficar assim:

```tsx
export * from './Template';
export * from './ImageCard';
export * from './Button';
export * from './Input';
```

`export * from './Button'` torna disponíveis as exportações de `Button.tsx`.
Fazemos o mesmo para `Input.tsx`. Depois disso, a página pode importar ambos
usando `@/components`, em vez de escrever o caminho de cada arquivo.

## Passo 5 — adicionar o envio ao serviço da API

Abra `imagelite/app/resource/service.ts`. Dentro da classe `ImageService`,
depois de `buscar`, adicione:

```ts
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
```

### Entendendo o envio

- `async` marca a função como assíncrona; `await` poderá esperar a resposta da
  rede sem bloquear a página inteira.
- `File` é o tipo do arquivo escolhido no navegador. `string[]` é uma lista de
  textos. `Promise<void>` indica que a função é assíncrona e não retorna um
  objeto quando termina.
- `new FormData()` cria os dados de um formulário que pode conter arquivos.
- `append('file', file)` adiciona o arquivo. As chaves `'file'`, `'name'` e
  `'tags'` devem corresponder aos parâmetros do endpoint Spring.
- `tags.forEach(...)` percorre a lista e adiciona cada tag com o mesmo nome de
  campo, para o backend receber várias tags.
- `fetch(this.baseURL, ...)` chama a mesma URL base usada pela busca. O método
  `'POST'` envia dados; `body` contém o formulário.
- Não configure `Content-Type` manualmente. O navegador cria esse cabeçalho
  junto com o separador necessário para os arquivos em `FormData`.
- `response.ok` é verdadeiro quando o servidor respondeu com sucesso. Se não
  for, `throw new Error(...)` sinaliza a falha à página que chamou o método.

## Passo 6 — criar a página de formulário usando os componentes

Crie `imagelite/app/upload/page.tsx` e coloque o código:

```tsx
'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { Button, Input, Template } from '@/components';
import { useImageService } from '@/resource/service';

export default function UploadPage() {
  const imageService = useImageService();
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (file.size > 20 * 1024 * 1024) {
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
      setTagsText('');
      formRef.current?.reset();
    } catch (cause) {
      console.error('Erro ao enviar imagem:', cause);
      setError(
        cause instanceof Error
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

          <Input
            label="Arquivo (PNG, JPG, JPEG ou GIF; máximo de 20 MB)"
            type="file"
            accept=".png,.jpg,.jpeg,.gif"
            onChange={(event) =>
              setFile(event.currentTarget.files?.[0] ?? null)
            }
            required
          />

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

        {error && <p className="mt-4 text-red-600" role="alert">{error}</p>}
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
```

### Entendendo a página

- `'use client';` precisa estar no começo porque a página usa estado e eventos
  do navegador. No Next.js, páginas são componentes de servidor por padrão;
  essa diretiva marca esta página como componente de cliente.
- `useState` guarda valores que mudam: nome, arquivo, tags, erro, sucesso e
  carregamento. Cada `set...` atualiza o estado correspondente.
- `useRef<HTMLFormElement>(null)` guarda uma referência ao formulário para
  limpá-lo após o envio.
- `useImageService()` fornece o método `enviar` criado no passo anterior.
- `handleSubmit` é chamado ao enviar o formulário. `preventDefault()` impede o
  navegador de recarregar a página.
- `trim()` remove espaços extras do nome e de cada tag. `split(',')` divide
  tags digitadas por vírgulas. `map(...)` transforma cada item; `filter(Boolean)`
  remove tags vazias.
- Os comandos `if` validam os dados antes do envio. `return` encerra a função
  quando falta um dado ou o arquivo ultrapassa o limite.
- `20 * 1024 * 1024` converte 20 megabytes para bytes: 1024 bytes formam um
  kilobyte e 1024 kilobytes formam um megabyte.
- `try` contém a operação que pode ter sucesso. `await` espera o envio terminar.
  `catch` captura erros de rede ou respostas HTTP de falha. `finally` roda nos
  dois casos e reativa o botão.
- `formRef.current?.reset()` limpa os elementos do formulário. `?.` significa
  “execute apenas se a referência existir”.
- Cada `<Input>` é uma instância do componente que criamos. `label` altera o
  texto do campo; `value`, `onChange`, `type`, `accept`, `required` e
  `placeholder` são propriedades HTML repassadas pelo componente ao `<input>`.
- No input de arquivo, `files?.[0]` pega o primeiro arquivo escolhido. Se não
  houver arquivo, `?? null` guarda `null` no estado.
- `<Button>` é o componente reutilizável do passo 3. `type="submit"` faz com
  que ele envie o formulário, e `disabled={isLoading}` impede cliques repetidos
  enquanto o upload está em andamento.
- `{isLoading ? ... : ...}` escolhe o texto do botão de acordo com o estado.
- `{error && ...}` exibe o erro apenas quando existe uma mensagem.
  `role="alert"` e `role="status"` ajudam leitores de tela a anunciar erro e
  sucesso.
- `<Link href="/galeria">` cria uma navegação para a galeria sem escrever
  diretamente o endereço no navegador.

## Passo 7 — navegar da galeria pelo botão “Add New”

Abra `imagelite/app/galeria/page.tsx`. Essa página já começa com
`'use client'`, então podemos usar o roteador do Next.js e o componente
`Button`.

### 7.1 Importar os recursos

Adicione estes imports junto aos demais:

```tsx
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
```

- `useRouter` é o hook de navegação do App Router.
- `Button` é o componente reutilizável criado no passo 3.
- `@/components` resolve para a pasta `app/components`, usando as exportações
  adicionadas no passo 4.

### 7.2 Criar o roteador

Dentro da função `Galeria`, antes dos outros hooks, adicione:

```tsx
const router = useRouter();
```

`useRouter()` fornece métodos de navegação. Guardamos o objeto em `router` para
usar o método `push` no botão.

### 7.3 Substituir o botão “Add New”

Encontre o botão **Add New** existente. Substitua o `<button>` por:

```tsx
<Button
  type="button"
  variant="danger"
  onClick={() => router.push('/upload')}
>
  Add New
</Button>
```

- `type="button"` evita que o botão tente enviar o formulário de busca que o
  contém.
- `variant="danger"` escolhe o estilo vermelho definido no componente Button.
- `onClick` registra uma ação para o clique.
- `() => ...` cria a função que será executada quando o botão for clicado.
- `router.push('/upload')` manda o Next.js navegar para a página do formulário.

O botão de enviar no formulário e o botão **Add New** usam o mesmo componente,
mas com propriedades diferentes. Isso é componentização: o estilo e a estrutura
ficam definidos em um lugar, enquanto cada uso fornece seu comportamento.

## Passo 8 — executar e testar

Abra três terminais PowerShell na pasta raiz do repositório.

### Terminal 1: banco de dados

```powershell
cd imageApi
docker compose -f docker-compose-maria.yml up -d
```

- `cd imageApi` entra na pasta do backend.
- `docker compose` inicia serviços descritos em um arquivo Docker Compose.
- `-f docker-compose-maria.yml` escolhe a configuração do MariaDB.
- `up` inicia os serviços; `-d` deixa o processo em segundo plano.

### Terminal 2: API Spring

Em outro terminal:

```powershell
cd imageApi
.\mvnw.cmd spring-boot:run
```

- `.\mvnw.cmd` executa o Maven Wrapper incluído no projeto. `.\` significa
  “arquivo neste diretório” no PowerShell.
- `spring-boot:run` compila e inicia a API Spring.
- Mantenha o terminal aberto para que a API continue funcionando.

### Terminal 3: interface Next.js

Em um terceiro terminal:

```powershell
cd imagelite
npm run dev
```

- `cd imagelite` entra na pasta da interface.
- `npm run dev` executa o script `dev` do `package.json` e inicia o Next.js em
  modo de desenvolvimento.
- Mantenha o terminal aberto. O endereço local normalmente é
  `http://localhost:3000`.

### Teste completo

1. Abra <http://localhost:3000/galeria>.
2. Clique em **Add New**. Confira que a URL mudou para `/upload`.
3. Informe um nome, escolha uma imagem permitida e digite tags separadas por
   vírgula, por exemplo `natureza, viagem`.
4. Clique em **Enviar imagem** e aguarde a mensagem de sucesso.
5. Clique em **Voltar para a galeria**.
6. Clique em **Search** para consultar a API novamente e procurar a imagem.

