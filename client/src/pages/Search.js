import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import AnchorLink from "react-anchor-link-smooth-scroll";
import RatingStars from "../components/RatingStars";
// google books api, mongoose, auth, graphql, localstorage
import { useMutation, useQuery } from "@apollo/client";
import { googleBookSearch } from "../utils/API";
import Auth from "../utils/auth";
import { SAVE_BOOK, SAVE_WISHLIST } from "../utils/mutations";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { QUERY_ME_BASIC } from "../utils/queries";
// import icons & images
import { HiOutlineStar, HiStar } from "react-icons/hi";

const Search = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [saveBook] = useMutation(SAVE_BOOK);
  const [saveBookToWishlist] = useMutation(SAVE_WISHLIST);
  const { loading, data } = useQuery(QUERY_ME_BASIC);
  // const { data: userData } = useQuery(QUERY_ME_BASIC);
  // const comments = data?.comments || [];
  // const loggedIn = Auth.loggedIn();

  // animation effect
  const style1 = useSpring({
    from: { opacity: 0, marginTop: 0 },
    to: { opacity: 1, marginTop: 0 },
    config: { duration: 3000 },
  });

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // redirect user to profile if logged in
  const { username: userParam } = useParams();
  const user = data?.me || data?.user || {};

  if (Auth.loggedIn() === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div className="text-center text-4xl">Loading...</div>;
  }

  if (!user?.username) {
    return (
      <div className="w-full flex flex-col justify-center items-center text-center">
        <h3 className="text-5xl mb-8">Oops!</h3>
        <div className="max-w-screen-sm bg-slate-900 p-6 rounded-lg shadow-lg">
          You need to be logged in to see this page.
          <br />
          Use the navigation links above to sign up or log in!
        </div>
      </div>
    );
  }

  //search books method and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await googleBookSearch(searchInput);

      if (!response.ok) {
        throw new Error("Something went Wrong!");
      }
      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.err(err);
    }
  };

  //function to save book to db
  const handleSavedBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log({ bookToSave });

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { input: { ...bookToSave } },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };
  //function to save book to db
  const handleWishlist = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log({ bookToSave });

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBookToWishlist({
        variables: { input: { ...bookToSave } },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-[85%] h-auto mx-auto flex flex-col justify-center items-center">
        <animated.div style={style1}>
          <h2 className="text-4xl text-indigo-400 font-medium italic drop-shadow-md">
            It Is The Question That Drives Us, Search!
          </h2>
        </animated.div>

        {/* SEARCH INPUT */}
        <div className="py-5">
          <form className="search w-[500px]" onSubmit={handleFormSubmit}>
            <label for="search" className="sr-only">
              Search
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-teal-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                name="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                className="block w-full rounded-md bg-slate-900 border border-slate-600 text-gray-200 placeholder-slate-500 mt-2 mb-4 py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:text-gray-200 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-2xl"
                placeholder="Search"
              ></input>
            </div>
          </form>

          {/* END SEARCH INPUT */}

          <AnchorLink className="flex justify-center" href="#Feed">
            Follow The White Rabbit!
          </AnchorLink>
        </div>

        {/* LAYOUT BREAK - HORIZONTAL LINE */}
   
      </div>

      {/* GOOGLE BOOKS API */}

      <div class="w-full h-full">
        <div class="bookcard flex flex-row flex-wrap items-center justify-center">
          {searchedBooks.map((book) => {
            return (
              <div className="w-full m-4 md:w-[40%]" key={book.bookId}>
                <div
                  class="cardBody"
                  className="w-full grid grid-cols-1 md:grid-cols-none md:grid-flow-col md:auto-cols-auto bg-slate-900 p-6 rounded-lg shadow-lg"
                >
                  <div>
                    {book.image ? (
                      <img
                        className="p-4"
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                      ></img>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium">{book.title}</h3>
                    <em className="pb-8 text-gray-400">{book.authors}</em>
                    <p className="line-clamp-5 leading-normal">
                      {book.description}
                    </p>

                    {/* SAVE BOOK BUTTON */}
                    <div className="mt-4 flex items-center gap-2 justify-end">
                      {/* {Auth.loggedIn() && ( */}
                      <button
                        className="rounded-md border border-indigo-300 bg-[#22274f] px-4 py-2 text-sm font-medium shadow-md inline-flex items-center"
                        disabled={savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        onClick={() => handleSavedBook(book.bookId)}
                      >
                        {savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        ) ? (
                          <div className="inline-flex items-center">
                            <HiStar
                              size={25}
                              style={{ color: "#f9d18f" }}
                              className="mr-1"
                            />{" "}
                            Saved
                          </div>
                        ) : (
                          <div className="inline-flex items-center">
                            <HiOutlineStar
                              size={25}
                              style={{ color: "#f9d18f" }}
                              className="mr-1"
                            />{" "}
                            Save Book
                          </div>
                        )}
                      </button>
                      <button
                        className="rounded-md border border-indigo-300 bg-[#22274f] px-4 py-2 text-sm font-medium shadow-md inline-flex items-center"
                        disabled={savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        onClick={() => handleWishlist(book.bookId)}
                      >
                        {savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        ) ? (
                          <div className="inline-flex items-center">
                            <HiStar
                              size={25}
                              style={{ color: "#f9d18f" }}
                              className="mr-1"
                            />{" "}
                            Saved to Wishlist
                          </div>
                        ) : (
                          <div className="inline-flex items-center">
                            <HiOutlineStar
                              size={25}
                              style={{ color: "#f9d18f" }}
                              className="mr-1"
                            />{" "}
                            Add to Wishlist
                          </div>
                        )}
                      </button>
                      {/* )} */}
                    </div>

                    <RatingStars />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* END GOOGLE BOOKS API */}

      
    </>
  );
};

export default Search;
