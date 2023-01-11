import React from "react";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import logo from "../../images/bohde_logo.png";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header>
      <nav>
        <div className="mx-8 my-6 flex justify-between items-center">
          <Link to="/search" className="">
            <img src={logo} className="w-60"></img>
          </Link>
          <div>
            {/* NAVBAR */}
            <div className="uppercase ">
              <div className="hidden md:flex bg-[#02030ac8] px-7 py-2 rounded-md font-semibold gap-4 ">
                {Auth.loggedIn() ? (
                  <>
                    <Link to="/search">Search</Link>
                    <Link to="/profile">Profile</Link>
                    <button
                      onClick={logout}
                      className="bg-transparent hover:bg-transparent text-[#ffc300] hover:text-[#ffc300]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="mr-6">
                      Sign Up
                    </Link>

                    <Link to="/login" className="ml-6">
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
