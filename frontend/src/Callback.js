import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Callback() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {

    const token = searchParams.get("token");
    const instanceUrl = decodeURIComponent(
        searchParams.get("instance_url")
);
    if (token) {

      localStorage.setItem("access_token", token);
      localStorage.setItem("instance_url", instanceUrl);

      alert("Login Successful");

      navigate("/");
    }

  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Authenticating...</h2>
    </div>
  );
}

export default Callback;