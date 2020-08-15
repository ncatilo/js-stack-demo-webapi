# Javascript Stack - Web API

## Local development set-up

1.  Install Node from https://nodejs.org on your local machine.
    Or upgrade your existing Node installation to v6.9.4 or above using the following terminal commands:
    
    For Mac or Linux:
    ```
    sudo npm cache clean -f
    sudo npm install -g n
    sudo n stable
    ```
    
    For Windows, run the same command lines above without the keyword, `sudo`
    
2.  Install **mongodb** from https://www.mongodb.com and run it in the background from the terminal.
    
    As an option, specify to parameter, **--dbpath** the desired local disk path where you wish the data files to be stored on your machine.

    e.g. Windows cmd line below

    ```
    "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath "C:\mongo-data"
    ```

3. Execute the following terminal commands

    ```
    sudo npm install nodemon -g
    sudo npm install
    sudo npm test
    sudo nodemon server.js
    ```
    
    For Windows, run the same command lines above without the keyword, `sudo`

    All tests should have passed with green check marks and the API could now be launched at http://localhost:3000/api

## Useful development tools to download and install

- Robomongo - MongoDB management tool http://robomongo.org/
- Postman - GUI tool to test API requests https://www.getpostman.com


