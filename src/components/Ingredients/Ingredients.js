import React, { useCallback, useReducer, useMemo, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("We need a type to perform.");
  }
};
function Ingredients() {
  const [userIngredients, dispatchIngredient] = useReducer(
    ingredientReducer,
    [],
  );
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier } =
    useHttp();

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    if (!isLoading && reqIdentifier === "REMOVE_INGREDIENT") {
      dispatchIngredient({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
      dispatchIngredient({
        type: "ADD",
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading]);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      `https://react-basics-df486-default-rtdb.firebaseio.com/ingredients.json`,
      "POST",
      JSON.stringify(ingredient),
      ingredient,
      "ADD_INGREDIENT",
    );
  }, []);

  const clearError = () => {
    //dispatchHttp({ type: "CLEAR" });
  };

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-basics-df486-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT",
      );
    },
    [sendRequest],
  );

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatchIngredient({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onCloere={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onSearchedIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
