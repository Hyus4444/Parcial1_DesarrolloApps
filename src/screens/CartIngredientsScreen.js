import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FavoritesContext } from "../context/FavoritesContext";

export default function CartIngredientsScreen({ navigation }) {
  const { cart, addToCart, removeFromCart } = useContext(FavoritesContext);

  const changeQuantity = (item, delta) => {
    const newQty = (item.quantity || 0) + delta;
    if (newQty <= 0) {
      Alert.alert("Eliminar", `¿Eliminar ${item.name} del carrito?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => removeFromCart(item.name),
        },
      ]);
      return;
    }
    addToCart({ name: item.name, measure: item.measure, quantity: delta });
  };

  if (!cart || cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>El carrito está vacío.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) =>
          encodeURIComponent((item.name || "").toLowerCase())
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              {item.measure ? (
                <Text style={styles.measure}>{item.measure}</Text>
              ) : null}
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => changeQuantity(item, -1)}
                style={styles.qtyBtn}
              >
                <MaterialIcons name="remove" size={18} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.quantity || 0}</Text>

              <TouchableOpacity
                onPress={() => changeQuantity(item, +1)}
                style={styles.qtyBtn}
              >
                <MaterialIcons name="add" size={18} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => removeFromCart(item.name)}
                style={{ marginLeft: 10 }}
              >
                <MaterialIcons name="delete" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyText: {
    color: "#ddd",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#303030",
    padding: 12,
    borderRadius: 8,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  measure: {
    color: "#bfbfbf",
    fontSize: 12,
    marginTop: 2,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    padding: 8,
    backgroundColor: "#424242",
    borderRadius: 6,
    marginHorizontal: 6,
  },
  qtyText: {
    color: "#fff",
    minWidth: 26,
    textAlign: "center",
  },
});
