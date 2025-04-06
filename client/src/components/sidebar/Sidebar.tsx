import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import './Sidebar.css';
import loadingImg from '../../assets/loading.svg';


export const Sidebar = () => {
	const { deviceId: deviceIdSelected } = useParams<{ deviceId: string }>();
	const [deviceIds, setDeviceIds] = useState([]);
	const [loading, setLoading] = useState(false);
	
	const fetchDeviceIds = async () => {
		try {
			setLoading(true);
			setDeviceIds([]);
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sensors/sensornames`, {
				headers: {
					authtoken: '123123123'
				}
			});
			setDeviceIds(response.data.map((data: string) => data.split('_')[1]));
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDeviceIds();
	}, []);
	

	return (
		<aside className="w-full bg-gray-800 text-white p-4 flex flex-col h-full">
			<Link to='/'>
				<h2 className="text-lg font-bold mb-4">Devices</h2>
			</Link>
				<nav className="flex-1">
					{!loading ? (
						<ul>
							{deviceIds.length > 0 ? (
								deviceIds.map((deviceId) => (
								<li key={deviceId}>
									<Link
										to={`/device/${deviceId}`}
										className={`deviceName ${deviceId === deviceIdSelected ? 'deviceSelected' : ''}`}
									>
										Device {deviceId}
									</Link>
								</li>
								))
							) : (
								<li>No sensors found</li>
							)
						}
						</ul>
					) : (
						<div className="flex">
							<img src={loadingImg} alt="Loading..." className="icon-refresh" />
							Loading...
						</div>
					)}
				</nav>
			<button onClick={fetchDeviceIds} className="refresh-button">
				Refresh Devices
			</button>
		</aside>
	);
};
