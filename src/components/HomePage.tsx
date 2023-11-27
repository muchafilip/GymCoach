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
            {/* You can add more content here as needed */}
        </div>
    );
};

export default HomePage;
