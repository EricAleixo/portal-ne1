<div align="center">

<img src="docs/ne11-21.png" alt="Portal NE1" width="180"/>

# Portal NE1

**Portal de notícias do Nordeste — SSR-first, performance e SEO de verdade.**

[![Site](https://img.shields.io/badge/🌐%20portalne1.com-online-brightgreen)](https://www.portalne1.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-containerizado-2496ED?logo=docker)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-S3%20%2B%20EC2-FF9900?logo=amazonaws)](https://aws.amazon.com/)
[![Licença](https://img.shields.io/badge/Licença-CC%20BY--NC--ND%204.0-lightgrey)](./LICENSE)

</div>

---

## Sobre o projeto

O **Portal NE1** é um portal de notícias com foco no **Nordeste brasileiro**, desenvolvido com ênfase em **Server-Side Rendering (SSR)** para máxima indexação e performance em mecanismos de busca. Cada página de matéria é renderizada no servidor com metadados dinâmicos — título, descrição, Open Graph e JSON-LD — garantindo presença orgânica forte sem depender de JavaScript no cliente para o conteúdo essencial.

A aplicação cobre política, esporte, educação, turismo, entretenimento e a seção especial **"Notícias do Passado"**, que resgata registros jornalísticos históricos da região.

🌐 **[www.portalne1.com](https://www.portalne1.com)**

---

## Screenshots

| | |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Matéria](docs/screenshots/post.png) |
| ![Categoria](docs/screenshots/categoria.png) | ![Mobile](docs/screenshots/mobile.png) |

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Linguagem | **TypeScript 5** |
| ORM | **Drizzle ORM** |
| Estilização | **Tailwind CSS** + PostCSS |
| Gerenciador de pacotes | **pnpm** (workspaces) |
| Containerização | **Docker** + Docker Compose |
| Storage de mídia | **AWS S3** |
| Hospedagem | **AWS** |
| Lint | **ESLint** (flat config) |

---

## Arquitetura

```
portal-ne1/
├── app/                    # Next.js App Router
│   ├── _actions/           # Server Actions
│   ├── _components/        # Componentes globais
│   ├── _db/                # Conexão e queries Drizzle
│   ├── _infra/             # Integrações de infraestrutura (AWS S3, etc.)
│   ├── _services/          # Regras de negócio
│   ├── _types/             # Tipagens globais
│   ├── _utils/             # Helpers e utilitários
│   ├── (admin)/            # Route group — painel administrativo
│   ├── (auth)/             # Route group — autenticação
│   ├── (journalist)/       # Route group — área do jornalista
│   ├── (public)/           # Route group — portal público
│   └── api/                # API Routes
├── lib/                    # Bibliotecas e configurações compartilhadas
├── services/               # Serviços externos
├── types/                  # Tipos globais fora do app
├── public/                 # Assets estáticos
├── drizzle.config.ts
├── middleware.ts
├── next.config.ts
├── docker-compose.yml
└── Dockerfile
```

A separação em **Route Groups** (`(admin)`, `(auth)`, `(journalist)`, `(public)`) mantém layouts, middlewares e lógica de autenticação isolados por contexto sem poluir a URL.

---

## SSR e SEO

Todo o conteúdo editorial é renderizado no servidor (`async` Server Components). As páginas de matéria geram metadados dinâmicos via `generateMetadata()`:

- `<title>` e `<meta description>` por matéria
- **Open Graph** e **Twitter Card** com imagem da capa vinda do S3
- **JSON-LD** (`NewsArticle`) para indexação semântica no Google News
- **Sitemap** e `robots.txt` gerados dinamicamente
- Sem `"use client"` no caminho crítico de renderização das matérias

Isso elimina a dependência de crawlers executarem JavaScript para indexar o conteúdo — cada matéria chega ao Googlebot como HTML completo.

---

## AWS S3 — storage de mídia

Imagens e arquivos de mídia são armazenados no **Amazon S3**. O upload é feito diretamente pelo servidor via SDK da AWS (sem expor credenciais ao cliente). As URLs geradas são servidas diretamente nas páginas, com o servidor intermediando o acesso sem expor credenciais ao cliente.

---

## Executando localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v9+
- [Docker](https://www.docker.com/) + Docker Compose

### Com Docker (recomendado)

```bash
git clone https://github.com/seu-usuario/portal-ne1.git
cd portal-ne1

cp .env.example .env

docker-compose up --build
```

### Sem Docker

```bash
pnpm install

cp .env.example .env
# Preencha as variáveis de ambiente

npx drizzle-kit migrate   # Roda as migrations

pnpm dev                  # http://localhost:3000
```

### Build de produção

```bash
pnpm build
pnpm start
```

---

## Variáveis de ambiente

```env
# Admin
ADMIN_PASSWORD=
ADMIN_NAME=

# App
API_URL=

# Autenticação
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Banco de dados (PostgreSQL)
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=
# Exemplo: postgresql://postgres:postgres@postgres:5432/portal

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=
```

---

## Licença

Este projeto está licenciado sob a **Creative Commons Atribuição-NãoComercial-SemDerivações 4.0 Internacional (CC BY-NC-ND 4.0)**.

Isso significa que:

- ✅ Você pode visualizar e estudar o código
- ❌ **Não pode** usar para fins comerciais
- ❌ **Não pode** redistribuir versões modificadas
- ❌ **Não pode** sublicenciar ou reutilizar em outros projetos

Consulte o arquivo [LICENSE](./LICENSE) ou acesse [creativecommons.org/licenses/by-nc-nd/4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.pt_BR) para mais detalhes.

---

<div align="center">
  <sub>Desenvolvido e mantido por <strong>Eric Aleixo</strong> · Nordeste, Brasil 🌵</sub>
</div>