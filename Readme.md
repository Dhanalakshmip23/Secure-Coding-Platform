# Secure Coding Platform

A web-based platform to **write, execute, and check plagiarism** for code in multiple programming languages. Supports **JavaScript, Python, C, and Java**. Built with **React** (frontend) and **Node.js + Express** (backend).  

---

## Features

- **Code Execution**  
  - Run JavaScript, Python, C, and Java code in real-time.  
  - Handles loops, print statements, and basic programs.  

- **Plagiarism Detection**  
  - Upload one or multiple files.  
  - Checks for similarity between files and reports percentage matches.  

- **User-Friendly Interface**  
  - Syntax highlighting via the `Editor` component.  
  - Easy language selection.  
  - Real-time output display.  

---

## Project Structure
SECURE CODING PLATFORM/
├── Backend/
│   ├── node_modules/
│   ├── uploads/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── plagiarism.js
│   └── TemplavaClass.java
│
├── Frontend/
│   ├── build/
│   │   ├── static/
│   │   ├── asset-manifest.json
│   │   └── index.html
│   │
│   ├── node_modules/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── App.js
│   │   ├── Editor.js
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
└── README.md


---

## Prerequisites

- **Node.js** (v16 or higher)  
- **npm** or **yarn**  
- **Python** installed and accessible in PATH (`python --version`)  
- **GCC** for C programs (`gcc --version`)  
- **JDK 25** for Java programs (`javac --version` and `java --version`)  

---

## Installation & Setup

### Backend

1. Open terminal in `backend` folder.  
2. Install dependencies:  
npm install 


3. Start server:

node server.js

a. Runs on: http://localhost:5000
b. Ensure Python, GCC, and JDK are installed and in your system PATH.

##
Frontend

1. Open terminal in frontend folder.
2. Install dependencies:
npm install

3. Start React app:
npm start
a. Opens in browser at http://localhost:3000

###
How to Use

1. Run Code

a. Select a language from the dropdown.
b. Write or paste code in the editor.
c. Click Run → output will appear in the output panel.

2. Check Plagiarism

a. Click Choose Files → upload one or more .txt, .js, .py, .c, or .java files.
b. Click Check Plagiarism → results appear below with similarity percentages.

###
Sample Code for Testing

1. JavaScript (sample.js)

for (let i = 1; i <= 5; i++) {
    console.log("JS loop iteration:", i);
}

2. Python (sample.py)

for i in range(1, 6):
    print("Python loop iteration:", i)

3. C (sample.c)

#include <stdio.h>
int main() {
    for (int i = 1; i <= 5; i++) {
        printf("C loop iteration: %d\n", i);
    }
    return 0;
}

4. Java (Sample.java)

public class Sample {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Java loop iteration: " + i);
        }
    }
}

Tips

a. Java & C require their respective compilers to be installed and added to system PATH.
b. Plagiarism detection works even with a single file, but more files give better comparisons.
c. Use plain UTF-8 text files for best results.

