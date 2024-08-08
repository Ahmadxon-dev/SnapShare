import {createContext, memo, useContext, useEffect, useReducer, useState} from 'react'
import './index.css'
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import NotFound from "@/components/layout/NotFound.jsx";
import Home from "@/components/pages/Home.jsx";
import SignIn from "@/components/pages/SignIn.jsx";
import Profile from "@/components/pages/Profile.jsx";
import Sidebar from "@/components/layout/Sidebar.jsx";
import Header from "@/components/layout/Header.jsx";
import {ThemeProvider} from "@/providers/ThemeProvider.jsx"
import CreatePost from "@/components/pages/CreatePost.jsx";
import {initialState, reducer} from "@/reducer/userReducer.js";
import UserProfile from "@/components/pages/UserProfile.jsx";
import Settings from "@/components/pages/Settings.jsx";

export const UserContext = createContext()
const Routing = memo(() => {
    const navigate = useNavigate()
    const {state, dispatch} = useContext(UserContext)


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) {
            dispatch({type: "USER", payload: user})
        } else {
            navigate("/signin")
        }
    }, [])
    return (
        <div className={`pt-16`}>

            <Routes>
                <Route path={"/"} exact element={<Home/>}/>
                <Route path={"/signin"} element={<SignIn/>}/>
                <Route path={"/profile"} exact element={<Profile/>}/>
                <Route path={"/profile/settings"} exact element={<Settings/>}/>
                <Route path={"/createpost"} element={<CreatePost/>}/>
                <Route path={`/profile/:userId`} element={<UserProfile/>}  />
                <Route path={"*"} element={<NotFound/>}/>
            </Routes>
        </div>

    )
})

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <UserContext.Provider value={{state, dispatch}}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Header/>
                <Routing/>
            </ThemeProvider>

        </UserContext.Provider>
    )
}


export default memo(App);
