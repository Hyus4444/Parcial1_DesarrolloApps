// src/screens/DebugDBScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { setFavorite, addOrUpdateCartItem, getFavoritesOnce, getCartOnce, removeFavorite, removeCartItem } from "../services/realtimeService";

export default function DebugDBScreen() {
  const [recipeId, setRecipeId] = useState("");
  const [ingredientName, setIngredientName] = useState("");

  const createFav = async () => {
    const id = recipeId.trim() || Date.now().toString();
    try {
      const recipe = { idMeal: id, strMeal: "Test " + id, strCategory: "Debug", strMealThumb: "https://via.placeholder.com/150" };
      await setFavorite(recipe);
      Alert.alert("OK", "Favorito creado");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || String(e));
    }
  };

  const addCart = async () => {
    const name = ingredientName.trim() || "tomate-" + Date.now();
    try {
      await addOrUpdateCartItem({ name, measure: "1 unidad", quantity: 1 });
      Alert.alert("OK", "Ingrediente añadido al carrito");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || String(e));
    }
  };

  const readAll = async () => {
    try {
      const favs = await getFavoritesOnce();
      const cart = await getCartOnce();
      console.log("Favs:", favs);
      console.log("Cart:", cart);
      Alert.alert("Lectura", `Favoritos: ${favs.length}, Carrito: ${cart.length} (revisa consola)`);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || String(e));
    }
  };

  const delFav = async () => {
    const id = recipeId.trim();
    if (!id) return Alert.alert("Necesitas id en el input");
    try {
      await removeFavorite(id);
      Alert.alert("OK", "Favorito eliminado");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || String(e));
    }
  };

  const delCart = async () => {
    const name = ingredientName.trim();
    if (!name) return Alert.alert("Necesitas nombre ingrediente");
    try {
      await removeCartItem(name);
      Alert.alert("OK", "Ingrediente eliminado");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || String(e));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Debug Realtime DB (PUBLIC)</Text>

      <TextInput style={styles.input} placeholder="ID receta (opcional)" value={recipeId} onChangeText={setRecipeId} />
      <TouchableOpacity style={styles.btn} onPress={createFav}><Text style={styles.btnText}>Crear favorito</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={delFav}><Text style={styles.btnText}>Eliminar favorito (por id)</Text></TouchableOpacity>

      <View style={{ height: 16 }} />

      <TextInput style={styles.input} placeholder="Ingrediente nombre" value={ingredientName} onChangeText={setIngredientName} />
      <TouchableOpacity style={styles.btn} onPress={addCart}><Text style={styles.btnText}>Añadir al carrito</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={delCart}><Text style={styles.btnText}>Eliminar del carrito</Text></TouchableOpacity>

      <View style={{ height: 16 }} />

      <TouchableOpacity style={[styles.btn, { backgroundColor: "#444" }]} onPress={readAll}><Text style={styles.btnText}>Leer todo (consola)</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#121212", minHeight: "100%" },
  title: { color: "#fff", fontSize: 18, marginBottom: 12, textAlign: "center" },
  input: { backgroundColor: "#303030", color: "#fff", padding: 10, borderRadius: 8, marginVertical: 8 },
  btn: { backgroundColor: "#063a52ff", padding: 12, borderRadius: 8, marginVertical: 6 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
