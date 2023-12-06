// components/HomePage.tsx
import React from 'react';
import { User } from 'firebase/auth';

interface HomePageProps {
    currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser }) => {
    return (
        <div>
            <h1>Hi {currentUser?.email}!</h1>
            <h2>Your userId is: {currentUser?.uid}</h2>
        </div>
    );
};

export default HomePage;
