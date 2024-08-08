import React, {memo, useContext, useEffect, useState} from 'react';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Link, useNavigate, useNavigation} from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {useToast} from "@/components/ui/use-toast.js";
import {ToastAction} from "@/components/ui/toast.jsx";
import {UserContext} from "@/App.jsx";

const SignIn = () => {
    const {state, dispatch} = useContext(UserContext)
    const [regName, setRegName] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [logEmail, setLogEmail] = useState("")
    const [logPassword, setLogPassword] = useState("")
    const [activeTab, setActiveTab] = useState("signin")
    const [image, setImage] = useState(undefined)
    const [url, setUrl] = useState("https://res.cloudinary.com/dskh7ffuq/image/upload/v1719074508/3c73ee8caf56fcc08bd11d595dca167d_ssbwvg.jpg")
    const [preview, setPreview] = useState("https://res.cloudinary.com/dskh7ffuq/image/upload/v1719074508/3c73ee8caf56fcc08bd11d595dca167d_ssbwvg.jpg")
    const { toast } = useToast()
    const navigate = useNavigate()

    const handleImageChange = e=>{
        setImage(e.target.files[0])
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
    const signUpFields= ()=>{
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(regEmail)){
            toast({
                variant: "destructive",
                title:"Email syntax is wrong"
            })
            return
        }
        fetch("https://snapshare-server.onrender.com/signup", {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name:regName,
                email:regEmail,
                password:regPassword,
                picture:url
            })
        }).then(res=>res.json()).then(data=>{
            if (data.error){
                toast({
                    variant: "destructive",
                    title: data.error,

                })
            }else{

                toast({
                    title: data.msg,
                    variant: "success",
                    // description: "Friday, February 10, 2023 at 5:57 PM",

                })
                setActiveTab("signin")
                setRegName("")
                setRegPassword("")
                setRegEmail("")
            }
        })
    }
    const signData = ()=>{
        if (image){
            uploadPicture()
        }else{
            signUpFields()
        }
    }
    const logData = ()=>{
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(logEmail)){
            toast({
                variant: "destructive",
                title:"Email syntax is wrong"
            })
            return
        }

        fetch("https://snapshare-server.onrender.com/signin", {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email:logEmail,
                password:logPassword
            })
        }).then(res=>res.json()).then(data=>{
            if (data.error){
                toast({
                    variant: "destructive",
                    title: data.error,
                    // description: "Friday, February 10, 2023 at 5:57 PM",

                })
            }else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                toast({
                    title: data.msg,
                    variant: "success",
                    description: data.user.name,

                })
                navigate("/")
                setActiveTab("signin")
                setLogPassword("")
                setLogEmail("")

            }
        })
    }

    const uploadPicture = ()=>{
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", 'Ijtimoiytarmoq')
        data.append("cloud_name", "dskh7ffuq")
        fetch("https://api.cloudinary.com/v1_1/dskh7ffuq/image/upload/", {
            method:"post",
            body:data,
        })
            .then(res=>res.json())
            .then((data)=>setUrl(data.url))
            .catch(err=>console.log(err))
    }

    useEffect(()=>{
        if(url){
            signUpFields()
        }
    }, [url])

    return (
        <>
            <div className={`flex items-center justify-center pt-5  `}>

                <Tabs defaultValue={"signin"} value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-[500px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Log In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <Card className="mx-auto xl:min-w-[500px] lg:min-w-[500px] max-w-sm shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Login</CardTitle>
                                <CardDescription>Enter your email below to login to your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input value={logEmail} onChange={e=>setLogEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input value={logPassword} onChange={e=>setLogPassword(e.target.value)} id="password" type="password" required/>
                                </div>

                            </CardContent>
                            <CardFooter>
                                <Button onClick={logData} className="w-full">Sign in</Button>
                            </CardFooter>
                            <CardContent>

                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card className="mx-auto max-w-sm xl:min-w-[500px] lg:min-w-[500px] mt-5 shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Sign Up</CardTitle>
                                <CardDescription>Enter your information to create an account</CardDescription>
                                {/*https://res.cloudinary.com/dsk/h7ffuq/image/upload/v1719074508/3c73ee8caf56fcc08bd11d595dca167d_ssbwvg.jpg*/}
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="grid gap-2 w-1/4 mx-auto">
                                        <img  className={`rounded-full w-20 h-20`} src={preview} alt="x"/>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="picture">Change your profile photo if you want  </Label>
                                        <Input type={"file"}  className={`dark:text-white`} id={"picture"}  onChange={(e) => handleImageChange(e)}   />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="first-name">Name</Label>
                                        <Input id="first-name" placeholder="Max" value={regName} onChange={e=>setRegName(e.target.value)} required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="m@example.com" value={regEmail} onChange={e=>setRegEmail(e.target.value)} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={regPassword} onChange={e=>setRegPassword(e.target.value)}/>
                                    </div>
                                    <Button onClick={ signData} type="submit" className="w-full">
                                        Create an account
                                    </Button>
                                    <Button  variant="outline" className="w-full">
                                        Sign up with Google(*Not working yet)
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default memo(SignIn);
