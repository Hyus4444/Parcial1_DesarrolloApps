import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // API de TheMealDB para traer categorías de comidas
    axios
      .get("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
      });
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("RecipesList", { category: item.strCategory })}
    >
      <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
      <Text style={styles.title}>{item.strCategory}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categorías de Recetas</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.idCategory}
        renderItem={renderCategory}
        numColumns={2} // Para mostrar en grilla
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
  },
});
