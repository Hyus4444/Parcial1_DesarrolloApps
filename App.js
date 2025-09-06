import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import CategoriesScreen from "./src/screens/CategoriesScreen";
import RecipesListScreen from "./src/screens/RecipesListScreen";
import RecipeDetailScreen from "./src/screens/RecipeDetailScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Categorias">
          <Stack.Screen
            name="Categorias"
            component={CategoriesScreen}
            options={{
              title: "Categorias",
              headerStyle: { backgroundColor: "#303030" },
              headerTintColor: "#ffffff",
            }}
          />
          <Stack.Screen
            name="ListaRecetas"
            component={RecipesListScreen}
            options={{
              title: "Recetas",
              headerStyle: { backgroundColor: "#303030" },
              headerTintColor: "#ffffff",
            }}
          />
          <Stack.Screen
            name="DetallesRecetas"
            component={RecipeDetailScreen}
            options={{
              title: "Detalle de Receta",
              headerStyle: { backgroundColor: "#303030" },
              headerTintColor: "#ffffff",
            }}
          />
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{
              title: "Favoritos",
              headerStyle: { backgroundColor: "#303030" },
              headerTintColor: "#ffffff",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
