import React from "react"
import { Navigate } from "react-router-dom"
import { connect } from "react-redux"
import { RootState } from "../reducers"

interface Props {
    staffOnly?: boolean
    is_staff: boolean
    children: React.ReactNode
    isAuthenticated: boolean | null
}

const PrivateRoute: React.FC<Props> = ({
    staffOnly = false,
    is_staff,
    children,
    isAuthenticated,
}) => {
    if (isAuthenticated === null) return null

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (staffOnly && !is_staff) return <Navigate to="/" replace />

    return <>{children}</>
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    is_staff: state.profile.is_staff,
})

export default connect(mapStateToProps, {})(PrivateRoute)
