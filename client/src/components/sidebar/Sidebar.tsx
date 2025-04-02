import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import './Sidebar.css';

export const Sidebar = () => {
	const { deviceId: deviceIdSelected } = useParams<{ deviceId: string }>();
	const [deviceIds, setDeviceIds] = useState([]);//['1234', '818181', '919191']);
	
	const fetchDeviceIds = async () => {
		try {
			const response = await axios.get('http://localhost:3030/sensors/sensornames', {
				headers: {
					authtoken: '123123123'
				}
			});
			setDeviceIds(response.data.map((data: string) => data.split('_')[1]));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchDeviceIds();
	}, []);
	
	if (!deviceIds) {
		return <div>Cargando...</div>;
	}

	return (
		<aside className="w-full bg-gray-800 text-white p-4 flex flex-col h-full">
			<Link to='/'>
				<h2 className="text-lg font-bold mb-4">Devices</h2>
			</Link>
			<nav className="flex-1">
			<ul>
				{deviceIds.map((deviceId) => (
				<li key={deviceId}>
					<Link
						to={`/device/${deviceId}`}
						className={`deviceName ${deviceId === deviceIdSelected ? 'deviceSelected' : ''}`}
					>
						Device {deviceId}
					</Link>
				</li>
				))}
			</ul>
			</nav>
		</aside>
	);
};
