# ImageLite
Projeto desenvolvido em sala de aula para exemplificar o uso de Spring e Next.js.

## Executar localmente

Requer Java 21, Docker e Node.js.

1. Inicie o MariaDB usado pela API:

   ```powershell
   cd imageApi
   docker compose -f docker-compose-maria.yml up -d
   ```

2. Em outro terminal, inicie a API na porta `8080`:

   ```powershell
   cd imageApi
   .\mvnw.cmd spring-boot:run
   ```

3. Inicie a interface:

   ```powershell
   cd imagelite
   npm install
   npm run dev
   ```

   A galeria fica em <http://localhost:3000/galeria>.

Por padrão, a interface consulta `http://localhost:8080/images` e a API aceita
requisições do site em `http://localhost:3000`. Para mudar esses endereços,
configure `NEXT_PUBLIC_IMAGE_API_URL` na interface e
`IMAGE_API_ALLOWED_ORIGIN` na API.
