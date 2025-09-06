import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import axios from "axios";

export default function RecipeDetailScreen({ route }) {
  const { idMeal } = route.params;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
      .then((response) => {
        setRecipe(response.data.meals[0]);
      })
      .catch((error) => {
        console.error("Error al cargar detalle de la receta:", error);
      });
  }, [idMeal]);

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando receta...</Text>
      </View>
    );
  }

  // 🔎 Extraer ingredientes + medidas
  const getIngredients = () => {
    let ingredientes = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredientes.push(`${ingredient} - ${measure}`);
      }
    }
    return ingredientes;
  };

  const ingredientes = getIngredients();

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Text style={styles.category}>
        {recipe.strCategory} - {recipe.strArea}
      </Text>

      {/* Lista de ingredientes */}
      <Text style={styles.section}>Ingredientes</Text>
      {ingredientes.map((item, index) => (
        <Text key={index} style={styles.ingredient}>
          • {item}
        </Text>
      ))}

      {/* Instrucciones */}
      <Text style={styles.section}>Instrucciones</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    fontSize: 20,
    color: "#ffffff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#ffffff",
  },
  category: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 15,
    textAlign: "center",
  },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#ffffff",
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "justify",
    color: "#ffffff",
    marginBottom: 100,
  },
  ingredient: {    
    fontSize: 14,
    lineHeight: 20,
    textAlign: "justify",
    color: "#ffffff",
    padding: 5,
  },

});
