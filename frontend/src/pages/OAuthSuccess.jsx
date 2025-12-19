import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    fetch("https://vitalplate-application.onrender.com/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(profile => {
        login(token, { profile });
        navigate("/onboarding"); 
      })
      .catch(() => navigate("/login"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Logging you in...
    </div>
  );
};

export default OAuthSuccess;
