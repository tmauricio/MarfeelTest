// Define the interface for the device data type
interface DeviceData {
	location: string;
	device_id: string;
	temperature: number;
	humidity: number;
	pressure: number;
	wind_speed: number;
	heat_index: number;
	air_density: number;
	wind_chill: number;
	dew_point: number;
	recorded_at: string;
	anomaly_prob: number;
}

export type { DeviceData };
