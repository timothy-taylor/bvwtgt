import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./assets/Noto_Serif/NotoSerif-Regular.ttf";
import "./assets/Sen/Sen-Regular.ttf";
import "./index.css";
import App from "./App";

document.title = "tim taylor | writings | process | bvwtgt";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
