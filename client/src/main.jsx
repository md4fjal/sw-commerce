import ReactDOM from "react-dom/client";
import App from "./App";
import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

export const server = "https://stylehub-api.vercel.app/api/v1";
// export const server = "http://localhost:5000/api/v1";
