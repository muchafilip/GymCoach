import React from 'react';
import { FaAngleRight, FaAngleLeft, FaThLarge, FaCalendarAlt, FaList, FaVial, FaBars } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import "../../style/navbar.css";

const ICON_SIZE = 20;

function Navbar({ visible, show }) {
    const hideNavbar = () => {
        if (visible) {
            show(false);
        }
    };

    return (
        <>
            <div className="mobile-nav">
                <button
                    className="mobile-nav-btn"
                    onClick={() => show(!visible)}
                >
                    <FaBars size={24} />
                </button>
            </div>
            <nav className={!visible ? 'navbar' : ''}>
                <button
                    type="button"
                    className="nav-btn"
                    onClick={() => show(!visible)}
                >
                    {!visible ? <FaAngleRight size={30} /> : <FaAngleLeft size={30} />}
                </button>
                <div className="links">
                    <NavLink to="/" className="nav-link" onClick={hideNavbar}>
                        <FaThLarge size={ICON_SIZE} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/generate-workout-plan" className="nav-link" onClick={hideNavbar}>
                        <FaCalendarAlt size={ICON_SIZE} />
                        <span>Generate Workout Plan</span>
                    </NavLink>
                    <NavLink to="/current-workout-day" className="nav-link" onClick={hideNavbar}>
                        <FaList size={ICON_SIZE} />
                        <span>Current Workout</span>
                    </NavLink>
                    <NavLink to="/my-workout-plans" className="nav-link" onClick={hideNavbar}>
                        <FaVial size={ICON_SIZE} />
                        <span>My Workout Plans</span>
                    </NavLink>
                    <NavLink to="/test" className="nav-link" onClick={hideNavbar}>
                        <FaVial size={ICON_SIZE} />
                        <span>Test</span>
                    </NavLink>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
