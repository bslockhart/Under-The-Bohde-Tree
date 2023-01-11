import React, { useState } from "react";
import "react-dropdown/style.css";
import { useParams, Navigate } from "react-router-dom";
// mongoose, auth, graphql
import { useMutation, useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { QUERY_ME, QUERY_USER } from "../utils/queries";
import { TOGGLE_TRADE } from "../utils/mutations";

import { REMOVE_BOOK, REMOVE_WISH } from "../utils/mutations";
import { removeBookId } from "../utils/localStorage";
// import components
import Modal from "../components/modal/Modal";


const Profile = () => {
  const [toggleTradeBool] = useMutation(TOGGLE_TRADE);
  // retrieve user information
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  const userData = data?.me || data?.user || {};

  // remove book functionality
  const [deleteBook] = useMutation(REMOVE_BOOK);
  const [removeWish] = useMutation(REMOVE_WISH);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      await deleteBook({
        variables: { bookId },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [modalBook, setModalBook] = useState({});

  const handleModal = (book) => {
    console.log("hit");
    setShowModal(true);
    // setModalProps(book, showModal, setShowModal)
    setModalBook(book);
  };

  //add to wishlist
  const handleRemoveWish = async (bookId) => {
    console.log(bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      await removeWish({
        variables: { bookId },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // redirect user to profile if logged in
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div className="text-center text-4xl">Loading...</div>;
  }

  if (!userData?.username) {
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

  const handleTrade = async (bookId) => {
    console.log(bookId)
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await toggleTradeBool({
        variables: { bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handleRemoveTrade = async (bookId) => {
    console.log(bookId)
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await toggleTradeBool({
        variables: { bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        book={modalBook}
      />
      <main className="min-h-full">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  className="h-24 w-24 rounded-full"
                  src="https://i.imgur.com/iBCf2Vd.png"
                  alt=""
                ></img>{" "}
                <span
                  className="absolute inset-0 rounded-full shadow-inner"
                  aria-hidden="true"
                ></span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-semibold drop-shadow">
                {userData.username}
              </h1>
              <p className="font-medium text-gray-100">{userData.username}</p>
            </div>
          </div>
          <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
            <a href="#">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-[#22274f] px-4 py-2 text-sm font-medium text-indigo-200 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="pl-2">Edit Account</p>
              </button>
            </a>
          </div>
        </div>

        {/* LIBRARY, WISHLIST, AND WILLING TO TRADE */}
        <div className="flex gap-4 flex justify-center m-6 ">
          {/* LIBRARY */}
          <section className="basis-full">
            <div className="mt-8 px-4 sm:px-6">
              <h2 className="text-4xl text-indigo-300 font-medium drop-shadow">
                Library
              </h2>
            </div>
            <div className="bg-slate-900 shadow-lg sm:rounded-lg mt-8">
              <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
                {" "}
                {userData?.savedBooks?.map((book) => (
                  <>
                    <div
                      key={book.bookId}
                      className="overflow-hidden bg-[#22274f] shadow sm:rounded-md"
                    >
                      <ul className="divide-y divide-gray-700">
                        <li key={book.bookId}>
                          <div className="block hover:bg-slate-800">
                            <div className="px-4 py-2 sm:px-6">
                              <div className="flex gap-2 justify-between">
                                <img
                                  className="rounded"
                                  alt={`cover of ${book.title}`}
                                  src={book.image}
                                />
                                <div>
                                  <h2 className="font-medium ">{book.title}</h2>
                                  <em>{book.authors}</em>
                                  <div>
                                  </div>
                                </div>
                                <div className="ml-2 flex flex-col justify-evenly">
                                  <button
                                    className="inline-flex justify-center rounded font-bold py-2 px-4 rounded-full>"
                                    onClick={() =>
                                      handleDeleteBook(book.bookId)
                                    }
                                  >
                                    Remove
                                  </button>
                                  <button
                                    className="rounded-md border border-indigo-300 bg-[#22274f] px-4 py-2 text-sm font-medium shadow-md inline-flex items-center"
                                    onClick={() => handleTrade(book.bookId)}
                                  >
                                      <div className="inline-flex items-center">
                                        Available to Trade
                                      </div>
                                  
                                  </button>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </>
                ))}
              
              </div>
            </div>
          </section>

          {/* WISHLIST */}
          <section className="basis-full">
            <div className="mt-8 px-4 sm:px-6">
              <h2 className="text-4xl text-indigo-300 font-medium drop-shadow">
                Wishlist
              </h2>
            </div>
            <div className="bg-slate-900 shadow-lg sm:rounded-lg mt-8">
              <div className=" flex flex-col gap-4 px-4 py-5 sm:px-6">
                {" "}
                {userData?.wishList?.map((book) => (
                  <>
                    <div
                      key={book.bookId}
                      className="overflow-hidden bg-[#22274f] shadow sm:rounded-md"
                    >
                      <ul className="divide-y divide-gray-700">
                        <li key={book.bookId}>
                          <div className="block hover:bg-slate-800">
                            <div className="px-4 py-2 sm:px-6">
                              <div className="flex gap-2 justify-between">
                                <img
                                  className="rounded"
                                  alt={`cover of ${book.title}`}
                                  src={book.image}
                                />
                                <div>
                                  <h2 className="font-medium ">{book.title}</h2>
                                  <em>{book.authors}</em>
                                  <div>
                                  </div>
                                </div>
                                <div className="ml-2 flex flex-col justify-evenly">
                                  <button
                                    className="inline-flex justify-center rounded font-bold py-2 px-4 rounded-full>"
                                    onClick={() =>
                                      handleRemoveWish(book.bookId)
                                    }
                                  >
                                    Remove
                                  </button>
                                  <button
                                    onClick={() => handleModal(book)}
                                    className="rounded-md border border-indigo-300 bg-[#22274f] px-4 py-2 text-sm font-medium shadow-md inline-flex justify-center"
                                  ><div className="flex items-center justify-center">
                                    Find
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </>
                ))}
           
              </div>
            </div>
          </section>

          {/* TRADE */}
          <section className="basis-full">
            <div className="mt-8 px-4 sm:px-6">
              <h2 className="text-4xl text-indigo-300 font-medium drop-shadow z-[0]">
                Willing to Trade
              </h2>
            </div>
            <div className="bg-slate-900 shadow-lg sm:rounded-lg mt-8">
              <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
                {" "}
                {userData?.savedBooks
                  ?.filter((book) => {
                    return book.tradeBool === true;
                  })
                  .map((book) => (
                    <>
                      <div
                        key={book.bookId}
                        className="overflow-hidden bg-[#22274f] shadow sm:rounded-md"
                      >
                        <ul className="divide-y divide-gray-700">
                          <li key={book.bookId}>
                            <div className="block hover:bg-slate-800">
                              <div className="px-4 py-2 sm:px-6">
                                <div className="flex gap-2 justify-between">
                                  <img
                                    className="rounded"
                                    alt={`cover of ${book.title}`}
                                    src={book.image}
                                  />
                                  <div>
                                    <h2 className="font-lg ">{book.title}</h2>
                                    <em>{book.authors}</em>
                                    <div>
                                    </div>
                                  </div>
                                  <div className="ml-2 flex flex-col justify-evenly">
                                    <button
                                      className="inline-flex justify-center rounded font-bold py-2 px-4 rounded-full>"
                                      onClick={() =>
                                        handleRemoveTrade(book.bookId)
                                      }
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </>
                  ))}
             
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Profile;
