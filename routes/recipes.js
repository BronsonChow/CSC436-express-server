import { Router } from "express";
import { supabase } from "../data/supabase.js";
import { recipes, takeNextId } from "../data/recipes.js";
import { validateRecipe, validateRecipePatch } from "../middleware/validate.js";

const router = Router();

router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) {
        return res.status(500).json({ error });
    }
    res.json(data);
});

function findRecipe(idText) {
    return recipes.find((r) => r.id === Number(idText));
}

// GET /api/recipes  (optional filters: ?cuisine= &maxMinutes= &tag= &q=)
router.get("/", (req, res) => {
    const { cuisine, maxMinutes, tag, q } = req.query;
    let results = recipes;
    if (cuisine) results = results.filter((r) => r.cuisine.toLowerCase() === cuisine.toLowerCase());
    if (maxMinutes) results = results.filter((r) => r.minutes <= Number(maxMinutes));
    if (tag) results = results.filter((r) => r.tags.includes(tag));
    if (q) results = results.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
    res.json(results);
});

// GET /api/recipes/:id
router.get("/:id", (req, res) => {
    const recipe = findRecipe(req.params.id);
    if (!recipe) return res.status(404).json({ error: `No recipe with id ${req.params.id}` });
    res.json(recipe);
});

// POST /api/recipes
router.post("/", validateRecipe, (req, res) => {
    const { name, cuisine, minutes, tags = [] } = req.body;
    const recipe = { id: takeNextId(), name: name.trim(), cuisine: cuisine.trim(), minutes, tags };
    recipes.push(recipe);
    res.status(201).json(recipe);
});

// PATCH /api/recipes/:id
router.patch("/:id", validateRecipePatch, async (req, res) => {
    const recipe = findRecipe(req.params.id);
    if (!recipe) return res.status(404).json({ error: `No recipe with id ${req.params.id}` });
    const { name, cuisine, minutes, tags } = req.body;
    if (name !== undefined) recipe.name = name.trim();
    if (cuisine !== undefined) recipe.cuisine = cuisine.trim();
    if (minutes !== undefined) recipe.minutes = minutes;
    if (tags !== undefined) recipe.tags = tags;

    const { data, error } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', recipe.id)
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error });
    }
    res.json(data);
});

// DELETE /api/recipes/:id
router.delete("/:id", (req, res) => {
    const index = recipes.findIndex((r) => r.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: `No recipe with id ${req.params.id}` });
    recipes.splice(index, 1); // splice so the shared array in data/recipes.js changes too
    res.status(204).end();
});

export default router;
