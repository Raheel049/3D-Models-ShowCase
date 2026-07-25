import React, { useEffect } from 'react'
import api from '../../services/api'

const Dashboard = () => {

    const refreshToken = async () => {
        
    
        await api.post("/auth/refresh-token", )

    }

    useEffect(() => {
        refreshToken();
    })

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard