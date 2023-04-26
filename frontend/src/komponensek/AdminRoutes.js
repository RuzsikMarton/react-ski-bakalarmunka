import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {Store} from "../Store";

function AdminRoutes({children}) {
    const {state} = useContext(Store);
    const {userInfo} = state;
    return userInfo && userInfo.isAdmin ? children : <Navigate to={"/signin"}></Navigate>
}

export default AdminRoutes;