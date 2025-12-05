# 🚀 Guia de Deploy no Cloudflare Pages

## ⚠️ Problema Atual

A página não carrega porque o **D1 (banco de dados)** e **R2 (storage)** não estão configurados.

## 📋 Solução Passo a Passo

### **Etapa 1: Criar e Configurar D1 (Banco de Dados)**

#### 1.1 Criar o banco de dados

```bash
npx wrangler d1 create oli-poli-db
```

#### 1.2 Copiar o database_id

Você receberá uma resposta como:
```
[[d1_databases]]
binding = "DB"
database_name = "oli-poli-db"
database_id = "abc123-def456-ghi789"  # ← COPIE ESTE ID
```

#### 1.3 Atualizar wrangler.toml

Abra `wrangler.toml` e substitua:
```toml
database_id = "your-database-id-here"
```

Por:
```toml
database_id = "abc123-def456-ghi789"  # Seu ID real
```

#### 1.4 Inicializar o banco (criar tabelas)

```bash
# Executar o schema SQL
npx wrangler d1 execute oli-poli-db --remote --file=./schema.sql
```

Isso irá criar todas as tabelas e inserir dados de exemplo.

---

### **Etapa 2: Criar R2 Bucket (Armazenamento de Imagens)**

```bash
# Criar bucket de produção
npx wrangler r2 bucket create oli-poli-images

# Criar bucket de preview (opcional)
npx wrangler r2 bucket create oli-poli-images-preview
```

---

### **Etapa 3: Configurar Bindings no Cloudflare Pages Dashboard**

Agora você precisa vincular o D1 e R2 ao seu projeto Pages:

#### 3.1 Acessar o Dashboard

1. Acesse: https://dash.cloudflare.com
2. Vá em **Workers & Pages**
3. Clique no seu projeto: **oli-poli-shop**

#### 3.2 Configurar D1 Binding

1. Vá na aba **Settings**
2. Role até **Functions**
3. Clique em **D1 database bindings** → **Add binding**
   - **Variable name:** `DB`
   - **D1 database:** Selecione `oli-poli-db`
4. Clique em **Save**

#### 3.3 Configurar R2 Binding

1. Ainda em **Settings** → **Functions**
2. Clique em **R2 bucket bindings** → **Add binding**
   - **Variable name:** `R2`
   - **R2 bucket:** Selecione `oli-poli-images`
3. Clique em **Save**

---

### **Etapa 4: Fazer Deploy Novamente**

```bash
# Build
npm run build

# Deploy
npx wrangler pages deploy dist --branch=main
```

---

## ✅ Verificação

Após configurar tudo, acesse sua URL:
- https://oli-poli-shop.pages.dev

Você deve ver:
- ✅ Landing page carregando
- ✅ Produtos em destaque
- ✅ Categorias
- ✅ Sem erros no console

---

## 🐛 Troubleshooting

### Erro: "Cannot read properties of undefined (reading 'DB')"

**Causa:** D1 binding não configurado no dashboard

**Solução:** Siga a Etapa 3.2 acima

### Erro: "Failed to fetch products"

**Causa:** Banco de dados vazio ou não inicializado

**Solução:** Execute:
```bash
npx wrangler d1 execute oli-poli-db --remote --file=./schema.sql
```

### Erro: "R2 bucket not found"

**Causa:** R2 binding não configurado

**Solução:** Siga a Etapa 3.3 acima

---

## 📝 Comandos Úteis

```bash
# Ver bancos D1 criados
npx wrangler d1 list

# Ver dados no banco
npx wrangler d1 execute oli-poli-db --remote --command="SELECT * FROM products"

# Ver buckets R2
npx wrangler r2 bucket list

# Logs em tempo real
npx wrangler pages deployment tail
```

---

## 🎯 Checklist Final

- [ ] D1 criado: `npx wrangler d1 create oli-poli-db`
- [ ] `wrangler.toml` atualizado com `database_id` real
- [ ] Schema executado: `npx wrangler d1 execute ... --file=./schema.sql`
- [ ] R2 bucket criado: `npx wrangler r2 bucket create oli-poli-images`
- [ ] D1 binding configurado no dashboard (Variable: `DB`)
- [ ] R2 binding configurado no dashboard (Variable: `R2`)
- [ ] Deploy realizado: `npx wrangler pages deploy dist`
- [ ] Site funcionando: https://oli-poli-shop.pages.dev

---

## 💡 Dica

Se quiser testar localmente antes de fazer deploy:

```bash
# Instalar Miniflare para simular Cloudflare localmente
npm install -D miniflare

# Rodar em dev mode
npm run dev
```

Note que o modo dev do Astro não vai conectar ao D1/R2 real. Para testar com os serviços reais, você precisa usar `wrangler pages dev`.
