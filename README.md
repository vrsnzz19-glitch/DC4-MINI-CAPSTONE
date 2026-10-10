# ToneVault: Guitar Rig & Pedalboard Management System

**Developer:** Iverson Loquere  
**Course:** BSIT – Section 2

## Theme Description

ToneVault is a web-based system designed for guitarists who want to organize their guitar effects pedals, create virtual pedalboards, and also save their guitar rig configurations in one place.

The system uses a dark music-inspired interface with a modern dashboard. to helps guitarists manage their pedal collection, and arrange pedals in a signal chain, also save pedal settings, and last submit rig presets for administrator review.

## Features

### User Features
- User registration and login
- Secure authentication using Laravel Sanctum
- Dashboard showing pedal, pedalboard, and saved preset counts
- Browse and search the pedal library
- View pedal information and categories
- Create, view, edit, and delete personal pedalboards
- Add and organize pedals in a pedalboard signal chain
- Save guitar rig presets and configuration notes
- Submit rig presets for administrator review
- View preset submission status

### Administrator Features
- Administrator dashboard
- Manage pedal categories
- Add, view, edit, and delete pedals
- Review submitted rig presets
- Approve or reject preset submissions, if implemented

## Technology Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- Tailwind CSS, if configured in the project

**Backend**
- PHP
- Laravel
- Laravel Sanctum
- REST API

**Database**
- MySQL / MariaDB

**Development Tools**
- Visual Studio Code
- Laragon
- Composer
- Node.js and npm
- Git and GitHub
- Thunder Client or Postman

## Installation and Setup

### Prerequisites
Install the following tools before running the project:
- PHP and Composer
- Node.js and npm
- Laragon with MySQL/MariaDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/vrsnzz19-glitch/DC4-MINI-CAPSTONE.git
cd DC4-MINI-CAPSTONE
```

If the repository contains separate frontend and backend folders, open each folder and follow its respective setup steps.

### 2. Install Backend Dependencies

Open the Laravel backend folder in your terminal:

```bash
composer install
```

### 3. Configure the Environment

Create the environment file if it does not exist:

```bash
copy .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Open `.env` and configure the database connection:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tonevault_db
DB_USERNAME=root
DB_PASSWORD=
```

Create the `tonevault_db` database using phpMyAdmin or your database management tool. Update the credentials if your local MySQL configuration is different.

### 4. Run Database Migrations and Seeders

```bash
php artisan migrate --seed
```

This command runs the database migrations and available seeders. Demo accounts and sample pedals will only be created if the project's seeders are configured to create them.

### 5. Start the Laravel Backend

```bash
php artisan serve
```

The default local API address is:

`http://127.0.0.1:8000`

Keep this terminal running.

### 6. Install Frontend Dependencies

Open a separate terminal and navigate to the React frontend folder:

```bash
npm install
```

### 7. Start the React Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

### 8. Verify the Application

- Confirm that the Laravel backend starts successfully.
- Confirm that the frontend opens in the browser.
- Check that the frontend can communicate with the backend API.
- Test registration and login.
- Test pedal, pedalboard, and rig preset features.
- Verify that database records are saved correctly.

## Demo Account Credentials

Use the credentials below only if you create matching accounts in your database seeder.

| Account | Email | Password |
|---|---|---|
| Administrator | admin@tonevault.test | Admin123! |
| Guitarist | guitarist@tonevault.test | Guitar123! |

**Important:** These are suggested demo credentials, not verified existing accounts. Configure your seeders to create these accounts before using them. Do not use these sample passwords for a production deployment.

## YouTube Learning References


1. **Laravel REST API Tutorial**  
   https://www.youtube.com/results?search_query=Laravel+REST+API+CRUD+tutorial

2. **React and Laravel API Integration**  
   https://www.youtube.com/results?search_query=React+Laravel+REST+API+integration+tutorial

3. **Laravel Sanctum Authentication**  
   https://www.youtube.com/results?search_query=Laravel+Sanctum+API+authentication+tutorial

4. **React Dashboard UI Tutorial**  
   https://www.youtube.com/results?search_query=React+dashboard+UI+tutorial

5. **MySQL Database and Laravel Migrations**  
   https://www.youtube.com/results?search_query=Laravel+MySQL+migrations+seeders+tutorial


## Project Scope and Limitations

ToneVault focuses on managing guitar effects pedals, pedalboard arrangements, and saved rig configurations. It is a configuration management system and does not directly process guitar audio or replace physical guitar effects equipment.

Features such as preset approval, role-based access, and demo accounts depend on the actual project implementation.

## Developer

**Iverson Loquere**  
BSIT – Section 2

**Project:** ToneVault – Guitar Rig & Pedalboard Management System
