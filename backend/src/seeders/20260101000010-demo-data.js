'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const categories = [
      { id: randomUUID(), name: 'Eletrônicos', slug: 'eletronicos' },
      { id: randomUUID(), name: 'Livros', slug: 'livros' },
      { id: randomUUID(), name: 'Roupas', slug: 'roupas' },
    ];

    await queryInterface.bulkInsert(
      'categories',
      categories.map((c) => ({ ...c, created_at: now, updated_at: now }))
    );

    const products = [
      {
        id: randomUUID(),
        name: 'Fone de Ouvido Bluetooth',
        description: 'Fone sem fio com cancelamento de ruído.',
        price: 199.9,
        stock: 50,
        image_url: 'https://picsum.photos/seed/fone/400/400',
        category_id: categories[0].id,
      },
      {
        id: randomUUID(),
        name: 'Smartwatch',
        description: 'Relógio inteligente com monitor de frequência cardíaca.',
        price: 349.0,
        stock: 30,
        image_url: 'https://picsum.photos/seed/watch/400/400',
        category_id: categories[0].id,
      },
      {
        id: randomUUID(),
        name: 'Clean Code',
        description: 'Livro sobre boas práticas de desenvolvimento de software.',
        price: 89.5,
        stock: 100,
        image_url: 'https://picsum.photos/seed/book1/400/400',
        category_id: categories[1].id,
      },
      {
        id: randomUUID(),
        name: 'Camiseta Básica',
        description: 'Camiseta 100% algodão, várias cores.',
        price: 49.9,
        stock: 200,
        image_url: 'https://picsum.photos/seed/shirt/400/400',
        category_id: categories[2].id,
      },
    ];

    await queryInterface.bulkInsert(
      'products',
      products.map((p) => ({ ...p, created_at: now, updated_at: now }))
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
