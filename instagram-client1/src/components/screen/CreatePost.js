import React, { useState,useEffect} from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
const CreatePost = () => {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [image, setImage] = useState();
  const [url,setUrl]=useState();
  const history=useHistory();
  useEffect(()=>{
        if(url){
          fetch("/createpost", {
            method: "POST",
            headers: {
              "Authorization":"Bearer "+localStorage.getItem("jwt"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              body,
              pic:url
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.error) {
                M.toast({ html: data.error,classes:"#c62828 red darken-3" });
              } else {
                M.toast({ html: "created post successfully!" ,classes:"#43a047 green darken-1"});
                history.push("/");
              }
            }).catch(err=>{
              console.log(err) ;
            })
        }
  },[url])
  const postDetails=()=>{
    // to send a file through the post request, we are using the this formData method
    const data=new FormData();
    data.append("file",image);
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","dcwjm82bj")
    fetch("https://api.cloudinary.com/v1_1/dcwjm82bj/image/upload",{
      method:"POST",
      body:data
    })
    .then(res=>res.json())
    .then(data=>{
     setUrl(data.url);
    })
    .catch(err=>{
      console.log(err);
    })
   
  }
  return (
    <div
      className="card input-field"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        value={title}
        placeholder="title"
      />
      <input
        onChange={(e) => setBody(e.target.value)}
        value={body}
        type="text"
        placeholder="body"
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button 
      onClick={postDetails}
      className="btn waves-effect waves-light #64b5f6 blue darken-1">
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
