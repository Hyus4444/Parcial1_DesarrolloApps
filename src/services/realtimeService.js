// src/services/realtimeService.js
import { db } from "../firebase/config";
import { ref, set, get, onValue, remove, update } from "firebase/database";

/**
 * Rutas públicas (sin auth) para pruebas:
 * - /public_app/favorites/{idMeal}
 * - /public_app/cart/{ingredientId}
 */

const basePath = "public_app";

const favoritesPath = () => `${basePath}/favorites`;
const cartPath = () => `${basePath}/cart`;

/* ----- Favoritos ----- */

export const setFavorite = async (recipe) => {
  if (!recipe || !recipe.idMeal) {
    throw new Error("recipe.idMeal required");
  }
  const key = recipe.idMeal.toString();
  const nodeRef = ref(db, `${favoritesPath()}/${key}`);
  await set(nodeRef, recipe);
};

export const removeFavorite = async (idMeal) => {
  const nodeRef = ref(db, `${favoritesPath()}/${idMeal.toString()}`);
  await remove(nodeRef);
};

export const getFavoritesOnce = async () => {
  const nodeRef = ref(db, favoritesPath());
  const snap = await get(nodeRef);
  const val = snap.val() || {};
  return Object.keys(val).map((k) => val[k]);
};

export const listenFavorites = (onUpdate, onError) => {
  const nodeRef = ref(db, favoritesPath());
  const unsub = onValue(
    nodeRef,
    (snapshot) => {
      const val = snapshot.val() || {};
      const arr = Object.keys(val).map((k) => val[k]);
      onUpdate(arr);
    },
    (err) => {
      if (onError) {
        onError(err);
      }
      console.warn("listenFavorites error:", err);
    }
  );
  return unsub; // puedes llamar unsub() para cancelar
};

/* ----- Carrito ----- */

export const addOrUpdateCartItem = async (ingredient) => {
  if (!ingredient || !ingredient.name) {
    throw new Error("ingredient.name required");
  }
  const id = encodeURIComponent((ingredient.name || "").trim().toLowerCase());
  const nodeRef = ref(db, `${cartPath()}/${id}`);

  // obtener actual
  const snap = await get(nodeRef);
  const existing = snap.exists() ? snap.val() : null;
  if (existing) {
    const newQty = (existing.quantity || 0) + (ingredient.quantity || 0);
    await update(nodeRef, {
      name: ingredient.name,
      measure: ingredient.measure || existing.measure || "",
      quantity: newQty,
    });
  } else {
    await set(nodeRef, {
      name: ingredient.name,
      measure: ingredient.measure || "",
      quantity: ingredient.quantity || 0,
    });
  }
};

export const removeCartItem = async (ingredientName) => {
  const id = encodeURIComponent((ingredientName || "").trim().toLowerCase());
  const nodeRef = ref(db, `${cartPath()}/${id}`);
  await remove(nodeRef);
};

export const getCartOnce = async () => {
  const nodeRef = ref(db, cartPath());
  const snap = await get(nodeRef);
  const val = snap.val() || {};
  return Object.keys(val).map((k) => val[k]);
};

export const listenCart = (onUpdate, onError) => {
  const nodeRef = ref(db, cartPath());
  const unsub = onValue(
    nodeRef,
    (snapshot) => {
      const val = snapshot.val() || {};
      const arr = Object.keys(val).map((k) => val[k]);
      onUpdate(arr);
    },
    (err) => {
      if (onError) {
        onError(err);
      }
      console.warn("listenCart error:", err);
    }
  );
  return unsub;
};
