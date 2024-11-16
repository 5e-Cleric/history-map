import { createContext, useState, useEffect } from 'react';

export const MainContext = createContext();

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
