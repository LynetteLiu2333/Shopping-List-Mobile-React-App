import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import BreadCartoon from "./assets/images/bread-cartoon-shopping-cart-without-background.png";

// Firebase app configuration
const appSettings = {
  databaseURL: "https://shopping-list-mobile-app-513ea-default-rtdb.firebaseio.com/"
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const ShoppingList = () => {
  const [inputValue, setInputValue] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    onValue(shoppingListInDB, (snapshot) => {
      if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        setShoppingList(itemsArray);
      } else {
        setShoppingList([]);
      }
    });
  }, []);

  const handleAddClick = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue !== "") {
      push(shoppingListInDB, trimmedValue);
      setInputValue("");
    }
  };

  const handleRemoveClick = (itemID) => {
    const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  };

  return (
    <div className="container">
      <img src={BreadCartoon} alt="Bread Cartoon Shopping Cart" />
      <input
        id="input-field"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button id="add-button" onClick={handleAddClick}>
        ADD TO CART
      </button>
      <ul id="shopping-list">
        {shoppingList.length > 0 ? (
          shoppingList.map(([itemID, itemValue]) => (
            <li key={itemID} onClick={() => handleRemoveClick(itemID)}>
              {itemValue}
            </li>
          ))
        ) : (
          <ul>No items here... yet</ul>
        )}
      </ul>
    </div>
  );
};

export default ShoppingList;
