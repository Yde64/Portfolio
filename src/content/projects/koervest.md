---
title: "Kørvest.dk"
description: "Full-stack driving school enrollment platform with admin panel, hosted on AWS"
tags: ["Next.js", "TypeScript", "AWS Lambda", "API Gateway", "DynamoDB", "S3", "CloudFront", "Route 53", "Cognito", "SES"]
image: "/images/projects/koervest.svg"
live: "https://kørvest.dk"
featured: true
order: 3
---

## Overview

A fully custom web platform for a driving school, built from scratch with a public-facing website for student enrollments and an admin panel for managing pricing and tracking sign-ups. The entire solution runs on AWS using a serverless architecture for scalability and cost efficiency.

## Motivation

The driving school needed a modern online presence that went beyond a static brochure site. They required a system where prospective students could enrol directly, and administrators could manage pricing and monitor enrollments without developer intervention. Off-the-shelf solutions didn't offer the flexibility or control needed, so a custom-built platform was the right fit.

## Architecture

```
Client (Next.js)
├── Public Website        → Course info, pricing, enrollment forms
└── Admin Panel           → Manage pricing, view enrollments

API Gateway → Lambda Functions → DynamoDB
                  ↓
              Amazon SES (email notifications)

CloudFront → S3 (static hosting)
Route 53 (DNS)
Cognito (admin authentication)
```

## Key Features

- **Student Enrollment** — Prospective students can browse courses, view pricing, and submit enrollment forms directly on the site.
- **Admin Panel** — A protected dashboard for managing course pricing and reviewing student enrollments in real time.
- **Serverless Backend** — AWS Lambda functions behind API Gateway handle all business logic with zero server management.
- **Email Notifications** — Amazon SES sends confirmation emails to students and alerts to administrators on new enrollments.
- **Authentication** — AWS Cognito secures the admin panel with managed user authentication.
- **CDN Delivery** — CloudFront serves the static frontend globally with low latency, backed by S3 for storage.
- **Custom Domain** — Route 53 manages DNS for the kørvest.dk domain with SSL/TLS via ACM.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript |
| Backend | AWS Lambda, API Gateway |
| Database | DynamoDB |
| Authentication | AWS Cognito |
| Email | Amazon SES |
| Hosting | S3, CloudFront |
| DNS | Route 53, ACM (SSL) |

## Key Learnings

- Designing a serverless architecture that keeps costs near zero at low traffic while scaling automatically
- Structuring DynamoDB tables with access patterns in mind rather than relational modelling
- Integrating AWS Cognito for admin auth without introducing unnecessary complexity for end users
- Setting up CloudFront + S3 hosting with proper cache invalidation for Next.js static exports
- Configuring Amazon SES for transactional emails with SPF/DKIM for reliable deliverability
