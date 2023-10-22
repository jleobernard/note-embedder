# Note embedder

## Description

Simple Google cloud function that uses Cohere API to create embeddings for sentences.

## Installation

```shell
npm i
```

## Run

Your first need to have a Cohere API key which can be obtained [on the offical site](https://cohere.com/).

Save this API key in your .env file.

```shell
CORS_DOMAINS=http://localhost:3000 COHERE_API_KEY=<YOUR_COHERE_API_KEY> run start
```

## Request

- sentences: a list of string containing the sentences to embed
- primer: an optional string containing the prefix for all sentences (to add context to your sentences)

## Call

```shell
curl <YOUR_URL> -d '{"sentences": ["it is me", "c est moi"], "primer": "optional primer"}' -H 'content-type: application/json'

```
