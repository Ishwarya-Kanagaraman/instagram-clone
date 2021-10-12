import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  console.log("states is ",state)
  useEffect(() => {
    fetch("/allpost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result is",result);
        setData(result.posts);
      });
    console.log(data);
  }, []);
  const likePost = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //  console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //  console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div
            className="card home-card"
            style={{ position: "relative" }}
            key={item._id}
          >
            <h5 style={{ padding: "6px" }}>
              <span>
                <img
                  alt=""
                  src={item.postedBy.pic}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginTop: "5px",
                    marginLeft: "4px",
                    borderRadius: "80px",
                  }}
                />
              </span>
              <Link
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "46px",
                }}
                to={
                  item.postedBy._id !== state._id
                    ? `/profile/${item.postedBy._id}`
                    : "/profile"
                }
              >
                {item.postedBy.name}
              </Link>
              {item.postedBy._id === state._id && (
                <>
                <i
                  className="material-icons"
                  onClick={() => deletePost(item._id)}
                  style={{ float: "right", color: "red" }}
                >
                  delete
                </i>
                
               </>
              )}
            </h5>

            <div className="card-image">
              <img src={item.photo} alt="" />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => unLikePost(item._id)}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likePost(item._id)}
                >
                  thumb_up
                </i>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id} style={{position:"relative"}}>
                    <span>
                      <img
                        alt=""
                        src={record.postedBy.pic}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginTop: "5px",
                          marginLeft: "4px",
                          borderRadius: "80px",
                        }}
                      />
                    </span>
                    <span style={{ fontWeight: "500",position:"absolute",top:"8px",left:"40px" }}>
                      {record.postedBy.name}  {"   "}  <small>{record.text}</small>
                    </span>
                 
                    
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Home;
