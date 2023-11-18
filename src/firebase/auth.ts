
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from './config';

export const registerWithEmail = async (email: string) => {
    const actionCodeSettings = {
        // Set up the URL you want to redirect after user signs in
        url: 'http://your-website.com/finishSignUp',
        handleCodeInApp: true,
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        // ...previous code...

        // Store the email locally to complete the sign-in process
        window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
        console.error('Error sending sign-in link: ', error);
    }
};

export const signInWithEmailLinkHandler = async (email: string, windowLocationHref: string) => {
    try {
        if (isSignInWithEmailLink(auth, windowLocationHref)) {
            // This will return a user object if the sign-in is successful
            await signInWithEmailLink(auth, email, windowLocationHref);
            window.localStorage.removeItem('emailForSignIn');
        }
    } catch (error) {
        console.error('Error signing in with email link: ', error);
    }
};

// Add other authentication related functions here
