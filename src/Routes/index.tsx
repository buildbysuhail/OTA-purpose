import React from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";

const Index = () => {
    return (
        <React.Fragment>
            {/* <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                        />
                    ))}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected allowedRoles={route.allowedFor}>
                                    <VerticalLayout>{route.component}</VerticalLayout>
                                </AuthProtected>}
                            key={idx}
                        />
                    ))}
                </Route>
            </Routes> */}
        </React.Fragment>
    );
};

export default Index;