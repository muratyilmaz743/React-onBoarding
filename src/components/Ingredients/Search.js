import React, { useEffect, useRef, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onSearchedIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const searchInputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === searchInputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch(
          "https://react-basics-df486-default-rtdb.firebaseio.com/ingredients.json" +
            query,
        )
          .then((res) => res.json())
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onSearchedIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      // we do it to have only one timer once.
      clearTimeout(timer);
    };
  }, [enteredFilter, onSearchedIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            onChange={(event) => setEnteredFilter(event.target.value)}
            ref={searchInputRef}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
