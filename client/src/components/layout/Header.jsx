import React, {memo, useContext, useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link, useLocation, useParams} from "react-router-dom";
import logo2 from "@/assets/logo2.png"
import {Badge} from "@/components/ui/badge.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {CircleUserIcon, Copy, Home, LogIn, LogOut, MenuIcon, SearchIcon, User, XIcon} from "lucide-react";
import ModeToggle from "@/components/layout/ModeToggle.jsx";
import {UserContext} from "@/App.jsx";
import {DialogFooter, DialogHeader} from "@/components/ui/dialog.jsx";
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@radix-ui/react-dialog";
import {Label} from "@radix-ui/react-label";

const Header = memo(() => {
    const {state, dispatch} = useContext(UserContext)
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState("")
    const [userSearchFound, setUserSearchFound] = useState([])
    const {pathname} = useLocation()
    const renderNav = () => {
        if (state) {
            return (
                <>

                    <Link to="/profile"
                          className={`${pathname === "/profile" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>

                        Profile
                    </Link>
                    <Link to="/createpost"
                          className={`${pathname === "/createpost" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                        CreatePost
                    </Link>
                </>
            )
        } else {
            return (
                <Link to="/signin" className="text-muted-foreground transition-colors hover:text-foreground">
                    Log In
                </Link>
            )
        }
    }
    const renderNavMobile = () => {
        if (state) {
            return (
                <>
                    <Link to="/profile" className="text-muted-foreground hover:text-foreground">
                        Profile
                    </Link>
                    <Link to="/createpost" className="hover:text-foreground">
                        Create Post
                    </Link>
                </>
            )
        } else {
            return (
                <>
                    <Link to="/signin" className="text-muted-foreground hover:text-foreground">
                        Log In
                    </Link>
                </>
            )
        }
    }

    const searchUser = query => {
        setSearch(query)
        fetch("https://snapshare-server.onrender.com/searchuser", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query})
        })
            .then(res => res.json())
            .then(data => setUserSearchFound(data.user))
    }
    return (
        <>

            <div className="flex w-full flex-col">
                <header
                    className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <nav
                        className="hidden flex-col w-full text-lg font-medium lg:flex md:flex-row md:items-center md:gap-5 md:text-base lg:gap-6 lg:w-full ">
                        <Link to={state ? "/" : "/signin"}
                              className="flex items-center gap-2 text-lg font-semibold md:text-base">
                            <img src={logo2} alt="logo" className={`h-12 w-[100%]`}/>
                        </Link>
                        {/*<Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">*/}
                        {/*    Dashboard*/}
                        {/*</Link>*/}
                        {renderNav()}

                    </nav>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                                <MenuIcon className="h-5 w-5"/>
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link to={state ? "/" : "/signin"}
                                      className="flex items-center gap-2 text-lg font-semibold">
                                    <img src={logo2} alt="logo" className={`h-12 w-[12rem]`}/>
                                </Link>
                                {/*<Link to="/" className="text-muted-foreground hover:text-foreground">*/}
                                {/*    Dashboard*/}
                                {/*</Link>*/}
                                {renderNavMobile()}

                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="flex w-full items-center gap-4  md:gap-2 lg:gap-4">
                        <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">

                                {/*<Input*/}
                                {/*    type="search"*/}
                                {/*    placeholder="Search by email..."*/}
                                {/*    value={search}*/}
                                {/*    onChange={e => searchUser(e.target.value)}*/}
                                {/*    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"*/}
                                {/*/>*/}
                                <Button type={`button`} size={`icon`} onClick={() => setShowModal(!showModal)}
                                        variant={"outline"} className={``}>
                                    <SearchIcon
                                    className=" h-[1.2rem] w-[1.2rem] z`"/></Button>
                            </div>
                        </form>
                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                                <div className="relative z-10 w-full max-w-[500px] rounded-md bg-background  shadow-lg sm:p-6 sm:pt-2">
                                    <div className="flex justify-end items-center mb-4">
                                        {/*<h2 className="text-xl font-bold">Edit profile</h2>*/}
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        >
                                            <XIcon className="w-6 h-6" />
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <SearchIcon
                                            className="absolute left-2.5 top-2.5  h-[1.2rem] w-[1.2rem] z`"/>
                                        <Input
                                            type="search"
                                            placeholder="Search by email..."
                                            value={search}
                                            onChange={e => searchUser(e.target.value)}
                                            className="pl-8 sm:w-[300px] lg:w-full md:w-full"
                                        />
                                    </div>
                                    { search.length>0 ? (
                                        <div
                                            className=" w-full max-w-lg  border rounded-lg shadow-lg">
                                            <div className="p-4 space-y-2">
                                                {userSearchFound.length>0 ? userSearchFound.map((user) => (
                                                    <Link key={user._id} to={user._id!==state._id?`/profile/${user._id}`:"/profile"} className={` hover:bg-secondary `} onClick={()=>{
                                                        setSearch("")
                                                        setShowModal(false)
                                                    }} >
                                                        {/*<hr/>*/}
                                                    <div  className="p-4 rounded mt-2 cursor-pointer hover:bg-secondary flex items-center gap-4">
                                                        <img
                                                            src={user.picture}
                                                            alt={user.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-lg object-cover"
                                                            style={{aspectRatio: "40/40", objectFit: "cover"}}
                                                        />
                                                        <span className="text-sm font-medium">{user.name} <br/> { user.email}</span>
                                                    </div>
                                                    </Link>
                                                )) : <h2>No Users found</h2>}
                                            </div>
                                        </div>
                                    ) : ""}
                                </div>
                            </div>
                        )}



                        <ModeToggle/>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    {
                                        state
                                            ?
                                            <img className={`rounded-full w-9 h-9`} src={state.picture} alt=""/>
                                            :
                                            <CircleUserIcon className="h-5 w-5"/>

                                    }
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <Link to={"/profile/settings"} className={`cursor-pointer`}>
                                    <DropdownMenuItem className={`cursor-pointer`}>Settings</DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator/>
                                <Link to={"/signin"} className={`cursor-pointer`} onClick={() => {
                                    localStorage.clear()
                                    dispatch({type: "CLEAR"})
                                }}>
                                    <DropdownMenuItem className={`cursor-pointer`}>Logout</DropdownMenuItem></Link>
                            </DropdownMenuContent>

                        </DropdownMenu>
                    </div>
                </header>
            </div>
        </>
    );
});

export default memo(Header);
