import React, { useState } from "react";
import { useHistory ,useParams} from "react-router-dom";
import M from "materialize-css";

const Signin = () => {
 
  const [password, setPassword] = useState("");
  const history = useHistory();
const {token} = useParams();
console.log(token)
  const PostData = () => {
 

    fetch("/new-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
        
          M.toast({
            html: data.message,
            classes: "#43a047 green darken-1",
          });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
     
        <input
          type="password"
          placeholder="enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={PostData}
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
        >
         Update Password
        </button>
      </div>
    </div>
  );
};
export default Signin;
