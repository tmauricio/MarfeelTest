### Time tracking:
- 03/04/2025    2hs
- 04/04/2025    3hs
- 05/04/2025    4hs
- 06/04/2025    6hs
- TOTAL:        15hs



### Work done:
- A backend was created with node.js using the nest.js framework.
- A message queue was created with keydb to handle the high demand for inserts.
- The docker-compose was modified to include keydb.

the POST service that persists the device information in the database adds requests to a message queue instead of persisting directly in the database to avoid congestion of such requests considering that several calls are made per second. The message queue will process the data from each call and persist it in the database.
Reference backend files:
- sensors.controller.ts (where the REST services are defined)
- queueProcessor.ts (responsible for processing the requests arriving in the queue)
- sensor.service.ts (database requests)

NOTE: to bring up the complete project, run "docker compose up"



### Bonus Question
> Not to implement, just to write it down.
A new feature just has been requested by our clients. They want to be able to check the average temperature for location, last hour and last day. How would you approach the feature?


#### Response: 

Considering a sparsely populated and low-concurrency database, it would surely be easier to query directly from the "readings" table, for example:
"""
-- last minute data
SELECT *
FROM sensor_data.readings
WHERE recorded_at >= now() - INTERVAL 1 HOUR;
"""
"""
-- last day's data
SELECT *
FROM sensor_data.readings
WHERE recorded_at >= now() - INTERVAL 1 DAY;
"""

Now, taking into account that the table is highly concurrent and contains millions of records, the previous solution is no longer optimal. 
In this case, it might be best to create auxiliary tables, for example, "readings_average_day" and "readings_average_hour" where the averaged values of the last hour or the last day are stored. This table would be populated with values every x time using a cron job. 
I would also add a process that transfers the data from all these tables to a history table every x number of days to prevent them from growing too large and becoming more manageable.

examples of tables to create. They would basically have the same fields but with average values:
CREATE TABLE IF NOT EXISTS sensor_data.readings_average_day (
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

CREATE TABLE IF NOT EXISTS sensor_data.readings_average_hour (
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
