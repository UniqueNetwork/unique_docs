<div align="center">
    <img width="400px" src="../doc/logo-white.svg" alt="Unique Network">

[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
[![uniquenetwork](https://img.shields.io/badge/unique-network-blue?style=flat-square)](https://unique.network/)
![Docker Automated build](https://img.shields.io/docker/cloud/automated/uniquenetwork/web?style=flat-square)
![language](https://img.shields.io/github/languages/top/uniquenetwork/unique-sdk?style=flat-square)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/uniquenetwork/unique-sdk?style=flat-square)
![GitHub](https://img.shields.io/github/v/tag/uniquenetwork/unique-sdk?style=flat-square)
[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)
</div>


# Intro

The SDK is intended for developers whose goal is to implement Unique Network functions avoiding working with a low-level blockchain API.
This SDK may be used as an npm package or REST API.

## Table of Contents

- [Getting started](#how-to-start)
- [Packages](#packages)
 	- [SDK](#sdk)
	- [Web](#web)
	- [Recipes](#recipes)

# How to start
Add SDK to your JavaScript/TypeScript project with

    npm install @unique-nft/sdk
or deploy your own SDK as HTTP REST Service with

    docker run uniquenetwork/web:latest
You can also use <a href="../packages/web#public-endpoints">Public endpoints</a>.
To learn more read <a href="../packages/web#sdk-deployment---getting-started-guide">SDK Deployment guide</a>:  <a href="../packages/web/README.md#docker">Docker</a>, <a href="../packages/web/README.md#git">Git</a>.

# Packages

## SDK
<a href="../packages/sdk">SDK package</a> contains npm package of SDK itself.

## Web
As an alternative to the whole SDK, you can use proxy http serviсe for SDK to implement server logic - <a href="../packages/web">HTTP API Service</a>.
It is created to interact with the blockchain using simple HTTP requests.
In general, this service provides the following functions:

 1. <a href="../packages/web#build-unsigned-extrinsic">Building an unsigned extrinsic</a>
 2. <a href="../packages/web#sign-an-extrinsic">Extrinsic signing and verification using service</a> (These functions should be implemented on client for safety)
 3. <a href="../packages/web#Submit-extrinsic">Submitting an extrinsic</a>

HTTP API Service also allows to upload images using IPFS, can be used with existing public nodes or with your own private nodes.
Use <a href="../packages/web#readme">service documentation</a> to learn its methods.

## Recipes
<a href="../recipes">Here</a> you can find some useful hints or life hacks that will ease using of SDK.
