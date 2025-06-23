-- Inserir produtos iniciais
INSERT INTO products (name, description, sizes, category) VALUES 
(
    'Açaí Tradicional',
    'Açaí puro e cremoso, direto da Amazônia',
    '[
        {"size": "P", "price": 8.5, "ml": "300ml"},
        {"size": "M", "price": 12.0, "ml": "500ml"},
        {"size": "G", "price": 16.5, "ml": "700ml"},
        {"size": "GG", "price": 22.0, "ml": "1L"}
    ]'::jsonb,
    'acai'
),
(
    'Açaí Premium',
    'Açaí especial com polpa selecionada',
    '[
        {"size": "P", "price": 10.0, "ml": "300ml"},
        {"size": "M", "price": 14.5, "ml": "500ml"},
        {"size": "G", "price": 19.0, "ml": "700ml"},
        {"size": "GG", "price": 25.0, "ml": "1L"}
    ]'::jsonb,
    'acai'
),
(
    'Açaí Gourmet',
    'Nossa receita especial com ingredientes premium',
    '[
        {"size": "P", "price": 12.0, "ml": "300ml"},
        {"size": "M", "price": 16.5, "ml": "500ml"},
        {"size": "G", "price": 21.0, "ml": "700ml"},
        {"size": "GG", "price": 28.0, "ml": "1L"}
    ]'::jsonb,
    'acai'
);

-- Inserir complementos
INSERT INTO complements (name, price) VALUES 
('Granola Crocante', 2.0),
('Banana Fresca', 1.5),
('Morango', 2.5),
('Leite Condensado', 1.0),
('Leite em Pó', 1.0),
('Amendoim', 2.0),
('Castanha do Pará', 3.0),
('Coco Ralado', 1.5),
('Nutella', 4.0),
('Paçoca', 2.5),
('Kiwi', 2.0),
('Manga', 2.0);

-- Inserir bebidas
INSERT INTO products (name, description, sizes, category) VALUES 
(
    'Água Mineral',
    'Água mineral 500ml',
    '[{"size": "500ml", "price": 2.0, "ml": "500ml"}]'::jsonb,
    'bebida'
),
(
    'Refrigerante',
    'Refrigerante lata 350ml',
    '[{"size": "350ml", "price": 4.0, "ml": "350ml"}]'::jsonb,
    'bebida'
),
(
    'Suco Natural',
    'Suco natural de frutas 300ml',
    '[{"size": "300ml", "price": 5.0, "ml": "300ml"}]'::jsonb,
    'bebida'
);
