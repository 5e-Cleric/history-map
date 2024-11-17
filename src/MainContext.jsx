import { createContext, useState, useEffect } from 'react';

export const MainContext = createContext();

/*
Error Code Reference:

1-19 map errors:
	1 empty field when creating
	2 Error creating map
	3 Error fetching map
	4 Error updating map
	5 Error deleting map
20-39 point errors
	20 Error fetching points
	21 Error creating point
	22 Error updating point
	23 Error deleting point
	24 Error deleting all points per map
	25 Error moving point
40-59 Other errors
	40 Error finding resource

*/

export const MainProvider = ({ children }) => {
	const [error, setError] = useState({ errorCode: null, errorText: null });

	return (
		<MainContext.Provider
			value={{
				error,
				setError,
			}}>
			{children}
		</MainContext.Provider>
	);
};

export default MainProvider;
