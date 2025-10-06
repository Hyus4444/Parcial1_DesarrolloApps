import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("@favorites");
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error cargando favoritos:", e);
      }
    };
    loadFavorites();
  }, []);

  const saveFavorites = async (newFavs) => {
    try {
      await AsyncStorage.setItem("@favorites", JSON.stringify(newFavs));
    } catch (e) {
      console.error("Error guardando favoritos:", e);
    }
  };

  const toggleFavorite = (recipe) => {
    let updated;
    if (favorites.some((f) => f.idMeal === recipe.idMeal)) {
      updated = favorites.filter((f) => f.idMeal !== recipe.idMeal);
    } else {
      updated = [...favorites, recipe];
    }
    setFavorites(updated);
    saveFavorites(updated);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
