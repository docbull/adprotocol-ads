import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./ads/Main";
import Coupang from "./ads/Coupang";
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
          element={<Main />}
        />

        {/* 쿠팡 */}
        <Route
          path="/coupang"
          element={<Coupang />}
        />
        <Route
          path="/1001"
          exact={true}
          element={<Coupang category={1001}/>}
        />
        <Route
          path="/1002"
          exact={true}
          element={<Coupang category={1002}/>}
        />
        <Route
          path="/1010"
          exact={true}
          element={<Coupang category={1010}/>}
        />
        <Route
          path="/1011"
          exact={true}
          element={<Coupang category={1011}/>}
        />
        <Route
          path="/1012"
          exact={true}
          element={<Coupang category={1012}/>}
        />
        <Route
          path="/1013"
          exact={true}
          element={<Coupang category={1013}/>}
        />
        <Route
          path="/1014"
          exact={true}
          element={<Coupang category={1014}/>}
        />
        <Route
          path="/1015"
          exact={true}
          element={<Coupang category={1015}/>}
        />
        <Route
          path="/1016"
          exact={true}
          element={<Coupang category={1016}/>}
        />
        <Route
          path="/1017"
          exact={true}
          element={<Coupang category={1017}/>}
        />
        <Route
          path="/1018"
          exact={true}
          element={<Coupang category={1018}/>}
        />
        <Route
          path="/1019"
          exact={true}
          element={<Coupang category={1019}/>}
        />
        <Route
          path="/1020"
          exact={true}
          element={<Coupang category={1020}/>}
        />
        <Route
          path="/1021"
          exact={true}
          element={<Coupang category={1021}/>}
        />
        <Route
          path="/1024"
          exact={true}
          element={<Coupang category={1024}/>}
        />
        <Route
          path="/1025"
          exact={true}
          element={<Coupang category={1025}/>}
        />
        <Route
          path="/1026"
          exact={true}
          element={<Coupang category={1026}/>}
        />
        <Route
          path="/1029"
          exact={true}
          element={<Coupang category={1029}/>}
        />
        <Route
          path="/1030"
          exact={true}
          element={<Coupang category={1030}/>}
        />

        {/* 광고주 광고 */}
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
