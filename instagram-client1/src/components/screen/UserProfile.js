import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const { userid } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [showfollow, setShowFollow] = useState(state? !state.following.includes(userid):true);

  // console.log(userid);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setProfile(result);
      });
  }, []);
    const followUser = () => {
      fetch("/follow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          followId: userid,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
          localStorage.setItem("user",JSON.stringify(data))
          setProfile((prevState)=>{
               return{
                   ...prevState,
                   user:{...prevState.user,
              followers:[...prevState.user.followers,data._id]}
               }
          })
          setShowFollow(false)
        });
    };
    const unfollowUser = () => {
      fetch("/unfollow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          unfollowId: userid,
        })
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
          localStorage.setItem("user",JSON.stringify(data))

          setProfile((prevState)=>{
              const newFollower = prevState.user.followers.filter(item=>item!==data._id)
              console.log("new Follower" ,newFollower);
               return{
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:newFollower
                 }
               }
          })
            setShowFollow(true)
        });
    };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                alt="Girl"
                src={userProfile.user.pic}
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.post.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {showfollow ? (
                <button
                style={{margin:"10px"}}
                  onClick={() => followUser()}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                >
                  Follow
                </button>
              ) : (
                <button
                style={{margin:"10px"}}
                  onClick={() => unfollowUser()}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.post.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading...!</h2>
      )}
    </>
  );
};

export default UserProfile;
