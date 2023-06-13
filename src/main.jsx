import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import DictionaryProvider from "./hooks/useDictionary.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DictionaryProvider>
      <App />
    </DictionaryProvider>
  </React.StrictMode>
);
