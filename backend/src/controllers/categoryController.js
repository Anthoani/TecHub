const { Category } = require('../models');
const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
});

const DIACRITICS_REGEX = /[̀-ͯ]/g;

// Converte o nome de uma categoria em um identificador amigável para URLs.
function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Lista todas as categorias em ordem alfabética.
async function list(req, res, next) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

// Valida e cria uma categoria com slug único.
async function create(req, res, next) {
  try {
    const data = createCategorySchema.parse(req.body);
    const category = await Category.create({ name: data.name, slug: slugify(data.name) });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create };
