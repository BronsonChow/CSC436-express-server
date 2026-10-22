import express from "express"; //ESM

const app = express();
const PORT = 3000;
let nextId = 7;

const recipes = [
    { id: 1, name: "Margerita Pizza", cuisine: "Italian", minutes: 20, tags: ["vegetarian", "cheese"] },
    { id: 2, name: "Shrimp Fried Rice", cuisine: "Chinese", minutes: 30, tags: ["rice", "shrimp"] },
    { id: 3, name: "Chicken Caesar Salad", cuisine: "American", minutes: 15, tags: ["salad", "chicken"] },
    { id: 4, name: "Taco Bell", cuisine: "Mexican", minutes: 25, tags: ["taco", "beef"] },
    { id: 5, name: "Sushi", cuisine: "Japanese", minutes: 40, tags: ["fish", "rice"] },
    { id: 6, name: "Pasta Primavera", cuisine: "Italian", minutes: 25, tags: ["vegetarian", "pasta"] }
];

app.get("/api/recipes", (req, res) => {
    res.json(recipes);

    const { cuisine, maxMinutes, tag, q } = req.query;

    console.log(cuisine);
    console.log(maxMinutes);
    console.log(tag);
    console.log(q);

    const results = recipes;

    // FIXME
    if(cuisine) {
        results.filter((r) => r.cuisine === cuisine);
        console.log(results);
    }
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

app.post("/api/recipes", (req, res) => {
    /* Object Destructuring Crash Course
    const object = {
        name: "me",
        cuisine: "human",
        minutes: 27,
        tags: ["empty"]
    }
    
    const [name] = object;
    const [cuisine] = object;
    const [minutes] = object;
    const [tags] = object;
    */
    const { name, cuisine, minutes, tags } = req.body;

    if(typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Name must be a non-empty string" });
    }
    if(typeof cuisine !== "string" || cuisine.trim() === "") {
        return res.status(400).json({ error: "Cuisine must be a non-empty string" });
    }
    if(typeof minutes !== "number" || minutes <= 0) {
        return res.status(400).json({ error: "Minutes must be a positive number" });
    }
    if(!Array.isArray(tags) || tags.some(tag => typeof tag !== "string" || tag.trim() === "")) {
        return res.status(400).json({ error: "Tags must be an array of non-empty strings" });
    }

    const recipe = { id: nextId++, name: name.trim(), cuisine: cuisine.trim(), minutes, tags };

    recipes.push(recipe);
    res.status(201).json(recipe);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});