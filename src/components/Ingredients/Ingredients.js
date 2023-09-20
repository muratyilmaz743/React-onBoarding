import React, { useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      'https://react-basics-df486-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-type': 'application/json' },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((res) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: res.name, ...ingredient },
        ]);
      });
  };

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-basics-df486-default-rtdb.firebaseio.com/ingredients/${ingredientId}`,
      {
        method: 'DELETE',
      }
    )
      .then(() => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onSearchedIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
