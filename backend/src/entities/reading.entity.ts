
export class ReadingEntity {
  device_id: string;
  temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  heat_index: number;
  air_density: number;
  wind_chill: number;
  dew_point: number;
  location: string;
  recorded_at: Date;
  anomaly_prob: number;
}
