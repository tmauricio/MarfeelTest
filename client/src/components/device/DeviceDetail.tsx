import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { DeviceData } from '../../models/deviceData';
import './DeviceDetail.css';

export const DeviceDetail = () => {
	const { deviceId } = useParams<{ deviceId: string }>();
	const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
    const [countdown, setCountdown] = useState(10);
	const [loading, setLoading] = useState(true);

	const fetchDeviceData = async () => {
		try {
			const response = await axios.get(`http://localhost:3030/sensors/id/device_${deviceId}`, {
				headers: {
					authtoken: '123123123'
				}
			});
			setDeviceData(response.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
        fetchDeviceData();
        setCountdown(10);
		// const interval = setInterval(fetchDeviceData, 10000);
		// return () => clearInterval(interval);
	}, [deviceId]);


	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown(prev => {
				if (prev === 1) {
					fetchDeviceData();
					return 10;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [fetchDeviceData]);

	if (loading) {
		return <div>Cargando...</div>;
	}

	if (!deviceData) {
		return <div>No se encontró el dispositivo.</div>;
	}

	return (
        <div>
            <div className='flex justify-center'>
                <div className="rounded-lg bg-white shadow max-w-xl">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className='titleDevice'>Weather Station - {deviceData.location}</h3>
                        <table className="min-w-full divide-y divide-gray-300">
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="tdName">Device ID</td>
                                    <td className="tdData">{deviceData.device_id}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Temperature (C)</td>
                                    <td className="tdData">{deviceData.temperature}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Humidity (%)</td>
                                    <td className="tdData">{deviceData.humidity}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Pressure (hPa)</td>
                                    <td className="tdData">{deviceData.pressure}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Wind Speed (m/s)</td>
                                    <td className="tdData">{deviceData.wind_speed}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Heat Index (C)</td>
                                    <td className="tdData">{deviceData.heat_index}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Air Density (kg/m³)</td>
                                    <td className="tdData">{deviceData.air_density}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Wind Chill (C)</td>
                                    <td className="tdData">{deviceData.wind_chill}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Dew Point (C)</td>
                                    <td className="tdData">{deviceData.dew_point}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Recorded At (C)</td>
                                    <td className="tdData">{deviceData.recorded_at}</td>
                                </tr>
                                <tr>
                                    <td className="tdName">Anomaly probability (C)</td>
                                    <td className="tdData">{deviceData.anomaly_prob}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-green-300 w-24 m-auto my-5 rounded-xl py-2 px-4 flex justify-between items-center">
                <svg class="mr-3 size-5 animate-spin"  fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <div>{countdown}</div>
            </div>
        </div>
	);
}; 