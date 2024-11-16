import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@pages/home/Home';
import Create from '@pages/create/Create';
import Changelog from '@pages/changelog/changelog';
import All from '@pages/All';
import Edit from '@pages/editMap/EditMap';
import EditProvider from '@pages/editMap/EditContext';
import MainProvider from './MainContext';
import ErrorWarning from '@components/errorWarning/ErrorWarning';

const AppRoutes = () => {
	return (
		<MainProvider>
							<ErrorWarning/>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/create" element={<Create />} />
					<Route path="/all" element={<All />} />
					<Route path="/changelog" element={<Changelog />} />
					<Route
						path="/map/:id"
						element={
							<EditProvider>
								<Edit />
							</EditProvider>
						}
					/>
				</Routes>
			</Router>
		</MainProvider>
	);
};

export default AppRoutes;
