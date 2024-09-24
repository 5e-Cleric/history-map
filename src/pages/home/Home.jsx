import mapLogo from '@assets/map.jpg';
import './home.css';
import Nav from '@components/nav/Nav';

function Home() {
	return (
		<div className="page home">
			<Nav />
			<main className="content">
				<div>
					<img
						className="logo"
						src={mapLogo}
						alt="map logo"
						width="500px"
						style={{ boxShadow: ' 0 0 10px black' }}
					/>
				</div>
				<h1>History Map Creator</h1>
				<div className="card">
					<a href="/create">Create your map</a>
					<br />
					<a
						href={`http://naturalcrit.com/login?redirect=${window.location.href}`}
					>
						Sign up
					</a>
				</div>
			</main>
		</div>
	);
}

export default Home;