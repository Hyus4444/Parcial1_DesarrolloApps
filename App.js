import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CategoriesScreen from "./src/screens/CategoriesScreen";
import RecipesListScreen from "./src/screens/RecipesListScreen";
import RecipeDetailScreen from "./src/screens/RecipeDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Categorias">
        <Stack.Screen name="Categorias" component={CategoriesScreen} options={{ title: "Categorías" }} />
        <Stack.Screen name="ListaRecetas" component={RecipesListScreen} options={{ title: "Recetas" }} />
        <Stack.Screen name="DetallesRecetas" component={RecipeDetailScreen} options={{ title: "Detalle de Receta" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
