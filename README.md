# gdbook-monitoring

Monitoring for the GDBook website with Prometheus and Grafana, run with Docker Compose.
It shows whether the site is up, how fast it answers and how much traffic it gets, and
raises an alert when the site goes down.

## Services

| Service | What it does | Address |
| --- | --- | --- |
| `web` | The GDBook site, served by Nginx | <http://localhost:8080> |
| `nginx-exporter` | Converts Nginx's status page into metrics | internal |
| `blackbox-exporter` | Requests the site like a visitor and reports the result | internal |
| `prometheus` | Collects and stores metrics, evaluates alert rules | <http://localhost:9090> |
| `grafana` | Dashboard | <http://localhost:3000> |

## Run it

```bash
docker compose up -d
```

Open Grafana at <http://localhost:3000> (user `admin`, password `admin` unless
`GRAFANA_PASSWORD` is set) and open the **GDBook Site** dashboard. The data source and
the dashboard are loaded automatically from `grafana/`.

Stop it with `docker compose down`. Add `-v` to also delete the stored metrics.

## How it works

1. **Nginx** exposes connection and request counters at `/stub_status` on port 8081.
   That port is not published in `docker-compose.yml`, so only other containers can
   read it; visitors on port 8080 cannot.
2. **nginx-exporter** reads that page and republishes the numbers in Prometheus format.
3. **blackbox-exporter** makes a real HTTP request to the site whenever Prometheus asks,
   and reports whether it succeeded (`probe_success`) and how long it took
   (`probe_duration_seconds`).
4. **Prometheus** pulls ("scrapes") both exporters every 15 seconds and stores the
   results as time series. The `relabel_configs` block in `prometheus.yml` is what
   tells it to send the probe request to the blackbox exporter with the site as target.
5. **Grafana** queries Prometheus and draws the dashboard.

## Alerts

Defined in `prometheus/alerts.yml`, visible at <http://localhost:9090/alerts>:

| Alert | Fires when |
| --- | --- |
| `SiteDown` | the HTTP check has failed for 1 minute |
| `SiteSlow` | the site has taken over 1 second to answer for 5 minutes |
| `ExporterDown` | Prometheus cannot reach an exporter for 2 minutes |

Try it: run `docker compose stop web`, wait a little over a minute, and `SiteDown`
turns red. `docker compose start web` clears it.

## Useful queries

Paste into <http://localhost:9090/graph>:

```promql
probe_success                          # 1 = up, 0 = down
probe_duration_seconds                 # response time
rate(nginx_http_requests_total[1m])    # requests per second
nginx_connections_active               # open connections
```
