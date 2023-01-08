import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import Book from "./../components/Book/Book";
import { useQuery, useMutation } from "@apollo/react-hooks";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || [];

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(bookId)

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTradeBook = async (bookId) => {
    console.log("trade", bookId);
    // TODO: add ability to make book tradeable
  }

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        {/* <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"
            }:`
            : "You have no saved books!"}
        </h2> */}
        <div className="row">
          <div className="col bookList">
            <h3 className="">Your Library</h3>
            {userData.savedBooks.map((book) => {
              return (
                <Book key={book.bookId} book={book} context='library' handleDeleteBook={handleDeleteBook} handleTradeBook={handleTradeBook}>
                  book
                </Book>
              );
            })}
          </div>
          <div className="col bookList">
            {/* TODO: change savedBooks to wishlist with backend support */}
            <h3>Your Wishlist</h3>
            {userData.savedBooks.map((book) => {
              return <Book book={book} context="wishList">book</Book>;
            })}
          </div>
        </div>
      </Container>
    </>
  );
};

export default SavedBooks;
