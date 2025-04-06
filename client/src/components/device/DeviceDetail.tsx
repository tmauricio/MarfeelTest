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
			const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sensors/id/device_${deviceId}`, {
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

            <div className="bg-gray-300 w-34 m-auto my-5 rounded-xl py-2 px-4 flex justify-between items-center">
                Refresh in... {countdown}
            </div>
        </div>
	);
}; 