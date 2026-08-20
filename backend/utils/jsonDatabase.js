import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "data");

/**
 * Read and parse a JSON file from the data directory.
 * @param {string} fileName e.g. "products.json"
 */
export async function readJsonFile(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      // File doesn't exist yet - create it with an empty array
      await fs.writeFile(filePath, "[]", "utf-8");
      return [];
    }
    throw err;
  }
}

/**
 * Write an array of data back to a JSON file in the data directory.
 * @param {string} fileName
 * @param {Array} data
 */
export async function writeJsonFile(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

/**
 * Find all records, optionally filtered by a predicate function.
 */
export async function findAll(fileName, predicate) {
  const data = await readJsonFile(fileName);
  return predicate ? data.filter(predicate) : data;
}

/**
 * Find a single record by id.
 */
export async function findById(fileName, id) {
  const data = await readJsonFile(fileName);
  return data.find((item) => String(item.id) === String(id)) || null;
}

/**
 * Find a single record matching a predicate function.
 */
export async function findOne(fileName, predicate) {
  const data = await readJsonFile(fileName);
  return data.find(predicate) || null;
}

/**
 * Create a new record. Auto-generates an incremental numeric id
 * if one is not already provided.
 */
export async function createItem(fileName, item) {
  const data = await readJsonFile(fileName);
  const nextId =
    data.length > 0 ? Math.max(...data.map((d) => Number(d.id) || 0)) + 1 : 1;
  const newItem = { id: item.id ?? nextId, ...item };
  data.push(newItem);
  await writeJsonFile(fileName, data);
  return newItem;
}

/**
 * Update a record by id with the given partial fields.
 */
export async function updateItem(fileName, id, updates) {
  const data = await readJsonFile(fileName);
  const index = data.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;
  data[index] = { ...data[index], ...updates, id: data[index].id };
  await writeJsonFile(fileName, data);
  return data[index];
}

/**
 * Delete a record by id. Returns true if a record was removed.
 */
export async function deleteItem(fileName, id) {
  const data = await readJsonFile(fileName);
  const filtered = data.filter((item) => String(item.id) !== String(id));
  if (filtered.length === data.length) return false;
  await writeJsonFile(fileName, filtered);
  return true;
}
