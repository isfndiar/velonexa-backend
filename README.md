# VELONEXA BACKEND DOCUMENTATION

## Table of Contents
1. [Project Overview](#1-project-overview)
    1. [Introduction](#11-introduction)
2. [Getting Started](#2-getting-started)
    1. [Prerequisites](#21-prerequisites)
    2. [Installation](#22-installation)
    3. [Configuration](#23-configuration)
3. [Project Structure](#3-project-structure)
4. [Coding Guidelines](#4-coding-guidelines)
    1. [Coding Standards](#41-coding-standards)
    1. [Commit Message](#42-commit-message)
5. [Testing](#5-testing)
    1. [Unit Tests](#51-unit-tests)
    2. [Integration tests](#52-integration-tests)
6. [Usage](#6-usage)
7. [LICENSE](#licence)


## 1. Project Overview
#### 1.1 Introduction

Velonexa-backend is the application backend that provides APIs for the Velonexa social media platform. It handles user authentication, post management, comments, likes, and other social media functionalities, ensuring a seamless and robust experience for users.

The main goals and objectives of the project are:
  - Provide a secure and scalable API for the Velonexa social media platform.
  - Ensure high performance and reliability for user interactions.
  - Facilitate easy integration and deployment for future enhancements.


### 2. Getting Started
#### 2.1 Prerequisites
- [Node.js](https://nodejs.org) 18 or higher
- [Postgresql](https://www.postgresql.org/) 12.8 or higher
#### 2.2 Installation
- Step-by-step guide on how to set up the project locally.
```bash
git clone https://github.com/DEVTENO/velonexa-backend velonexa-backend

cd velonexa-backend

npm install

```

#### 2.3 Configuration
Before running the API, you need to set up the environment variables. Create a .env file based on the provided .env.example file. You can do this by running the following command:

```bash
cp .env.example .env
cp .env.development .env
```

Instructions on how to configure environment variables and other settings.

```bash
# .env file and .env.development file
DATABASE_URL=postgres://user:password@localhost:5432/database
DB_HOST=localhost #local database
DB_PORT=5432 # default post postgres
DB_USER=user
DB_PASSWORD=password
DB_NAME=database
DATABASE=postgre #default provider database
PORT= #port application running
BCRYPT_SALT=8 #development value bcrypt salt
JWT_SECRET= #random value
```

### 3. Project Structure
Explanation of the project's directory structure.
```bash
migration/
src/
  ├── common/
  │   ├── decorator/
  │   ├── filters/
  │   ├── guards/
  │   ├── middlewares/
  │   ├── utils/
  ├── database/
  │   ├── postgre/
  │   ├── database.module.ts
  │   ├── database.service.ts
  │   ├── database.ts
  ├── model/
  │   ├── web.model.ts
  ├── [domain]/
  │   ├── dto/
  │   ├── entities/
  │   ├── domain.repository.ts
  │   ├── domain.service.ts
  │   ├── domain.module.ts
  │   ├── domain.controller.ts
  ├── app.module.ts
  ├── main.ts
test/
```

### 4. Coding Guidelines
#### 4.1 Coding Standards

- Preferred coding style and standards.
- Linting rules and configuration.

#### 4.2 Commit Message

- Guidelines for writing clear and consistent commit messages.

### 5. Testing
#### 5.1 Unit Tests
Instructions on running unit tests.

```bash 
npm run test
``` 

#### 5.2 Integration Tests
Instructions on running integration tests.

```bash
npm run test:e2e
```

### 6. Usage

To start the API, run the following command in the terminal:

```bash

npm run start #run as usual

npm run start:dev: #run mode development

npm run start:debug #run mode debug
```

The API server will start, and you can access the endpoints at http://localhost:3000 (assuming the default port is used).

### LICENCE
MIT Lincense