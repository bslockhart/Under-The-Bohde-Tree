import React, { useEffect, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";

// google books api, mongoose, auth, graphql, localstorage
import { useMutation, useQuery } from "@apollo/client";
import { googleBookSearch } from "../utils/API";
import Auth from "../utils/auth";
import { SAVE_BOOK, SAVE_WISHLIST } from "../utils/mutations";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { QUERY_ME_BASIC } from "../utils/queries";

// import icons & images

import { HiOutlineStar, HiStar } from "react-icons/hi";
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs'
import { RxDotFilled } from 'react-icons/rx'


const Search = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [saveBook] = useMutation(SAVE_BOOK);
  const [saveBookToWishlist] = useMutation(SAVE_WISHLIST);
  const { loading, data } = useQuery(QUERY_ME_BASIC);
  const [currentIndex, setCurrentIndex] = useState(0)

  // slider functionality

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length -1 : currentIndex -1;
    setCurrentIndex(newIndex);
  }

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex)
  }


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
    console.log(user);
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
        tradeBool: book.tradeBool,
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
    console.log(bookToSave);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.log("no token");
      return false;
    }

    try {
      await saveBook({
        variables: { input: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err, JSON.stringify(err, null, 2));
    }
  };

  //function to save book to db
  const handleWishlist = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log(bookToSave);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBookToWishlist({
        variables: { input: bookToSave },
      });
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  
  // const autoplayInterval = 3000; // 3 seconds

  // function slider() {
  //   const [currentIndex, setCurrentIndex] = useState(0)
  //   const intervalRef = useRef(null)

  //   useEffect(() => {
  //     intervalRef.current = setInterval(() => {
  //       nextSlide();
  //     }, autoplayInterval)

  //     return() => {
  //       clearInterval(intervalRef.current)
  //     }
  //   }, [currentIndex])
  // }

  const slides = [
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/Axel-Marazzi-book-quote.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/Benjamin-Franklin-book-quote.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2014/12/Laura-Bush-book-quote-image.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/Carlos-Ruiz-Zafon-book-quote.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/David-Mitchell-book-quote.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/Haruki-Murakami-book-quote.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/J.K.-Rowling-book-quote.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/Mortimer-Jerome-Adler-book-quote.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2014/12/Chinese-Proverb-quote-image.jpg?w=540&ssl=1'
    },
    {
      url: 'https://i0.wp.com/ebookfriendly.com/wp-content/uploads/2015/01/Maya-Angelou-book-quote.jpg?w=540&ssl=1'
    },
  ];

  

  return (

    <div className="w-[85%] h-auto mx-auto flex flex-col justify-center items-center">

        {/* Slider Start */}

        <div className="max-w-[400px] h-[400px] w-full m-auto py-16 px-4 relative group">
          <div style={{backgroundImage: `url(${slides[currentIndex].url})`}} className="w-full h-full rounded-2xl bg-center bg-cover duration-500"></div>

            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>

            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div>
            <div className="flex top-4 justify-center py-2">
              {slides.map((slide, slideIndex) => (
                  <div
                    key={slideIndex} 
                    onClick={() => goToSlide(slideIndex)} 
                    className="text-1xl cursor-pointer"
                  >
                    <RxDotFilled />
                  </div>
              ))}
            </div>
        </div>


      <div className="w-[85%] h-auto mx-auto mt-20 flex flex-col justify-center items-center">
        <animated.div style={style1}>
          <h2 className="text-4xl text-indigo-400 font-medium italic drop-shadow-md">
            It Is The Question That Drives Us, Search!
          </h2>
        </animated.div>
        

        {/* SEARCH INPUT */}
        <div className="py-5">
          <form className="flex justify-center" onSubmit={handleFormSubmit}>
            <div className="mb-3 xl:w-96">
              <div className="input-group relative flex gap-2 items-stretch w-full mb-4">
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="button-addon3"
                />
                <button
                  type="submit"
                  className="border-2 px-2 rounded border-[#6bfece] text-[#6bfece]"
                  id="button-addon3"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* END SEARCH INPUT */}
        </div>

        {/* LAYOUT BREAK - HORIZONTAL LINE */}
      </div>

      {/* GOOGLE BOOKS API */}

      <div className="w-full h-full">
        <div className="bookcard flex flex-row flex-wrap items-center justify-center">
          {searchedBooks.map((book) => {
            return (
              <div className="w-full m-4 md:w-[40%]" key={book.bookId}>
                <div className="w-full grid grid-cols-1 md:grid-cols-none md:grid-flow-col md:auto-cols-auto bg-slate-900 p-6 rounded-lg shadow-lg">
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
                          <div className="inline-flex items-center">Saved</div>
                        ) : (
                          <div className="inline-flex items-center">
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
                            Saved to Wishlist
                          </div>
                        ) : (
                          <div className="inline-flex items-center">
                            Add to Wishlist
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* END GOOGLE BOOKS API */}
    </div>
  );
};

export default Search;
