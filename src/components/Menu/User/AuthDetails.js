import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onIdTokenChanged, signOut } from 'firebase/auth';

export default function AuthDetails() {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onIdTokenChanged(auth, (user) => {
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
            {authUser ? <><p>{`Signed In as ${authUser.displayName} with uid: ${authUser.uid}`}</p>
                <button onClick={userSignOut}>Sign Out</button>
            </>
                : <><p>Signed Out</p>
                </>}
        </div>
    )


}