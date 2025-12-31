import React, { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: "http://localhost:8080",
  realm: "React-poc",
  clientId: "react-keycloak-poc",
});

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;
    client
      .init({
        onLoad: "check-sso",
        pkceMethod:"S256",
        checkLoginIframe: false,
      })
      .then((res) => {
        console.log(">>>res",res)
        setLogin(res);
        setToken(client.token);
      });
  }, []);

  return [isLogin, token];
};

export default useAuth;
