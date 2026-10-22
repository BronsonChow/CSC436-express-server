import express from "express"; //ESM

const app = express();
const PORT = 3000;

const recipes = [
    { id: 1, name: "Margerita Pizza", cuisine: "Italian", minutes: 20, tags: ["vegetarian", "cheese"] }
];

app.get("/api/recipes", (req, res) => {
    res.json(recipes);
});

app.get("/api/recipes/:id", (req, res) => {
    console.log(`Fetching recipe with id ${req.params.id}`);
    const id = Number(req.params.id);
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
        return res.status(404).json({ error: `No recipe with id ${req.params.id}` });
    }

    res.json(recipe);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});