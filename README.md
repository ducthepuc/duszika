# Flare - Learn about all kinds of IT-related topics

Welcome to Flare! This platform lets you learn about IT topics - from programming languages to computer science and AI. What makes Flare special? The content is built by both our team AND the community. You can take courses created by the Flare team or other users, and even create and share your own courses!

## Important Note ⚠️🥵🥵🥵
> Flare is currently in active development. Some features are still being worked on or might not be available yet. This doesn't reflect the final state of the project.

### `The current 0.0.1 Pre-release only features a few things` such as:
   - **Account register and login** - *v1*
   - **Course render preview** - *alpha*
   - **Course creator** - *preview*
   - **Homepage** - *placeholder preview*

### Plans for Beta 1 release:
   - **Account system** - *v2 with profile picture, bio, content access limitation based on account type*
   - **Course renderer** - *v1 with rendering from JSON files of the selected course, progress tracking*
   - **Course creator** - *v1 with better interface, more task/step types, tags*
   - **Homepage** - *v1 with actual course cards being rendered, and filtered through by the search using the course's tags and title*
   - **Hosted website that is accessible for everyone** *(desktop only)*


## 📌 If you'd like to deploy the current version of Flare on your `Windows system`, refer to the following guide below:

### Prerequisites
Before you start, make sure you have these installed on your computer:
1. [NodeJS](https://nodejs.org/en) - Download and install the LTS (Long Term Support) version
2. [XAMPP](https://www.apachefriends.org/download.html) - For running the database
3. A code editor (We recommend [Visual Studio Code](https://code.visualstudio.com/) or [PyCharm](https://www.jetbrains.com/pycharm/))
4. [Python](https://www.python.org/downloads/) - Make sure to check "Add to PATH" during installation

## Step-by-Step Installation Guide

### 1. Get the Project Files
1. Go to our [release page](https://github.com/ducthepuc/Flare/releases)
2. Download the newest release
3. Unzip/Extract the downloaded file
4. Open the extracted folder with your code editor

### 2. Set Up the Frontend (React/Vite)
Open a terminal in your code editor and run:
```bash
# This installs Vite, which we use to run the React frontend
npm install -D vite

# Install other project dependencies
npm install
```

### 3. Set Up the Python Environment
In the same terminal:
```bash
# Create a virtual environment (replace path with where you want it)
# On Windows:
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Set Up the Database
1. Open XAMPP Control Panel
2. Start both the "Apache" and "MySQL" modules (click the "Start" buttons)
3. Click the "Admin" button next to MySQL (this opens phpMyAdmin in your browser)
4. In phpMyAdmin:
   - Create a db titled `flare`
      - Click "Import" in the top menu
      - Click "Choose File" and select the `dbschema.sql` from the project folder

### 5. Running the Project
1. Make sure to change the password (pw) in the db_secrets.json to your mysql database password or enable it if you didn't already.
2. Make sure XAMPP is running (both Apache and MySQL modules should be green)
3. Double-click the `start.bat` file in the project folder
   - If this doesn't work, try running it as administrator

### Common Issues & Solutions
- **"npm not found"**: Make sure NodeJS is properly installed and your computer was restarted after installation
- **"python not found"**: Ensure Python is added to your system's PATH
- **Database connection error**: Verify that XAMPP's MySQL module is running
- **Port already in use**: Make sure no other applications are using ports 3000 (React) or 5000 (Backend)

## 📌 If you'd like to deploy the current version of Flare on your `Linux system`, follow this guide:

### Prerequisites
Before starting, ensure you have the following installed:
1. [NodeJS](https://nodejs.org/en) - Install the LTS version
2. [MariaDB](https://mariadb.org/) or MySQL - For database management
3. A code editor (We recommend [Visual Studio Code](https://code.visualstudio.com/))
4. [Python](https://www.python.org/downloads/) - Install via your package manager and ensure it's added to your PATH

### Step-by-Step Installation Guide

#### 1. Get the Project Files
1. Visit our [release page](https://github.com/ducthepuc/Flare/releases)
2. Download the latest release
3. Extract the downloaded archive
4. Open the extracted folder with your preferred code editor

#### 2. Set Up the Frontend (React/Vite)
In a terminal opened in the project directory, run:
```bash
# Install Vite and project dependencies
npm install -D vite
npm install
```
#### 3.Set Up a Python Environment
```bash
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```
#### 4. Set Up the Database
Start the database service:
```bash
sudo systemctl start mariadb
```
Secure your MariaDB/MySQL installation:
```bash
sudo mysql_secure_installation
```
Log in to the database:
```bash
mysql -u root -p
```
Create the database and import the schema:
```bash
CREATE DATABASE flare;
USE flare;
SOURCE /path/to/dbschema.sql;
```
#### 5. Running the project
1. Update db_secrets.json with your database credentials.
2. Start the frontend and backend:
```bash
npm run dev
python3 app.py
```
3. Open your browser and navigate to the appropriate localhost port.
## Contributing
We welcome contributions! Feel free to submit issues and pull requests.

## Authors
- [@ducthepuc](https://github.com/ducthepuc) - Frontend Development 😱
- [@ebotdabest](https://github.com/ebotdabest) - Backend Development 😝
- [@PotatoDonkey749](https://github.com/PotatoDonkey749) - Full-Stack Development 😍
- [@Drifter0071](https://github.com/Drifter0071) - UI/UX Design 🙄

## Need Help?
If you run into any issues not covered here, please:
1. Check our [Issues](https://github.com/ducthepuc/Flare/issues) page
2. Create a new issue if your problem isn't already reported

Happy learning with Flare! 🚀
