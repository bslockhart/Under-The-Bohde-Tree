import * as React from "react";
import { Link } from 'react-router-dom';

// import icons
import { GiSpellBook, GiArchiveResearch } from 'react-icons/gi';
import { WiStars } from "react-icons/wi";


const Index = () => {
  return (
    <main className="w-full h-full">

      <h2 className="pb-8 text-5xl text-center font-medium drop-shadow">Under The Bohde Tree</h2>
      <div className="max-w-screen-lg mx-auto bg-slate-900 p-6 rounded-lg shadow-lg">

        {/* START BOOK NOOK INFO CONTAINER */}
        <div className="max-w-screen-lg w-full mb-8 grid sm:grid-cols-3 mx-auto">
          <div className="flex flex-col justify-center items-center px-8 py-4 text-center border-b sm:border-b-0 sm:border-r border-gray-700">
            {/* GETTING STARTED INFO HERE */}
            <GiSpellBook size={65} style={{ color: '#ffffff' }} className="flex justify-center items-center" />
            <h3 className="font-medium">Welcome</h3>
            <p>
              The Book Swap is an online community that alows avid readers to meet up with othes to discuss, view, and trade their favorite books.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center px-8 py-4 text-center border-b sm:border-b-0 sm:border-r border-gray-700">
            {/* DISCOVER READS INFO HERE */}
            <GiArchiveResearch size={65} style={{ color: '#ffffff' }} className="flex justify-center items-center" />
            <h3 className="font-medium">Book Search</h3>
            <p>
              Search for new books for leisure, study, or for that important class assignment. Make notes and meet others who want to trade their favorite books.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center px-8 py-4 text-center">
            {/* MEET FRIENDS INFO HERE */}
            <WiStars size={65} style={{ color: '#ffffff' }} className="flex justify-center items-center" />
            <h3 className="font-medium">Book Swap</h3>
            <p>
              Find others who have the books you need. Discuss, swap, or trade the books in your personal library.
            </p>
          </div>
        </div>
        {/* END BOOK NOOK INFO CONTAINER */}

        <div className="flex justify-center">

          <Link to='/signup'>
            <button className="px-6 py-2 rounded drop-shadow-md">The Adventure Awaits</button>
          </Link>

        </div>

      </div>
    </main>
  );
};

export default Index;