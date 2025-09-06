import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { FavoritesContext } from "../context/FavoritesContext";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useContext(FavoritesContext);

  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.text}>No tienes recetas favoritas aún 🍲</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: "#121212" }}
      data={favorites}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate("DetallesRecetas", { idMeal: item.idMeal })
          }
        >
          <Image source={{ uri: item.strMealThumb }} style={styles.image} />
          <Text style={styles.text}>{item.strMeal}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  item: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    backgroundColor: "#303030",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  text: {
    alignSelf: "center",
    fontSize: 20,
    color: "#ffffff",
  },
});
