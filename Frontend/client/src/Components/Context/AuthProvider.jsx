import { useEffect, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      console.log(data.user)
      
    } catch (err) {
      setUser(null);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};  