import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { FavoritesContext } from "../context/FavoritesContext";

export default function RecipeDetailScreen({ route, navigation }) {
  const { idMeal } = route.params;

  // ---- hooks
  const [recipe, setRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItems, setModalItems] = useState([]);

  // ---- context ----
  const { favorites, toggleFavorite, addToCart } = useContext(FavoritesContext);
  const isFavorite = recipe
    ? favorites.some((f) => f.idMeal === recipe.idMeal)
    : false;

  // ---- cargar receta ----
  useEffect(() => {
    let mounted = true;
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
      .then((response) => {
        if (!mounted) {
          return;
        }
        const r = response.data.meals && response.data.meals[0];
        setRecipe(r || null);
      })
      .catch((error) => {
        console.error("Error al cargar detalle de la receta:", error);
      });
    return () => {
      mounted = false;
    };
  }, [idMeal]);

  // ---- extraer ingredientes de la receta ----
  const extractIngredients = (rec) => {
    if (!rec) {
      return [];
    }
    const items = [];
    for (let i = 1; i <= 20; i++) {
      const name = rec[`strIngredient${i}`];
      const measure = rec[`strMeasure${i}`];
      if (name && name.trim() !== "") {
        items.push({
          name: name.trim(),
          measure: measure ? measure.trim() : "",
          quantity: 1,
          selected: false,
        });
      }
    }
    return items;
  };

  // sincronizar modalItems cuando cargue la receta
  useEffect(() => {
    if (recipe) {
      setModalItems(extractIngredients(recipe));
    }
  }, [recipe]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {/* Botón Favorito */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => {
              if (!recipe) {
                return;
              }
              toggleFavorite(recipe);
            }}
          >
            <MaterialIcons
              name={isFavorite ? "favorite" : "favorite-border"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Botón Carrito: abre modal con ingredientes */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => {
              if (!recipe) {
                return;
              }
              setModalItems(extractIngredients(recipe)); // asegurar lista actualizada
              setModalVisible(true);
            }}
          >
            <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
    // dependencias: navigation, recipe, favorites (isFavorite depende de favorites)
  }, [navigation, recipe, favorites]);

  // ---- modal: selección y cantidad ----
  const toggleSelectItem = (index) => {
    setModalItems((prev) => {
      const copy = [...prev];
      copy[index].selected = !copy[index].selected;
      return copy;
    });
  };

  const changeQuantity = (index, delta) => {
    setModalItems((prev) => {
      const copy = [...prev];
      const current = copy[index].quantity || 0;
      const next = Math.max(1, current + delta);
      copy[index].quantity = next;
      return copy;
    });
  };

  const confirmAddToCart = async () => {
    const selected = modalItems.filter((it) => it.selected);
    if (selected.length === 0) {
      setModalVisible(false);
      return;
    }

    try {
      for (const it of selected) {
        await addToCart({
          name: it.name,
          measure: it.measure,
          quantity: it.quantity || 1,
        });
      }
      console.log("Ingredientes añadidos al carrito (public).");
    } catch (e) {
      console.error("Error añadiendo al carrito:", e);
    } finally {
      setModalVisible(false);
    }
  };

  // ---- renderizar ----
  if (!recipe) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando receta...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>{recipe.strMeal}</Text>
        <Text style={styles.category}>
          {recipe.strCategory} {recipe.strArea ? `- ${recipe.strArea}` : ""}
        </Text>

        <Text style={styles.section}>Ingredientes</Text>
        {extractIngredients(recipe).map((it, idx) => (
          <Text key={idx} style={styles.ingredient}>
            • {it.name} {it.measure ? `- ${it.measure}` : ""}
          </Text>
        ))}

        <Text style={styles.section}>Preparación</Text>
        <Text style={styles.instructions}>{recipe.strInstructions}</Text>
      </ScrollView>

      {/* Modal para seleccionar ingredientes a añadir al carrito */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona ingredientes</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <FlatList
                data={modalItems}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{ paddingBottom: 8 }}
                renderItem={({ item, index }) => (
                  <View style={styles.modalItem}>
                    <TouchableOpacity
                      onPress={() => toggleSelectItem(index)}
                      style={styles.checkbox}
                    >
                      {item.selected ? (
                        <MaterialIcons
                          name="check-box"
                          size={22}
                          color="#063a52ff"
                        />
                      ) : (
                        <MaterialIcons
                          name="check-box-outline-blank"
                          size={22}
                          color="#fff"
                        />
                      )}
                    </TouchableOpacity>

                    <View style={styles.modalItemText}>
                      <Text style={styles.modalItemName}>{item.name}</Text>
                      <Text style={styles.modalItemMeasure}>
                        {item.measure}
                      </Text>
                    </View>

                    <View style={styles.qtyContainer}>
                      <TouchableOpacity
                        onPress={() => changeQuantity(index, -1)}
                        style={styles.qtyButton}
                      >
                        <Text style={styles.qtyText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyCount}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => changeQuantity(index, +1)}
                        style={styles.qtyButton}
                      >
                        <Text style={styles.qtyText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmAddToCart}
              >
                <Text style={styles.confirmText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },
  category: {
    color: "#bfbfbf",
    marginTop: 6,
  },
  section: {
    color: "#fff",
    marginTop: 12,
    fontWeight: "700",
  },
  ingredient: {
    color: "#ddd",
    paddingVertical: 4,
  },
  instructions: {
    color: "#ddd",
    marginTop: 8,
    lineHeight: 20,
  },
  headerButtons: {
    flexDirection: "row",
    marginRight: 8,
  },
  headerBtn: {
    marginHorizontal: 6,
    padding: 6,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 760,
    maxHeight: "85%",
    backgroundColor: "#303030",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  modalClose: {
    padding: 6,
    borderRadius: 6,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 18,
  },
  modalBody: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxHeight: 320,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.4,
    borderColor: "#222",
  },
  checkbox: {
    width: 36,
    alignItems: "center",
  },
  modalItemText: {
    flex: 1,
    paddingHorizontal: 8,
  },
  modalItemName: {
    color: "#fff",
    fontSize: 16,
  },
  modalItemMeasure: {
    color: "#bfbfbf",
    fontSize: 12,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#424242",
    borderRadius: 6,
  },
  qtyText: {
    color: "#fff",
    fontSize: 16,
  },
  qtyCount: {
    color: "#fff",
    marginHorizontal: 10,
    minWidth: 22,
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
    backgroundColor: "#303030",
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: "#fff",
  },
  confirmBtn: {
    backgroundColor: "#063a52ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
