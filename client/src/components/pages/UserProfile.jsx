import React, {memo, useContext, useEffect, useState} from 'react';
import {UserContext} from "@/App.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {useNavigate, useParams} from "react-router-dom";

function UserProfile(props) {
    const [profile, setProfile] = useState()
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const [isFollow, setIsFollow] = useState(state ? !state.following.includes(userId) : true)

    useEffect(()=>{
        fetch(`https://snapshare-server.onrender.com/user/${userId}`,{
            headers:{
                Authorization: "ghost " + localStorage.getItem("jwt")
            }
        })
            .then(res=> res.json())
            .then(data=> {
                setProfile(data)
            })

    }, [userId])
    const followUser = ()=>{
        fetch("https://snapshare-server.onrender.com/follow", {
            method:"put",
            headers:{
                Authorization: "ghost " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                followId:userId
            })
        })
            .then(res=>res.json())
            .then(data=> {
                dispatch({type:"UPDATE", payload:{following:data.following, followers: data.followers}})
                    localStorage.setItem("user", JSON.stringify(data))
                setProfile(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setIsFollow(false)

            })
    }

    const unfollowUser = ()=>{
        fetch("https://snapshare-server.onrender.com/unfollow", {
            method:"put",
            headers:{
                Authorization: "ghost " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                followId:userId
            })
        })
            .then(res=>res.json())
            .then(data=> {
                dispatch({type:"UPDATE", payload:{following:data.following, followers: data.followers}})
                localStorage.setItem("user", JSON.stringify(data))
                setProfile(prevState => {
                    const newFollower = prevState.user.followers.filter(id=> id !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setIsFollow(true)
            })
    }
    return (
        <>
            { profile ?
            <div className="profile-page p-6 min-w-[10%]">
                <div className="profile-header pb-5 flex lg:flex-row  justify-evenly items-center flex-col">
                    <div className="profile-avatar">
                        <Avatar className={`w-52 h-52 shadow-2xl`}>
                            <AvatarImage src={profile.user.picture} alt="@shadcn" />
                            <AvatarFallback>Profile Picture</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="profile-details ">
                        <h2>{profile.user.name} </h2>
                        <p className="profile-bio">This is the bio of the user. It's a short description about the
                            user.</p>
                        <div className="profile-stats">
                            <div><strong>{profile.posts.length}</strong> Posts</div>
                            <div><strong>{profile.user.followers.length}</strong> Followers</div>
                            <div><strong>{profile.user.following.length}</strong> Following</div>
                        </div>
                        {
                            isFollow
                            ?
                                <Button onClick={followUser}>Follow</Button>
                                :
                                <Button onClick={unfollowUser}>UnFollow</Button>

                        }
                    </div>
                </div>
                <Separator className={`my-5 h-0.5`} />

                <div className="lg:grid lg:grid-cols-3 flex flex-col gap-6 mx-auto justify-center items-center ">
                    {
                        profile.posts.map(post=>{
                            return <img src={post.photo}  className={"w-[600px] h-[400px] sm:mb-2 object-cover float-left"} alt="Post Image" key={post._id}/>
                        }).reverse()
                    }

                </div>
            </div>
            :
                <div className={`grid mt-[10%] items-center justify-center m-auto`}>
                    <Loader2 className="mr-2 h-28 w-28 animate-spin" />
                </div>
            }
        </>
    );
}

export default memo(UserProfile);
