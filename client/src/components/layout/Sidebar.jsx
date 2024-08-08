import React from 'react';
import {Link, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button.jsx";
import {Home, LogOut, LogIn, User} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";

const Sidebar = () => {
    return (
        <>
            <div className="hidden border-r bg-muted/70 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold" >
                            <span className="text-xl">SnapSphere</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <BellIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-lg font-medium lg:px-4">
                            <Link
                                to="/"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Home className={`h-5 w-5`} />
                                Dashboard
                            </Link>
                            {/*<Link*/}
                            {/*    to="#"*/}
                            {/*    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"*/}
                            {/*>*/}
                            {/*    <ShoppingCartIcon className="h-4 w-4" />*/}
                            {/*    Orders*/}
                            {/*    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>*/}
                            {/*</Link>*/}
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 bg-muted transition-all hover:text-primary"
                            >
                                <User className={`h-5 w-5`}/>
                                Profile
                            </Link>
                            <Link
                                to="/signin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <LogIn className={`h-5 w-5`} />
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <LogOut className={`h-5 w-5`} />
                                Sign Up
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

function BellIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}


export default Sidebar;