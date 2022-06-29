

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
You can also use <a href="../web.md#public-endpoints">Public endpoints</a>.
To learn more read <a href="../web.md#sdk-deployment---getting-started-guide">SDK Deployment guide</a>:  <a href="../web.md#docker">Docker</a>, <a href="../packages/web.md#git">Git</a>.

# Packages

## SDK
<a href="../sdk.md">SDK package</a> contains npm package of SDK itself.

## Web
As an alternative to the whole SDK, you can use proxy http serviсe for SDK to implement server logic - <a href="../web.md">HTTP API Service</a>.
It is created to interact with the blockchain using simple HTTP requests.
In general, this service provides the following functions:

 1. <a href="../web.md#build-unsigned-extrinsic">Building an unsigned extrinsic</a>
 2. <a href="../web.md#sign-an-extrinsic">Extrinsic signing and verification using service</a> (These functions should be implemented on client for safety)
 3. <a href="..//web.md#Submit-extrinsic">Submitting an extrinsic</a>

HTTP API Service also allows to upload images using IPFS, can be used with existing public nodes or with your own private nodes.
Use <a href="../web.md">service documentation</a> to learn its methods.

## Recipes
<a href="../recipes">Here</a> you can find some useful hints or life hacks that will ease using of SDK.
