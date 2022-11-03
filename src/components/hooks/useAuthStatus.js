import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/firebase-auth";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingstatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) setLoggedIn(true);
      setCheckingstatus(false);
    });
  });

  return <div>useAuthStatus</div>;
};
