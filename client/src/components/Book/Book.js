import React, { useState } from "react";
import "./Book.css";
import { Button } from "react-bootstrap";
import Auth from "../../utils/auth";

export default function Book({ book, rating, setRating, searchedBooks, setSearchedBooks, saveBook, savedBookIds, setSavedBookIds }) {
  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { input: bookToSave },
      });

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRating = (rate) => {
    setRating(rate);
    console.log(book);
  };

  const addToWishlist = (id) => {
    console.log(id, "Wishlist");
  };
  return (
    <div className="book">
      <img alt={`${book.title} cover`} src={book.image} />
      <div className="book__content">
        <div className="book__info">
          <h2>
            <a href={book.link} target="_blank" rel="noreferrer noopener">
              {book.title}
            </a>
          </h2>
          <h4>
            {book.authors.length > 1 ? "Authors:" : "Author:"}
            {book.authors.map((author) => {
              return <div>{author}</div>;
            })}
          </h4>
        </div>
        <div className="btns">

          <Button className="btn-block btn-info"onClick={() => addToWishlist(book.bookId)}>
            add to Wishlist
          </Button>
          {Auth.loggedIn() && (
            <Button
              disabled={savedBookIds?.some(
                (savedBookId) => savedBookId === book.bookId
              )}
              className="btn-block btn-info"
              onClick={() => handleSaveBook(book.bookId)}
            >
              {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                ? "This book has already been saved!"
                : "Save this Book!"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
