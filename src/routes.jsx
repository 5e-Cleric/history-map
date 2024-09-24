import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from '@pages/home/Home';
import Create from "@pages/create/create";
import All from "@pages/all";
import Edit from "@pages/editMap/editMap";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create/>}/>
        <Route path="/all" element={<All />}/>
        <Route path="/map/:id" element={<Edit />}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
