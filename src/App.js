import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Ad1 from "./ads/Ad1";
import Ad2 from "./ads/Ad2";
import Ad3 from "./ads/Ad3";
import Ad4 from "./ads/Ad4";
import Ad5 from "./ads/Ad5";
import Ad6 from "./ads/Ad6";
import Ad7 from "./ads/Ad7";
import Ad8 from "./ads/Ad8";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact={true}
          element={<></>}
        />
        <Route
          path="/ad1"
          exact={true}
          element={<Ad1 />}
        />
        <Route
          path="/ad2"
          exact={true}
          element={<Ad2 />}
        />
        <Route
          path="/ad3"
          exact={true}
          element={<Ad3 />}
        />
        <Route
          path="/ad4"
          exact={true}
          element={<Ad4 />}
        />
        <Route
          path="/ad5"
          exact={true}
          element={<Ad5 />}
        />
        <Route
          path="/ad6"
          exact={true}
          element={<Ad6 />}
        />
        <Route
          path="/ad7"
          exact={true}
          element={<Ad7 />}
        />
        <Route
          path="/ad8"
          exact={true}
          element={<Ad8 />}
        />
      </Routes>
    </Router>
  );
}

export default App;
