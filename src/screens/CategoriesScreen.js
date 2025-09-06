import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import axios from "axios";

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
      });
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          color="#063a52ff"
          title="Favoritos"
          onPress={() => navigation.navigate("Favorites")}
        />
      ),
    });
  }, [navigation]);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ListaRecetas", { category: item.strCategory })
      }
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
    backgroundColor: "#121212",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#ffffff",
  },
  card: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    backgroundColor: "#303030",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 40,
  },
  title: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  Button: {
    width: "20%",
    height: 50,
    color: "#063a52ff",
  },
});
