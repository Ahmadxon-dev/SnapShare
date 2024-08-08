import React, {memo, useEffect, useRef, useState} from 'react';
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {useToast} from "@/components/ui/use-toast.js";
import {useNavigate} from "react-router-dom";
import {Loader2} from "lucide-react";
const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState("")
    const {toast} = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const form = useForm()


    const postDetails = () =>{
        setLoading(true)
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
        if (url){
            fetch("http://localhost:5000/createpost", {
                method:'post',
                headers:{
                    "Content-type":"application/json",
                    "Authorization": "ghost " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title, body, picture:url
                })
            })
                .then(res=>res.json())
                .then(data=>{
                    if (data.error){
                        toast({
                            title: data.error,
                            variant: "destructive",
                        })
                    }else{

                        toast({
                            title: "created successfully",
                            variant: "success",
                        })
                        setLoading(false)
                        navigate("/")

                    }


                })
        }
    }, [url])

    const onsubmit = ()=>{
        console.log("submit")
    }

    return (
        <div className={` flex items-center justify-center pt-5  `}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8 lg:w-1/2 w-[90%]">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input value={title} onChange={e=>setTitle(e.target.value)} type={"text"} placeholder="Title of post..."  required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea value={body} onChange={e=>setBody(e.target.value)} className={`resize-none`} placeholder="Description of post" required />
                                </FormControl>

                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photo</FormLabel>
                                <FormControl>
                                    <Input type={"file"}  onChange={(e) => setImage(e.target.files[0])}  required/>
                                </FormControl>
                                {/*<FormDescription>*/}
                                {/*    This is your public display name.*/}
                                {/*</FormDescription>*/}
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <Button
                        onClick={postDetails}
                        className={`w-full `} type="submit">
                        {loading?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:""}
                        Submit</Button>

                </form>
            </Form>
        </div>
    );
};

export default memo(CreatePost);