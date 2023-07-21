import React, { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Appstate } from "../App";

const Header = () => {
  const useAppstate = useContext(Appstate);
  return (
    <div className="flex justify-between items-center border-b-2 border-solid border-[#00fffc] sticky top-0 z-10 header ">
      <Link to="/">
        {" "}
        <img src="../images/logo1.png" alt="logo" />
      </Link>

      {useAppstate.login ? 
        <Link to={"/addmovie"}>
          <h1 className="text-lg flex items-center cursor-pointer  ">
            <Button variant="outlined">
              
              <AddIcon className="text-[#00fffc]" />
              <span className="text-[#00fffc] capitalize ">Add</span>
            </Button>
          </h1>
        </Link>
       : 
        <Link to={"/login"}>
          <h1 className="mr-6 flex items-center cursor-pointer ">
            <Button variant="outlined">
              <span className="text-[#00fffc] font-bold text-base capitalize">
                Login
              </span>
            </Button>
          </h1>
        </Link>
      }
    </div>
  );
};

export default Header;
