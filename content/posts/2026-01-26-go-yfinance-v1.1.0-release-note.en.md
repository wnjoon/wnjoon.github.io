---
title: "go-yfinance v1.1.0 Update"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-01-26"
slug: "go-yfinance-v1-1-0-release-note"
summary: "go-yfinance v1.1.0 now supports comprehensive international exchanges via MIC code mapping and includes a Price Repair system for data reliability."
description: "We have released go-yfinance v1.1.0. This update fully integrates the features of yfinance v1.1.0, including the powerful Price Repair logic from Python yfinance to ensure data integrity, and enhances global scalability by supporting over 60 international exchanges (MIC)."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "go", "go-yfinance", "claude code", "2026"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: false
hideBackToTop: false
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "go-yfinance v1.1.0 Update"
  "description": "We have released go-yfinance v1.1.0. This update fully integrates the features of yfinance v1.1.0, including the powerful Price Repair logic from Python yfinance to ensure data integrity, and enhances global scalability by supporting over 60 international exchanges (MIC)."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## ranaroussi/yfinance v1.1.0 Update

On January 24, 2026 (KST), [ranaroussi/yfinance was updated to v1.1.0](https://github.com/ranaroussi/yfinance/releases/tag/1.1.0).

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/9c217f68-49ca-4407-b5f3-1452d265cadc/image.png)

<br>

## v1.1.0 Key Changes

### 1. Price Repair System: Ensuring Data Integrity

A system has been implemented to automatically detect and repair intermittent errors in Yahoo Finance data. You can now obtain reliable financial data without any separate preprocessing.

- **Capital Gains Double-Counting Fix:** Detects and fixes errors where capital gains are counted twice in the Adjusted Close price for ETFs or Mutual Funds.
- **Stock Split Repair:** Corrects missing or erroneous stock split data using IQR-based outlier detection.
- **Unit Mixup Repair:** Automatically fixes errors where prices are displayed as 100x or 1/100x due to currency unit confusion (e.g., Pence vs. Pounds).
- **Zero Value & Dividend Repair:** Interpolates data marked as zero (Zero Value) and cleans up duplicate or abnormal Dividend data.

### 2. MIC Code Mapping: Enhanced Global Exchange Support

We have added a feature that maps **MIC (Market Identifier Code)**, the ISO 10383 standard, to Yahoo Finance ticker suffixes.

- **Support for 60+ Global Exchanges:** Supports major exchanges worldwide, including the Americas (NYSE, NASDAQ), Europe (LSE, XETRA), Asia (HKEX, TSE), and the Middle East.
- **Easy Ticker Conversion:** You can easily generate or parse accurate Yahoo Finance tickers using MIC codes via the `utils` package.

### 3. Statistics Package & Usability Improvements

A new `pkg/stats` package has been created for data analysis. Essential statistical functions for financial data analysis, such as `Percentile`, `ZScore`, and `Moving Average`, are provided out of the box to boost development productivity.

## Installation and Compatibility

This version maintains full backward compatibility with v1.0.0. You can update immediately to utilize the new features without modifying your existing code.

```bash
go get github.com/wnjoon/go-yfinance@v1.1.0
```

## Full Release Notes

For more detailed technical specifications and API usage, please check the release notes below.

👉 [go-yfinance v1.1.0 Release Notes](https://github.com/wnjoon/go-yfinance/blob/main/RELEASE_NOTES_v1.1.0.md)