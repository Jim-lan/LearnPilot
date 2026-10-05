# Run LearnPilot on your home Wi-Fi

The laptop runs the server and holds the SQLite database. Phones, tablets and other computers use a browser on the same local network. Keep the laptop awake and the server running. The two named synthetic profiles keep progress separate, but every connected device can switch between them; these are not authenticated accounts. Real student use remains gated by the unfinished recovery, deletion and privacy tasks.

## Native laptop run

From the project directory, with Node.js 22.13+ installed:

```sh
npm ci
npm run build
npm run lan:info
LEARNPILOT_LAN_INTERFACE=en0 npm run start:lan
```

Select the interface shown for your home Wi-Fi; `en0` is the interface verified on the development Mac. The launcher prints a URL such as `http://192.168.2.182:3000`. Open that exact URL on the laptop or another device. Use the printed address, not `localhost`, on phones. Your address can change when the router reconnects. A DHCP reservation in your router can keep it stable. Press Ctrl+C in the launching terminal to stop sharing. There is no login-startup service installed.

`npm run start` and `npm run dev` retain computer-only access. For LAN sharing use the production launcher above; it starts the app on loopback port 3100 and a guarded entry point on the selected private IPv4 address, port 3000. It does not listen on all laptop interfaces. Ports can be overridden with `LEARNPILOT_LAN_PORT` and `LEARNPILOT_BACKEND_PORT` (different values, 1024–65535). The launcher reads exported environment variables, not `.env` files.

Local native storage defaults to `~/Library/Application Support/LearnPilot`. Override with `LEARNPILOT_DATA_DIR=/absolute/private/path` in the launching command; keep it outside source and cloud-sync folders. The October 5 browser checks used a separate disposable directory `/private/tmp/learnpilot-lan-rewards-oct5`, not real records. Temporary storage is for testing, not long-term use.

## Optional Docker run

With Docker Desktop running, and Node installed for the host's small network entry point:

```sh
LEARNPILOT_LAN_INTERFACE=en0 npm run start:lan:docker
```

This builds and starts the container, waits for its health check, then starts the host's LAN entry point. Docker publishes the app **only to laptop loopback** (`127.0.0.1:3100`). Requests from other devices first pass through the host entry point, where the real socket peer address is still visible. This avoids depending on Docker Desktop preserving the original client address. Ctrl+C stops the entry point and container; `docker compose stop` is also available. The container does not automatically restart with the laptop.

The named `learnpilot-data` Docker volume preserves container records across stops/recreation. Native and Docker modes have separate databases by default. Changing modes does not transfer attempts or points. Do not run a second server against the same SQLite file, copy a live database, or use `docker compose down -v` for routine shutdown: the latter deletes the volume. Export/restore between modes remains a future task. No Docker socket or home directory is mounted in the application container, and it runs as the unprivileged `node` user.

## What “local network only” means

- The host entry point accepts direct IPv4 peers only in the selected interface's private subnet. Other subnets, public addresses, IPv6 and loopback peers are rejected there. A separate loopback backend is available only on the laptop.
- It requires the exact configured Host and same-origin mutation requests, strips untrusted forwarding headers and refuses proxy/upgrade requests. A supplied `X-Forwarded-For` address grants no access.
- It closes LAN access if the selected address/subnet disappears or changes. Restart it after returning to the home network.
- Keep router port forwarding, UPnP mappings for this service, public tunnels and remote-access VPN routes disabled. A router or proxy can make an outside connection appear local; the app cannot certify physical Wi-Fi membership. Wired devices on the same subnet also qualify. No router/firewall settings are changed automatically by this project.
- This prototype uses HTTP on a trusted home network. It does not provide encrypted traffic, device authentication, parent/student isolation, or a guarantee against someone already on that network. Those are additional requirements before sensitive real-data deployment.

For a phone connection failure, confirm the exact URL, same home network (not a guest network with client isolation), awake laptop and running launcher. Check whether macOS is blocking incoming Node connections. Do not turn off the firewall globally. An outside-network check should fail when the phone leaves Wi-Fi; no cellular/WAN test has been performed by the development agent. A URL using a private address is not proof by itself that router forwarding is absent.

Implementation references: [Node socket peer addresses](https://nodejs.org/api/net.html#socketremoteaddress) and [Docker port publishing](https://docs.docker.com/engine/network/port-publishing/). The latter documents why explicit bind addresses matter.
