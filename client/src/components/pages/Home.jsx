import React, {memo, useContext, useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button.jsx";
import {cn} from "@/lib/utils"
import {BellRing, Heart, HeartIcon, MessageCircleIcon, Star, Trash} from "lucide-react";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {UserContext} from "@/App.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {toast} from "@/components/ui/use-toast.js";
import {Link} from "react-router-dom";

const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [comment, setComment] = useState("")
    const [showComments, setShowComments] = useState(false)
    useEffect(() => {
        fetch("http://localhost:5000/allposts", {
            headers: {
                Authorization: "ghost " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(data => setData(data.posts))
        // console.log(data)
    }, [])
    const likePosts = id => {
        fetch('http://localhost:5000/like', {
            method: 'put',
            headers: {
                Authorization: "ghost " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({postId: id})
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }
    const unLikePosts = id => {
        fetch('http://localhost:5000/unlike', {
            method: 'put',
            headers: {
                Authorization: "ghost " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({postId: id})
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }
    const commentPost = (text, postId) => {
        fetch("http://localhost:5000/comments", {
            method: 'put',
            headers: {
                Authorization: "ghost " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                postId
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
                setComment("")
            })
            .catch(err => console.log(err))
    }
    const deletePost = (postID) => {
        fetch(`http://localhost:5000/deletepost/${postID}`, {
            method: 'delete',
            headers: {
                Authorization: "ghost " + localStorage.getItem("jwt"),
            }
        })
            .then(res => res.json())
            .then(result => {
                // console.log(data)
                toast({
                    title: "Post Successfully deleted",
                    variant: "success",
                })
                const newData = data.filter(el=> el._id !== result._id)
                setData(newData)
            })
            .catch(err => console.log(err))

    }

    return (
        <div className={`flex flex-col items-center justify-center pt-5  `}>
            {
                data.length ?
                    data.map(el => {

                        return <Card key={el._id} className={cn("lg:w-1/2 mb-6")}>
                            <CardHeader className={`pb-0 mb-2`}>

                                <Link to={el.postedBy._id!==state._id?"/profile/"+el.postedBy._id:"/profile"} className="font-medium">
                                    <div className="mb-2 flex items-center space-x-3">
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarImage src={el.postedBy.picture} />
                                        <AvatarFallback>AC</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1>{el.postedBy.name}</h1>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{el.createdAt.slice(0,10)}</div>
                                    </div>
                                    </div>
                                </Link>
                                <img className={`rounded w-[900px] h-[500px]`} src={el.photo} alt={el._id}/>
                                <div className="flex  justify-between pb-0">
                                    <div className="">
                                        <Button variant="ghost" size="icon" className={`cursor-pointer`}
                                                onClick={() => setShowComments(!showComments)}>
                                            <MessageCircleIcon
                                                className={`w-7 h-7 ${showComments ? "fill-black dark:fill-white" : ""}`}/>
                                            <span className="sr-only">Comments</span>
                                        </Button>
                                        {el.likes.includes(state._id)
                                            ?
                                            <Button variant="ghost" size="icon" className={`cursor-pointer`}>
                                                <HeartIcon onClick={() => unLikePosts(el._id)}
                                                           className={`fill-black dark:fill-white cursor-pointer w-7 h-7 `}/>
                                            </Button>
                                            :
                                            <Button variant={`ghost`} size={"icon"} className={`cursor-pointer`}>
                                                <HeartIcon onClick={() => likePosts(el._id)}
                                                           className={` cursor-pointer w-7 h-7 `}/>
                                            </Button>

                                        }
                                    </div>
                                    {
                                        el.postedBy._id === state._id &&
                                        <Button variant="ghost" size="icon" onClick={() => deletePost(el._id)} className={`cursor-pointer`}>
                                            <Trash/>
                                        </Button>
                                    }

                                </div>
                                <p>
                                    {el.likes.length === 1 ? <p>{el.likes.length} like</p> :
                                        <p>{el.likes.length} likes</p>}
                                </p>
                            </CardHeader>
                            <CardContent className="flex-col justify-between items-center pt-0 ">
                                <div>
                                    <CardTitle className={`mb-2`}>{el.title}</CardTitle>
                                    <CardDescription className={`w-[100%]`}>{el.body}</CardDescription>

                                </div>
                                {showComments &&
                                    <ScrollArea className="h-36 w-[100%] my-3 p-3 rounded-md border">
                                        <div className="mt-4 space-y-3">
                                            {
                                                el.comments.length
                                                    ?
                                                    el.comments.map(comment => {
                                                        console.log(comment.postedBy)
                                                        return <div key={comment._id}
                                                                    className="flex items-start space-x-3">
                                                            <Avatar className="w-8 h-8 border">
                                                                <AvatarImage src={comment.postedBy.picture} />
                                                                {/*<AvatarFallback>AC</AvatarFallback>*/}
                                                            </Avatar>
                                                            <div>
                                                                <div
                                                                    className="font-medium">{comment.postedBy.name}</div>
                                                                <div
                                                                    className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {comment.text}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    })
                                                    :
                                                    <p>No Comments Yet</p>
                                            }


                                            {/*<div className="flex items-start space-x-3">*/}
                                            {/*    <Avatar className="w-8 h-8 border">*/}
                                            {/*        <AvatarImage src="/placeholder-user.jpg" />*/}
                                            {/*        <AvatarFallback>AC</AvatarFallback>*/}
                                            {/*    </Avatar>*/}
                                            {/*    <div>*/}
                                            {/*        <div className="font-medium">Acme Inc</div>*/}
                                            {/*        <div className="text-sm text-gray-500 dark:text-gray-400">This post just made my day! 😃👍</div>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    </ScrollArea>
                                }
                                {!showComments && <h2>Comments: {el.comments.length}</h2>}
                            </CardContent>

                            <CardFooter >

                                <form className="w-full">
                                    <div className="grid w-full items-center ">
                                        <div className="flex gap-2 items-center">
                                            {/*<Label htmlFor="name">Add a comment</Label>*/}
                                            <Input id="name" value={comment} onChange={e => setComment(e.target.value)}
                                                   placeholder="Add a comment..." required/>
                                            {comment.length
                                                ?
                                                <Button className={`disabled`} type="submit" onClick={(e) => {
                                                    e.preventDefault()
                                                    commentPost(comment, el._id)
                                                }}>Comment</Button>
                                                :
                                                <Button disabled className={`disabled`} type="submit" onClick={(e) => {
                                                    e.preventDefault()
                                                    commentPost(comment, el._id)
                                                }}>Comment</Button>
                                            }

                                        </div>
                                    </div>
                                </form>
                            </CardFooter>
                        </Card>
                    }).reverse()
                    :
                    <div className="flex flex-col gap-4 items-center justify-center pt-5 ">
                        <Skeleton className="h-[500px] w-[900px] rounded-xl"/>
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-[900px]"/>
                            <Skeleton className="h-7 w-[900px]"/>
                        </div>
                    </div>
            }
        </div>
    );
};

export default memo(Home);