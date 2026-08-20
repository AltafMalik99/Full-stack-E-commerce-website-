import {
  readJsonFile,
  findById,
  createItem,
  updateItem,
  deleteItem,
} from "../utils/jsonDatabase.js";

const PRODUCTS_FILE = "products.json";

/**
 * GET /api/products
 * Supports query params: category, search, minPrice, maxPrice, sort
 */
export async function getProducts(req, res, next) {
  try {
    let products = await readJsonFile(PRODUCTS_FILE);
    const { category, search, minPrice, maxPrice, sort } = req.query;

    if (category && category.toLowerCase() !== "all") {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const term = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    if (minPrice) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === "price_asc") products.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") products.sort((a, b) => b.price - a.price);
    if (sort === "rating_desc") products.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") products.sort((a, b) => b.id - a.id);

    res.json({ count: products.length, products });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await findById(PRODUCTS_FILE, req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await createItem(PRODUCTS_FILE, req.body);
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const updated = await updateItem(PRODUCTS_FILE, req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const success = await deleteItem(PRODUCTS_FILE, req.params.id);
    if (!success) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}
