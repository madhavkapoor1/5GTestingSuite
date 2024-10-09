# 5G Testing Suite

Welcome to the 5G Testing Suite! This project is designed to collect and analyze data from modem diagnostics, providing valuable insights into 5G performance. It includes both a **front-end interface** and a **back-end** to facilitate data processing, analysis, and visualization.

## Table of Contents
1. [Requirements](#requirements)
2. [Installation Guide](#installation-guide)
   - [Installing Git](#installing-git)
   - [Installing Node.js and npm](#installing-nodejs-and-npm)
3. [Setup](#setup)
   - [Cloning the Repository](#cloning-the-repository)
   - [Setting up the Front End](#setting-up-the-front-end)
   - [Setting up the Back End](#setting-up-the-back-end)
4. [How to Use](#how-to-use)
5. [Converting Files](#converting-files)

---

## Requirements

Before you begin, make sure your system meets the following requirements:

- **Git** (for cloning the repository)
- **Node.js and npm** (for running the front end)
- **Python** (for running the backend scripts)

---

## Installation Guide

### Installing Git
If you don’t already have Git installed, follow these steps:

- **Windows**: 
  1. Download Git from [here](https://git-scm.com/download/win) and install it.
  2. During installation, choose "Use Git from the command line and also from 3rd-party software".

- **macOS**:
  1. Open the Terminal application.
  2. Install Git using Homebrew:
     ```bash
     brew install git
     ```

- **Linux**:
  1. Open the terminal.
  2. Install Git using the package manager:
     ```bash
     sudo apt update
     sudo apt install git
     ```

### Installing Node.js and npm
Next, you'll need **Node.js** and **npm** for the front-end setup.

- **Windows/macOS/Linux**: 
  1. Visit the [Node.js website](https://nodejs.org/en/download/) and download the installer.
  2. Install Node.js which will automatically include npm (Node Package Manager).

To verify that Node.js and npm are installed, run the following commands in your terminal:
```bash
node -v
npm -v
```

## Setup

### Cloning the Repository
To get started, you will need to clone this repository to your local machine.

Open the terminal and run the following command:

```bash
git clone https://github.com/madhavkapoor1/5GTestingSuite.git
```

Navigate into the project directory:

```bash
cd 5GTestingSuite
```

### Frontend Setup
Navigate into the frontend directory:

```bash
cd Frontend
```

Install the dependencies by running

```bash
npm install
```

To start the front-end development server, run:
```bash
npm run dev
```

The frontend interface should be running on localhost now.

### Backend Setup
Open a new terminal, and navigate into the backend directory:

```bash
cd Backend
```

Install the dependencies by running

```bash
npm install
```

To start the front-end development server, run:
```bash
npm run dev
```

The backend interface should be running on localhost:4000 now.

## How to Use

### Accessing the Interface

After setting up the front end, navigate to localhost running the interface in your browser. You will be presented with a user-friendly interface for selecting which tests you want to run, proividing the IP address of the device under test.

On selecting the tests, you have the option to select 'Repeat Mode', which will run the selected tests, untill 'Stop tests is clicked'. In normal mode, the selected tests stop after one cycle of execution.

### Converting Files
Once you finish running your tests, this test suite also has the ability to convert the text output files to excel format, for easier data analysis. 

To do this, navigate to the Text2Excel directory

```bash
cd Text2Excel
```

Based of the file you want to covert run the command, in the format

```bash
python3 {name of python script to covert desired file}
```

The output for this is saved in Text2Excel/exceloutput. You can direcly download the excel file from here