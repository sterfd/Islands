import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AuthDetails() {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null);
            }
        });
        return () => {
            listen();
        }
    }, []);

    async function userSignOut() {
        try {
            const response = await signOut(auth);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {authUser ? <><p>{`Signed In as ${authUser.email} with display: ${authUser.displayName}`}</p>
                <button onClick={userSignOut}>Sign Out</button>
            </>
                : <>Signed Out</>}
        </div>
    )


}