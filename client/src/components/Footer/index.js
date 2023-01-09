import React from 'react'

const Footer = () => {
  return (
    <footer class="py-8 text-center">
      <p class="md:text-base text-sm tracking-wider font-medium text-gray-400">
        &copy; {new Date().getFullYear()} <a href="https://bslockhart/Under-The-Bohde-Tree">Group Three</a>, Under The Bohde Tree.
      </p>
    </footer>
  );
};

export default Footer;