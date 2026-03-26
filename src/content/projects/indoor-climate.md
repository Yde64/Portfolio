---
title: "Indoor Climate System"
description: "Embedded system for monitoring and controlling indoor climate"
tags: ["Embedded", "C++", "Sensors", "IoT", "MQTT", "Linux", "Raspberry Pi", "AWS IoT", "DynamoDB"]
image: "/images/projects/indoor-climate.svg"
github: "https://github.com/Yde64/Home_environment_monitoring"
featured: true
order: 1
---

## Overview

A full-stack embedded monitoring system that captures real-time indoor air quality data, transmits it over MQTT, stores it in the cloud, and displays it on a locally hosted dashboard.

## Motivation

Poor indoor air quality often goes unnoticed. High CO₂ levels can reduce concentration, elevated particulate matter affects respiratory health, and improper humidity encourages mould growth. This project was built to make these invisible factors visible — providing continuous, data-driven insight into the indoor environment.

## Sensor Box

The core of the system is a custom sensor box that measures:

- **CO₂** (ppm) — carbon dioxide concentration
- **Temperature** (°C)
- **Particulate Matter** (PM2.5 & PM10, µg/m³) — fine and coarse airborne particles
- **Humidity** (RH%) — relative humidity

Sensor readings are sampled at regular intervals and packaged into structured messages for transmission.

## Architecture

```
Sensors → Raspberry Pi → MQTT Broker → AWS IoT Core → DynamoDB
                ↓
         Local Web Dashboard
```

1. **Data acquisition** — Sensors connected to a Raspberry Pi collect environmental readings via C++ drivers.
2. **Message transport** — Readings are published over MQTT, providing lightweight and reliable delivery.
3. **Cloud storage** — AWS IoT Core ingests the messages and routes them into a DynamoDB table for persistent, queryable storage.
4. **Visualization** — A web dashboard hosted on the Raspberry Pi fetches historical and live data, rendering it in time-series charts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Hardware | Raspberry Pi, SCD30 (CO₂), SPS30 (PM), DHT22 (temp/humidity) |
| Firmware | C++ with Linux system APIs |
| Transport | MQTT (Mosquitto broker) |
| Cloud | AWS IoT Core, DynamoDB |
| Dashboard | HTML/JS served from the Pi |

## Key Learnings

- Designing reliable sensor polling loops in C++ on embedded Linux
- Structuring MQTT topic hierarchies for scalable IoT data
- Configuring AWS IoT rules to route messages into DynamoDB
- Building a lightweight dashboard that works on a low-power device
