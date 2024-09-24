import { useState } from 'react';
import './nav.css';

const HamburgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div className="hamburger" onClick={toggleMenu}>
				<div className={isOpen ? 'line open' : 'line'}></div>
				<div className={isOpen ? 'line open' : 'line'}></div>
				<div className={isOpen ? 'line open' : 'line'}></div>
			</div>
			<nav className={`navbar ${isOpen ? 'nav-links open' : 'nav-links'}`}>
				<ul>
					<li>
						<a href="/">Home</a>
					</li>
					<li>
						<a href="/create">Create</a>
					</li>
					<li>
						<a href="/all">All maps</a>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default HamburgerMenu;
