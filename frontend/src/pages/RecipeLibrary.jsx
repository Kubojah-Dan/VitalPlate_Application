import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import { apiFetch } from "../apiClient.js";
import { Search } from "lucide-react";

const RecipeLibrary = () => {
  const [recipes, setRecipes] = useState([]);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [search, setSearch] = useState("chicken");
  const [loading, setLoading] = useState(true);

  const loadRecipes = async (term) => {
    try {
      setLoading(true);
      const data = await apiFetch(`/recipes/search?q=${term}`);
      setRecipes(data.recipes || []);
    } catch (e) {
      console.error("Recipe search failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes(search);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadRecipes(search);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Navbar />

        <div className="p-8 max-w-6xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mb-8"
          >
            <Search className="text-slate-500" size={18} />
            <input
              type="text"
              className="bg-transparent flex-1 text-white px-3 outline-none"
              placeholder="Search meals (e.g. chicken, salad)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="text-vp-secondary font-semibold">Search</button>
          </form>

          {loading ? (
            <div className="text-vp-secondary text-center text-xl">Loading recipes…</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onClick={() => setModalRecipe(r)}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {modalRecipe && (
        <RecipeModal recipe={modalRecipe} onClose={() => setModalRecipe(null)} />
      )}
    </div>
  );
};

export default RecipeLibrary;
