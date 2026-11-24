# Nig-Sails research brief (2026-11-24)

Decision: CesiumJS Google Earth–style globe (grid-globe stack, `baseLayer` not `imageryProvider: false`). Reuse cable-globe open layers and historic ESTIMATE cables as one layer. No TeleGeography, Street View, or Apple Maps.

AIS: AISStream.io free websocket, key in `~/.config/nig-sails/aisstream.env` (chmod 600) read by `tools/ais-proxy.mjs` on 127.0.0.1:5191. Fallbacks: Digitraffic, Kystverket, DEMO ships.

See ../SOURCES.md for URLs. v0.1 ships fixtures plus stub endpoints; Game Coder queue v01 bakes the large public downloads.
