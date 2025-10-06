// src/context/FavoritesContext.js
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  listenFavorites,
  getFavoritesOnce,
  setFavorite,
  removeFavorite,
  listenCart,
  getCartOnce,
  addOrUpdateCartItem,
  removeCartItem,
} from "../services/realtimeService";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const f = await AsyncStorage.getItem("@favorites_public");
        const c = await AsyncStorage.getItem("@cart_public");
        if (f) {
          setFavorites(JSON.parse(f));
        }
        if (c) {
          setCart(JSON.parse(c));
        }
      } catch (e) {
        console.warn("Error cargando cache local:", e);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubFav = listenFavorites(
      (arr) => {
        setFavorites(arr);
        AsyncStorage.setItem("@favorites_public", JSON.stringify(arr)).catch(
          () => {}
        );
      },
      (err) => console.warn("listenFavorites err:", err)
    );

    const unsubCart = listenCart(
      (arr) => {
        setCart(arr);
        AsyncStorage.setItem("@cart_public", JSON.stringify(arr)).catch(
          () => {}
        );
      },
      (err) => console.warn("listenCart err:", err)
    );

    return () => {
      if (typeof unsubFav === "function") {
        unsubFav();
      }
      if (typeof unsubCart === "function") {
        unsubCart();
      }
    };
  }, []);

  // funciones expuestas
  const toggleFavorite = async (recipe) => {
    try {
      const exists = favorites.some((f) => f.idMeal === recipe.idMeal);
      if (exists) {
        await removeFavorite(recipe.idMeal);
      } else {
        await setFavorite(recipe);
      }
      // el listener actualiza el estado remoto
    } catch (e) {
      console.error("toggleFavorite err:", e);
    }
  };

  const addToCart = async (ingredient) => {
    try {
      await addOrUpdateCartItem(ingredient);
    } catch (e) {
      console.error("addToCart err:", e);
    }
  };

  const removeFromCart = async (ingredientName) => {
    try {
      await removeCartItem(ingredientName);
    } catch (e) {
      console.error("removeFromCart err:", e);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, cart, addToCart, removeFromCart }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
