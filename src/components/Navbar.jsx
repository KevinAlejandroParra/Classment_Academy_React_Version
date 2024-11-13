import React, { Component } from 'react';

function Navbar() {
    return (
    <>
    <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js" />
    <div className="navbar bg-transparent py-4 backdrop-blur-md bg-opacity-50 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a>Homepage</a></li>
            <li><a>Portfolio</a></li>
            <li><a>About</a></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <img src="../public/images/logo.png" alt="" className="w-10 h-10" />
        <a className="btn btn-ghost text-xl">Classment Academy</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
         
        </button>
        <button data-toggle-theme="dark,light" data-act-class="ACTIVECLASS"></button>
      </div>
    </div>
    </>
    );
}
export default Navbar;

