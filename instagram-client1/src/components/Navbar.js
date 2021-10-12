import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const Navbar = () => {
  const [search, setSearch] = useState("");
  const [userDetails,setUserDetails]=useState([]);
  const searchModal = useRef(null);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My Following Post</Link>
        </li>,
        <li key="5">
          <button
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
            className="btn waves-effect  #c62828 red darken-3"
          >
            LogOut
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers=(query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({query})
    }).then(res=>res.json())
    .then(result=>{
      setUserDetails(result.user)
    })
  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        
        <ul id="nav-mobile" className="right ">
          {renderList()};
        </ul>
      </div>
      <div id="modal1" ref={searchModal} className="modal">
        <div style={{ color: "black" }} className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map(item=>(
              <Link 
              onClick={()=>{
                M.Modal.getInstance(searchModal.current).close()
                setSearch(" ")
              }}
               to={item._id!==state._id ?"/profile/"+item._id:'/profile'}>
                  <li className="collection-item">{item.email}</li>
                  
              </Link>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <button onClick={()=>setSearch('')}className="modal-close waves-effect waves-green btn-flat">
            close
          </button>
        </div>
      </div>
     
    </nav>
  );
};
export default Navbar;
