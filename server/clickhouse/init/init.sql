CREATE DATABASE IF NOT EXISTS sensor_data;

CREATE TABLE IF NOT EXISTS sensor_data.readings (
    device_id String,
    temperature Float32,
    humidity Float32,
    pressure Float32,
    wind_speed Float32,
    heat_index Float32,
    air_density Float32,
    wind_chill Float32,
    dew_point Float32,
    location String,
    recorded_at DateTime,
    anomaly_prob Float32
) ENGINE = MergeTree()

ORDER BY recorded_at;