🌲 LIFEWOOD
Lifewood is a Node.js web application primarily focused on the frontend and user experience for the Lifewood Company.
It acts as a client-facing website with interactive features and an admin panel for backend control.
The design is inspired by KnightOne and SB Admin 2, with my own custom modifications and additions.

Key functionalities include:
- Displaying company profile and information
- A job application form for visitors
- File uploads (such as resumes)
- Admin login panel
- Admin control to view, accept, or reject submitted applications

⚙️ INSTALLATION & USAGE
- Install `Node.js`
  - Download and install `Node.js` from: `https://nodejs.org/`
- Install `XAMPP`
  - Download and install `XAMPP` (includes Apache and MySQL) from: `https://www.apachefriends.org/index.html`
  - After installing:
    - Open the XAMPP Control Panel
    - Start both Apache and MySQL
- Set up the database
  - Open phpMyAdmin at: `http://localhost/phpmyadmin`
  - Create a new database (e.g., `lifewood_db`)
  - Import the file `database\lifewood_data_technology.sql` into the new database
    (Use the Import tab in phpMyAdmin)
- Create the `.env` file in your project root folder with the following content:
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=lifewood_db

  Make sure these values match your local MySQL/XAMPP configuration.
    Install Node dependencies
        Open a terminal in your project folder
        Run: npm install
    Run the backend server
        Use: npx nodemon server.js
        (Replace server.js with your actual main file if different)


🖥️ USING LIVE SERVER (for static HTML preview)
    If you're editing frontend pages or static HTML, you can preview them using Live Server:
        In Visual Studio Code:
            Install the "Live Server" extension.
            Right-click the HTML file and choose "Open with Live Server".
            It will open in the browser at: http://127.0.0.1:5500 or http://localhost:5500
        In Google Chrome:
            You may install the "Live Server Web Extension" for similar HTML preview functionality.

    NOTE: Live Server is only for viewing static HTML/CSS/JS. It does not run your backend Node.js code.


✅ YOU'RE READY!
    To view your backend in action, go to: http://localhost:3000 (or your specified port)
    Ensure Apache and MySQL are running in XAMPP before starting the server