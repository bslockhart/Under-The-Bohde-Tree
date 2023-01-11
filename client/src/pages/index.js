import * as React from "react";
import logo from "../images/bohde_logo.png";

const Index = () => {
  return (
    <main className="w-full h-full flex justify-center flex-col">

      <h2 className="pb-8 text-5xl text-center font-medium drop-shadow">Under The Bohde Tree</h2>
      <img src={logo}></img>
    </main>
  );
};

export default Index;