import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from '@pages/home/Home';
import Create from "@pages/create/Create";
import All from "@pages/All";
import Edit from "@pages/editMap/EditMap";

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
