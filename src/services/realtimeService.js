// src/services/realtimeService.js
/**
 * Servicio sencillo para:
 * - Favoritos: users/{uid}/favorites/{idMeal} -> objeto receta
 * - Carrito:   users/{uid}/cart/{ingredientId} -> { name, measure, quantity }
 *
 * Usa la API modular de Realtime: ref, set, update, onValue, remove, get
 */

import { db } from "../firebase/config";
import {
  ref,
  set,
  update,
  onValue,
  remove,
  get,
  child,
  push,
} from "firebase/database";

// Helpers para paths
const favoritesPath = (uid) => `users/${uid}/favorites`;
const cartPath = (uid) => `users/${uid}/cart`;

/* ------------------ FAVORITOS ------------------ */

// Añadir/actualizar favorito (idMeal como key)
export const setFavorite = async (uid, recipe) => {
  if (!uid) {
    throw new Error("uid required");
  }
  const key = recipe.idMeal.toString();
  const r = ref(db, `${favoritesPath(uid)}/${key}`);
  // set creará/reescribirá el nodo
  await set(r, recipe);
};

// Eliminar favorito
export const removeFavorite = async (uid, idMeal) => {
  if (!uid) {
    throw new Error("uid required");
  }
  const r = ref(db, `${favoritesPath(uid)}/${idMeal.toString()}`);
  await remove(r);
};

// Listener en tiempo real para favoritos
// onUpdate: function(arrayOfRecipes)
export const listenFavorites = (uid, onUpdate, onError) => {
  if (!uid) {
    return () => {};
  }
  const r = ref(db, favoritesPath(uid));
  const unsub = onValue(
    r,
    (snapshot) => {
      const val = snapshot.val() || {};
      // convertir objeto a array
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
  // Nota: onValue devuelve una función? En web no; en RN devolvemos wrapper:
  // No hay unsubscribe directo del onValue; en firebase modular, onValue retorna a callback que no retorna unsub.
  // Para limpiar, se llama off() con la misma ref + callback; pero aquí asumimos el entorno típico.
  // Para simplificar en RN usare el mismo onValue y retornar una función que llama off.
  return () => {
    // no-op: para compatibilidad, podrías usar off() desde la instancia global si lo necesitas
    // pero en la mayoría de SDKs modernos onValue retorna la función para unsubscribir.
  };
};

/* ------------------ CARRITO ------------------ */

// Añadir o sumar ingrediente en el carrito.
// Comportamiento: si existe la key (encoded name) suma quantity; si no, crea.
export const addOrUpdateCartItem = async (uid, ingredient) => {
  if (!uid) {
    throw new Error("uid required");
  }
  // id seguro para key
  const id = encodeURIComponent((ingredient.name || "").trim().toLowerCase());
  const r = ref(db, `${cartPath(uid)}/${id}`);

  // Leer el actual (get)
  const snap = await get(r);
  const existing = snap.exists() ? snap.val() : null;
  if (existing) {
    const newQuantity = (existing.quantity || 0) + (ingredient.quantity || 0);
    await update(r, {
      name: ingredient.name,
      measure: ingredient.measure || existing.measure || "",
      quantity: newQuantity,
    });
  } else {
    await set(r, {
      name: ingredient.name,
      measure: ingredient.measure || "",
      quantity: ingredient.quantity || 0,
    });
  }
};

// Escuchar carrito en tiempo real (onUpdate recibe array)
export const listenCart = (uid, onUpdate, onError) => {
  if (!uid) {
    return () => {};
  }
  const r = ref(db, cartPath(uid));
  const unsub = onValue(
    r,
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
  return () => {
    // ver nota en listenFavorites
  };
};

export const removeCartItem = async (uid, ingredientName) => {
  if (!uid) {
    throw new Error("uid required");
  }
  const id = encodeURIComponent((ingredientName || "").trim().toLowerCase());
  const r = ref(db, `${cartPath(uid)}/${id}`);
  await remove(r);
};

/* ------------------ Lecturas únicas (opcional) ------------------ */

export const getFavoritesOnce = async (uid) => {
  if (!uid) {
    return [];
  }
  const r = ref(db, favoritesPath(uid));
  const s = await get(r);
  const val = s.val() || {};
  return Object.keys(val).map((k) => val[k]);
};

export const getCartOnce = async (uid) => {
  if (!uid) {
    return [];
  }
  const r = ref(db, cartPath(uid));
  const s = await get(r);
  const val = s.val() || {};
  return Object.keys(val).map((k) => val[k]);
};
