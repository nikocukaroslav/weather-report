import { useEffect, useState } from "react";

export function ChooseTheme() {
  const [open, setOpen] = useState(false);

  function changeTheme(theme) {
    const root = document.documentElement;

    if (theme === "purple") {
      root.style.setProperty("--main-color", "#7048e8");
      root.style.setProperty("--second-color", "#6741d9");
      root.style.setProperty("--third-color", "#d0bfff");
      root.style.setProperty("--text-color", "#e5dbff");
      root.style.setProperty("--gradient-body-1", "#9775fa");
      root.style.setProperty("--gradient-body-2", "#b197fc");
      root.style.setProperty("--gradient-box-1", "#5f3dc4");
      root.style.setProperty("--gradient-box-2", "#7048e8");
    } else if (theme === "blue") {
      root.style.setProperty("--main-color", "#1c7ed6");
      root.style.setProperty("--second-color", "#1864ab");
      root.style.setProperty("--third-color", "#a5d8ff");
      root.style.setProperty("--text-color", "#e7f5ff");
      root.style.setProperty("--gradient-body-1", "#339af0");
      root.style.setProperty("--gradient-body-2", "#74c0fc");
      root.style.setProperty("--gradient-box-1", "#1864ab");
      root.style.setProperty("--gradient-box-2", "#1c7ed6");
    } else if (theme === "gray") {
      root.style.setProperty("--main-color", "#686f76");
      root.style.setProperty("--second-color", "#4b535c");
      root.style.setProperty("--third-color", "#ced4da");
      root.style.setProperty("--text-color", "#f8f9fa");
      root.style.setProperty("--gradient-body-1", "#868e96");
      root.style.setProperty("--gradient-body-2", "#adb5bd");
      root.style.setProperty("--gradient-box-1", "#4b535c");
      root.style.setProperty("--gradient-box-2", "#686f76");
    }
    if (theme === "gray") {
      root.style.setProperty("--main-filter", "grayscale(100%)");
    } else {
      root.style.setProperty("--main-filter", "blur(5px)");
    }
    localStorage.setItem("theme", theme);
  }

  useEffect(function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      changeTheme(savedTheme);
    }
  }, []);

  return (
    <div className="color-theme" onClick={() => setOpen(!open)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="theme-icon"
        viewBox="0 0 16 16"
      >
        <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
        <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7" />
      </svg>
      <ul className={`color-circles dropdown-menu ${open ? "open" : ""}`}>
        <li>
          <button
            className="purple-theme color-circle margin-top"
            onClick={() => changeTheme("purple")}
          ></button>
        </li>
        <li>
          <button
            className="blue-theme color-circle"
            onClick={() => changeTheme("blue")}
          ></button>
        </li>
        <li>
          <button
            className="gray-theme color-circle"
            onClick={() => changeTheme("gray")}
          ></button>
        </li>
      </ul>
    </div>
  );
}
