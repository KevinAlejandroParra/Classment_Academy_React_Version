import {useEffect, useState} from "react";


function CustomNavbar() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  }, [theme]);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  
  return (
<>
<div className="navbar bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-md sticky top-0 z-10">
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
  <img className= "size-10" src="../public/images/logo.png"></img>
  <h1 className="font-bold pl-4 dark:text-white text-black">Classment Academy</h1>

  </div>
  <div className="navbar-end flex space-x-8">
  <button className="btn btn-ghost dark:text-white text-black">Unirme
    </button>
    <button className="btn btn-ghost  dark:text-white text-black"
              onClick={handleChangeTheme}>
      Cambiar tema
    </button>
  </div>
</div>
</>
  );
}

export default CustomNavbar;

