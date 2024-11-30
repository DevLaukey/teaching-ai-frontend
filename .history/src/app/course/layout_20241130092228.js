import Navigation from '@/components/Navbar';
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div>
           <Navigation/>
            <main>{children}</main>
            <footer>
                <p>&copy; 2023 Course App</p>
            </footer>
        </div>
    );
};

export default Layout;