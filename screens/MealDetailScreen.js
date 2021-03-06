import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Image,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/CustomHeaderButton";
import { DefaultText } from "../components/DefaultText";
import Colors from "../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../store/actions/meals";

const ListItem = ({ children }) => {
  return (
    <View style={styles.listItem}>
      <DefaultText>{children}</DefaultText>
    </View>
  );
};
export const MealDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const mealId = navigation.getParam("mealId");

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const currentMealIsFavorite = useSelector((state) =>
    state.meals.favoriteMeals.some((meal) => meal.id === mealId)
  );

  const toggleFavoriteMealHandler = useCallback(() => {
    dispatch(toggleFavorite(mealId));
  }, [dispatch, mealId]);

  useEffect(() => {
    // navigation.setParams({ mealTitle: selectedMeal.title });
    navigation.setParams({ toggleFavorite: toggleFavoriteMealHandler });
  }, [toggleFavoriteMealHandler]);

  useEffect(() => {
    navigation.setParams({ isFavorite: currentMealIsFavorite });
  }, [currentMealIsFavorite]);

  return (
    <ScrollView>
      <Image source={{ uri: selectedMeal.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <DefaultText>{selectedMeal.duration}m</DefaultText>
        <DefaultText>{selectedMeal.complexity.toUpperCase()}</DefaultText>
        <DefaultText>{selectedMeal.affordability.toUpperCase()}</DefaultText>
      </View>
      <Text style={styles.title}>Ingredients</Text>
      {selectedMeal.ingredients.map((ingredient) => (
        <ListItem key={ingredient}>{ingredient}</ListItem>
      ))}
      <Text style={styles.title}>Steps</Text>
      {selectedMeal.steps.map((step) => (
        <ListItem key={step}>{step}</ListItem>
      ))}

      <View style={{ marginTop: 10 }}>
        <Button
          color={Colors.accentColor}
          title="Go Back to Categories"
          onPress={() => {
            navigation.popToTop();
          }}
        />
      </View>
    </ScrollView>
  );
};

MealDetailScreen.navigationOptions = ({ navigation }) => {
  // const mealId = navigation.getParam("mealId");
  // const selectedMeal = MEALS.find((meal) => meal.id === mealId);

  const mealTitle = navigation.getParam("mealTitle");
  const toggleFavorite = navigation.getParam("toggleFavorite");
  const isFavorite = navigation.getParam("isFavorite");
  console.log(isFavorite);
  return {
    // headerTitle: selectedMeal.title,
    headerTitle: mealTitle,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Favorite"
          iconName={isFavorite ? "star" : "star-outline"}
          onPress={toggleFavorite}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
  },
  details: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 22,
    textAlign: "center",
    color: Colors.primaryColor,
  },
  listItem: {
    marginVertical: 5,
    marginHorizontal: 20,
    borderColor: "lightgray",
    borderWidth: 1,
    padding: 10,
  },
});
