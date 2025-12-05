# 🎪 Oli Poli Shop - E-commerce Vitrine

E-commerce completo de brinquedos construído com Astro, SolidJS e Cloudflare. Sistema moderno, responsivo e totalmente funcional para vendas via WhatsApp.

## 🚀 Stack Tecnológica

- **[Astro](https://astro.build/)** - Framework web moderno
- **[SolidJS](https://www.solidjs.com/)** - Biblioteca reativa para componentes interativos
- **[Cloudflare Pages](https://pages.cloudflare.com/)** - Hospedagem
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Serverless functions
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** - Banco de dados SQL
- **[Cloudflare R2](https://developers.cloudflare.com/r2/)** - Armazenamento de imagens
- **[TailwindCSS](https://tailwindcss.com/)** - Estilização

## ✨ Funcionalidades

### 🛍️ Área Pública

- **Landing Page** - Banner de destaque, produtos em destaque, categorias
- **Loja** - Grid de produtos com filtros por categoria
- **Detalhes do Produto** - Página completa com descrição e produtos relacionados
- **Carrinho de Compras** - Gerenciamento de itens com SolidJS
- **Checkout** - Formulário de dados do cliente
- **Acompanhamento de Pedido** - Página para o cliente acompanhar o status
- **Integração WhatsApp** - Envio automático do pedido para o WhatsApp da loja
- **Tema Claro/Escuro** - Alternância entre temas

### 👨‍💼 Painel Administrativo

- **Dashboard** - Estatísticas, gráficos, produtos com baixo estoque
- **Gerenciar Produtos** - CRUD completo com upload de imagens
- **Gerenciar Categorias** - CRUD completo
- **Gerenciar Pedidos** - Visualização, alteração de status, contato via WhatsApp
- **Configurações** - Nome da empresa, WhatsApp, endereço, logos, banners

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Cloudflare (para deploy)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/oli-poli-shop.git
cd oli-poli-shop
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Cloudflare D1**

Crie o banco de dados:
```bash
npx wrangler d1 create oli-poli-db
```

Copie o `database_id` retornado e atualize em `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "oli-poli-db"
database_id = "seu-database-id-aqui"
```

Inicialize o banco de dados:
```bash
npm run db:init
```

4. **Configure o Cloudflare R2**

Crie o bucket:
```bash
npx wrangler r2 bucket create oli-poli-images
```

Atualize `wrangler.toml` se necessário.

5. **Execute em desenvolvimento**
```bash
npm run dev
```

Acesse em `http://localhost:4321`

## 🗂️ Estrutura do Projeto

```
oli-poli-shop/
├── src/
│   ├── components/          # Componentes SolidJS
│   │   ├── Cart.tsx         # Carrinho de compras
│   │   ├── AddToCart.tsx    # Botão adicionar ao carrinho
│   │   └── admin/           # Componentes do admin
│   │       ├── ProductManager.tsx
│   │       ├── CategoryManager.tsx
│   │       ├── OrderManager.tsx
│   │       └── SettingsManager.tsx
│   ├── layouts/             # Layouts Astro
│   │   ├── MainLayout.astro
│   │   └── AdminLayout.astro
│   ├── pages/               # Páginas e rotas
│   │   ├── index.astro      # Landing page
│   │   ├── loja.astro       # Lista de produtos
│   │   ├── checkout.astro   # Checkout
│   │   ├── produto/
│   │   │   └── [id].astro   # Detalhes do produto
│   │   ├── pedido/
│   │   │   └── [id].astro   # Acompanhamento
│   │   ├── admin/           # Painel admin
│   │   │   ├── index.astro
│   │   │   ├── produtos.astro
│   │   │   ├── categorias.astro
│   │   │   ├── pedidos.astro
│   │   │   └── config.astro
│   │   └── api/             # API Routes
│   │       ├── products/
│   │       ├── categories/
│   │       ├── orders/
│   │       ├── upload.ts
│   │       └── settings.ts
│   ├── lib/                 # Utilitários
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── styles/
│   │   └── global.css
│   └── env.d.ts
├── public/                  # Arquivos estáticos
├── schema.sql               # Schema do banco de dados
├── wrangler.toml            # Configuração Cloudflare
├── astro.config.mjs         # Configuração Astro
├── tailwind.config.js       # Configuração Tailwind
└── package.json
```

## 🗄️ Banco de Dados

O projeto utiliza Cloudflare D1 com as seguintes tabelas:

- **products** - Produtos da loja
- **categories** - Categorias de produtos
- **orders** - Pedidos dos clientes
- **settings** - Configurações gerais

### Schema

Veja o arquivo `schema.sql` para o schema completo.

### Comandos Úteis

```bash
# Criar tabelas localmente (desenvolvimento)
npm run db:init

# Migrar para produção
npm run db:migrate
```

## 📱 Integração WhatsApp

O sistema gera automaticamente links do WhatsApp com o resumo do pedido. Configure o número do WhatsApp em:

**Admin > Configurações > WhatsApp Principal**

Formato: `5511999999999` (código do país + DDD + número, sem espaços ou caracteres especiais)

## 🎨 Personalização

### Cores

Edite `tailwind.config.js` para personalizar as cores:

```js
colors: {
  primary: {
    50: '#fef2f2',
    // ...
    900: '#7f1d1d',
  },
}
```

### Logo e Banner

Configure via **Admin > Configurações**:
- Logo da loja
- Banner da landing page

## 🚀 Deploy

### Cloudflare Pages

1. **Build do projeto**
```bash
npm run build
```

2. **Deploy**
```bash
npm run deploy
```

Ou conecte seu repositório ao Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Framework preset: `Astro`

### Variáveis de Ambiente

Configure no Cloudflare Dashboard:
- D1 Database: vincule `oli-poli-db`
- R2 Bucket: vincule `oli-poli-images`

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview da build
npm run db:init      # Inicializar banco local
npm run db:migrate   # Migrar banco para produção
npm run deploy       # Deploy no Cloudflare Pages
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

Feito com ❤️ usando Astro + SolidJS + Cloudflare
