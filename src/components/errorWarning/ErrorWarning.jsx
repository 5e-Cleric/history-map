import { useContext } from 'react';
import { MainContext } from '../../MainContext';

const ErrorWarning = () => {
	const { error, setError } = useContext(MainContext);

	if (!error.errorCode) return <div className="error-warning"></div>;

	return (
		<div className="error-warning active">
			<h4 className="errorTitle">Error code: {error.errorCode}</h4>
			<button className="close" onClick={() => setError({ errorCode: null, errorText: null })}>
				<i className="fa-solid fa-xmark"></i>
			</button>
			<hr />
			<p>{error.errorText}</p>
		</div>
	);
};

export default ErrorWarning;
