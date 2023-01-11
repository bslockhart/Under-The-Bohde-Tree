import React, { useState } from "react";

export default function Modal({ book, showModal, setShowModal}) {
  const [traders, setTraders] = useState();

  //   TODO: QUERY DATABASE FOR USERS WITH BOOK IN AVAILABLE TO TRADE


    return showModal ? (
    <div className="z-[9999999] fixed top-0 right-0 w-full h-full bg-black/[.6] ">
      <div className=" w-1/2 h-1/2 mx-auto mt-20 rounded-lg bg-slate-300">
        <header className="flex justify-between p-2 text-[#000814]">
          <div className="font-semibold  text-2xl text-center py-4">
            {book.title}
          </div>
          <div onClick={() => {setShowModal(false)}} className=" flex justify-center rounded p-4 items-center h-6 w-6 m-0 text-4xl bg-slate-300 text-indigo-900 hover:bg-slate-200 hover:text-black cursor-pointer">&times;</div>
        </header>
        <hr className="border-indigo-900"></hr>
        <div className="table-auto text-[#000814] m-2">
          {traders ? traders.map((trade) => <div>{trade}</div>) : ""}
        </div>
        <div></div>
      </div>
    </div>
  ) : null
}
