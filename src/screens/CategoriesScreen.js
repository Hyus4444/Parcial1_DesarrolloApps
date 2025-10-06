import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios
      .get("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((response) => {
        if (!mounted) {
          return;
        }
        setCategories(response.data.categories || []);
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
      });
    return () => (mounted = false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Favoritos")}
            style={styles.headerIcon}
            accessibilityLabel="Favoritos"
          >
            <MaterialIcons name="favorite" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CarritoIngredientes")}
            style={styles.headerIcon}
            accessibilityLabel="Carrito"
          >
            <MaterialIcons name="shopping-cart" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
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
      <FlatList
        data={categories}
        keyExtractor={(item) => item.idCategory.toString()}
        renderItem={renderCategory}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    color: "#fff",
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
    color: "#fff",
  },

  headerBtnLeft: {
    marginLeft: 12,
    padding: 6,
  },
  headerRightContainer: {
    flexDirection: "row",
    marginRight: 8,
    alignItems: "center",
  },
  headerIcon: {
    marginHorizontal: 6,
    padding: 6,
  },
});
