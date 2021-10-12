
import React, { useEffect, createContext ,useReducer,useContext} from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch ,useHistory} from "react-router-dom";
import Home from "./components/screen/Home";
import Signin from "./components/screen/Signin";
import Signup from "./components/screen/Signup";
import Profile from "./components/screen/Profile";
import CreatePost from "./components/screen/CreatePost";
import {reducer,initialState} from "./reducers/userReducer";
import UserProfile from "./components/screen/UserProfile"
import SubscribedPost from "./components/screen/SubscribedUserPost"
import Reset from "./components/screen/ResetPassword";
import NewPassword  from  "./components/screen/NewPassword"
export const UserContext = createContext();

const Routing = () => {
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);

  useEffect(()=>{ 
    const user=JSON.parse(localStorage.getItem("user"));
if(user){
  dispatch({type:"USER",payload:user})
  // history.push('/')
}else{
  if(!history.location.pathname.startsWith("/reset"))
  history.push('/signin');
}  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedPost />
      </Route>
      <Route exact  path="/reset-password">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state,dispatch]=useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <Router>
      <Navbar />
      <Routing/>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
