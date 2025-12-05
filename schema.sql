-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(id)
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  items TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_date TEXT,
  observations TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias padrão
INSERT OR IGNORE INTO categories (id, name, description, icon) VALUES
  ('educativos', 'Educativos', 'Brinquedos que estimulam o aprendizado', '🎓'),
  ('pelucia', 'Pelúcia', 'Brinquedos fofinhos e carinhosos', '🧸'),
  ('jogos', 'Jogos', 'Jogos de tabuleiro e quebra-cabeças', '🎲'),
  ('acao', 'Ação', 'Bonecos de ação e super-heróis', '🦸'),
  ('bebes', 'Bebês', 'Brinquedos para os pequeninos', '👶');

-- Inserir produtos de exemplo
INSERT OR IGNORE INTO products (id, name, category, description, price, image_url, stock, featured, active) VALUES
  ('urso-teddy-brown', 'Urso Teddy Brown', 'pelucia', 'Urso de pelúcia marrom super fofinho, perfeito para abraçar', 89.90, '/images/placeholder.jpg', 15, 1, 1),
  ('quebra-cabeca-animais', 'Quebra-cabeça Animais', 'educativos', 'Quebra-cabeça com 100 peças de animais da floresta', 45.90, '/images/placeholder.jpg', 20, 1, 1),
  ('boneco-super-heroi', 'Boneco Super Herói', 'acao', 'Boneco articulado de super-herói com 30cm', 129.90, '/images/placeholder.jpg', 10, 1, 1),
  ('kit-blocos-construcao', 'Kit Blocos de Construção', 'educativos', 'Kit com 200 blocos coloridos para construção', 159.90, '/images/placeholder.jpg', 25, 1, 1),
  ('carrinho-controle-remoto', 'Carrinho Controle Remoto', 'acao', 'Carrinho veloz com controle remoto', 199.90, '/images/placeholder.jpg', 8, 0, 1),
  ('boneca-princesa', 'Boneca Princesa', 'bebes', 'Linda boneca princesa com vestido brilhante', 79.90, '/images/placeholder.jpg', 12, 0, 1);

-- Inserir configurações padrão
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('company_name', 'Oli Poli Shop'),
  ('whatsapp', '5511999999999'),
  ('phone', '(11) 3333-4444'),
  ('address', 'Rua dos Brinquedos, 123 - São Paulo, SP'),
  ('banner_url', '/images/banner-default.jpg'),
  ('logo_url', '/images/logo-default.png'),
  ('description', 'A melhor loja de brinquedos da região!');
