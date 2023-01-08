import React, { useState } from "react";
import "./Book.css";
import { Button } from "react-bootstrap";
import Auth from "../../utils/auth";

export default function Book({
  context,
  book,
  rating,
  setRating,
  searchedBooks,
  setSearchedBooks,
  saveBook,
  savedBookIds,
  setSavedBookIds,
  handleDeleteBook,
  handleTradeBook,
  findUsersWithBook,
  deleteBookFromWishList
}) {
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
        {/* Render different buttons depending on the context in which the card is called */}
        <div className="btns">
          {Auth.loggedIn() && context === "library" ? (
            <>
              <Button className="btn-block btn-info" onClick={handleTradeBook}>
                available to trade
              </Button>
              <Button
                className="btn-block btn-danger"
                onClick={() => handleDeleteBook(book.bookId)}
              >
                DeleteBook
              </Button>
            </>
          ) : Auth.loggedIn && context === "search" ? (
            <>
              <Button
                disabled={savedBookIds?.some(
                  (savedBookId) => savedBookId === book.bookId
                )}
                className="btn-block btn-info"
                onClick={() => handleSaveBook(book.bookId)}
              >
                {savedBookIds?.some(
                  (savedBookId) => savedBookId === book.bookId
                )
                  ? "This book has already been saved!"
                  : "Save this Book!"}
              </Button>
            </>
          ) : Auth.loggedIn && context === "wishList" ? (
            <>
              <Button className="btn-block btn-info" onClick={() => findUsersWithBook(book.bookId)}>
                find book
              </Button>
              <Button className="btn-block btn-danger"onClick={() => deleteBookFromWishList(book.bookId)}>
                remove from wishlist
              </Button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
