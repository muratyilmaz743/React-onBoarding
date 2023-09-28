import React, { useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('We need a type to perform.');
  }
};
const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errourMessage };
    case 'CLEAR':
      return { ...curHttpState,  error: null};
    default:
      throw new Error('Action type is wrong.');
  }
};
function Ingredients() {
  const [userIngredients, dispatchIngredient] = useReducer(
    ingredientReducer,
    []
  );
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
 // const [isLoading, setIsLoading] = useState(false);
 // const [error, setError] = useState();

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttp({type: 'SEND'})
    fetch(
      'https://react-basics-df486-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-type': 'application/json' },
      }
      )
      .then((response) => {
        dispatchHttp({type: 'RESPONSE'});
        return response.json();
      })
      .then((res) => {
        dispatchIngredient({
          type: 'ADD',
          ingredient: { id: res.name, ...ingredient },
        });
      });
  }, []);

  const clearError = () => {
    dispatchHttp({type: 'CLEAR'})

  };

  const removeIngredientHandler = useCallback((ingredientId) => {
    dispatchHttp({type: 'SEND'});
    fetch(
      `https://react-basics-df486-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
      )
      .then(() => {
        dispatchHttp({type: 'SEND'})
        dispatchIngredient({ type: 'DELETE', id: ingredientId });
      })
      .catch((error) => {
        dispatchHttp({tyoe: 'ERROR', errorMessage: error})
      });
  },[]);

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatchIngredient({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const  ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredientHandler}
    />
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className='App'>
      {httpState.error && <ErrorModal onCloere={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onSearchedIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
