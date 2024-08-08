import React, {memo, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {UserContext} from "@/App.jsx";
import {Loader2} from "lucide-react";
import {useToast} from "@/components/ui/use-toast.js";

function Settings(props) {
    const [image, setImage] = useState("")
    const [image2, setImage2] = useState("")
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const {state, dispatch} = useContext(UserContext)
    const [name, setName] = useState(state?state.name:"")
    const {toast} = useToast()
    useEffect(() => {
        if (image) {
            setLoading(true)
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", 'Ijtimoiytarmoq')
            data.append("cloud_name", "dskh7ffuq")
            fetch("https://api.cloudinary.com/v1_1/dskh7ffuq/image/upload/", {
                method: "post",
                body: data,
            })
                .then(res => res.json())
                .then((data) => {
                    localStorage.setItem("user", JSON.stringify({...state, picture:data.url}))
                    dispatch({type:"UPDATEPICTURE", payload:data.url})
                    fetch("http://localhost:5000/updatepicture", {
                        method:"put",
                        headers:{
                            Authorization: "ghost " + localStorage.getItem("jwt"),
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            picture: data.url
                        })
                    })
                        .then(res=>res.json())
                        .then(data=> {
                            localStorage.setItem("user", JSON.stringify({...state, picture:data.picture}))
                            dispatch({type:"UPDATEPICTURE", payload:data.picture})
                            toast({
                                title: "Picture updated successfully",
                                variant: "success",
                            })
                            setLoading(false)

                        })
                })
                .catch(err => console.log(err))
        }
    }, [image])

    const updatePhoto = ()=>{
        setImage(image2)
    }

    const editName = () =>{
        if(name){
            setLoading2(true)
            fetch("http://localhost:5000/editname", {
                method:"put",
                headers:{
                    Authorization: "ghost " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name
                })
            })
                .then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    localStorage.setItem("user", JSON.stringify({...state, name:data.name}))
                    dispatch({type:"EDITNAME", payload:data.name})
                    toast({
                        title: "Name changed successfully",
                        variant: "success",
                    })
                    setLoading2(false)
                })


        }
    }

    return (
        <>
            <main
                className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                </div>
                <div
                    className="mx-auto grid w-full max-w-6xl items-start  ">
                    {/*<nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">*/}
                    {/*    <Link to="#" className="font-semibold text-primary">*/}
                    {/*        General*/}
                    {/*    </Link>*/}
                    {/*    <Link to="#">*/}
                    {/*        Security*/}
                    {/*    </Link>*/}
                    {/*    <Link to="#">*/}
                    {/*        Integrations*/}
                    {/*    </Link>*/}
                    {/*    <Link to="#">*/}
                    {/*        Support*/}
                    {/*    </Link>*/}
                    {/*    <Link to="#">*/}
                    {/*        Organizations*/}
                    {/*    </Link>*/}
                    {/*    <Link to="#">*/}
                    {/*        Advanced*/}
                    {/*    </Link>*/}
                    {/*</nav>*/}
                    <div className="grid ">
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Change Profile Avatar</CardTitle>
                                <CardDescription>
                                    <img src={state?state.picture:"Loading"} className={`rounded-full w-60 h-60 mx-auto`} alt=""/>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <Input type={"file"} onChange={e => setImage2(e.target.files[0])}/>
                                </form>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button onClick={updatePhoto}>
                                    {loading?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:""}
                                    Save
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card x-chunk="dashboard-04-chunk-2" className={`mt-5`}>
                            <CardHeader>
                                <CardTitle>Change User Name</CardTitle>
                                {/*<CardDescription></CardDescription>*/}
                            </CardHeader>
                            <CardContent>
                                <form className="flex flex-col gap-4">
                                    <label
                                        htmlFor="include"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Allow administrators to change the directory.
                                    </label>
                                    <Input placeholder="Name" defaultValue={state?state.name:""} value={name} onChange={e=>setName(e.target.value)} />
                                </form>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">

                                <Button onClick={editName}>
                                    {loading2?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:""}
                                    Save
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
}

export default memo(Settings);