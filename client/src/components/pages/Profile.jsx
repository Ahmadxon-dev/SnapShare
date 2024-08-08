import React, {memo, useContext, useEffect, useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {CircleUserIcon, Image, Loader2, User, UserIcon} from "lucide-react";
import {UserContext} from "@/App.jsx";
import {Link} from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch("https://snapshare-server.onrender.com/myposts", {
            headers: {
                Authorization: "ghost " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(data => setProfile(data))

    }, [])
    return (
        <>
            <div className="profile-page p-6 min-w-[10%]">
                <div className="profile-header pb-5 flex lg:flex-row  justify-evenly items-center flex-col">
                    <div className="profile-avatar">
                        <Avatar className={`w-52 h-52 shadow-2xl`}>
                            <AvatarImage
                                src={state?state.picture:<Loader2 className="mr-2 h-28 w-28 animate-spin" />
                                }
                                alt="@shadcn"/>
                            <AvatarFallback>Profile Picture</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="profile-details ">
                        <h2>{state ? state.name : <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}</h2>
                        <p className="profile-bio">This is the bio of the user. It's a short description about the
                            user.</p>
                        <div className="profile-stats">
                            <div><strong>{profile.length}</strong> Posts</div>
                            <div><strong>{state ? state.followers.length : "0"}</strong> Followers</div>
                            <div><strong>{state ? state.following.length : "0"}</strong> Following</div>
                        </div>
                        <Button><Link to={`settings`}>Edit Profile</Link></Button>
                    </div>
                </div>
                <Separator className={`my-5 h-0.5`}/>

                <div className="lg:grid lg:grid-cols-3 flex flex-col gap-6 mx-auto justify-center items-center ">
                    {
                        profile.length ?
                            profile.map(post => {
                                return <img src={post.photo}
                                            className={"w-[600px] h-[400px] sm:mb-2 object-cover float-left"}
                                            alt="Post Image" key={post._id}/>
                            }).reverse()
                            :
                            <div className={`flex mt-[10%] w-screen items-center justify-center mx-auto`}>
                                <h1 className={`text-3xl`}>No Photo</h1>
                            </div>
                    }

                </div>
            </div>


        </>
    );
};

export default memo(Profile);
