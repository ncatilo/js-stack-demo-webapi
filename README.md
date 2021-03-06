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
    
2.  Install **mongodb**:

In Docker, run the following command:

```
docker run --name mongo-db -d mongo -p 27017:27017
```

Or from https://www.mongodb.com and run it in the background from the terminal.
    
    As an option, specify to parameter, **--dbpath** the desired local disk path where you wish the data files to be stored on your machine.

    e.g. Windows cmd line below

    ```
    "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath "C:\mongo-data"
    ```

3. In Visual Studio Code, press F5 on Windows or Play button on Mac to launch the build under http://localhost:3000 in debug mode.

## Useful development tools to download and install

- Robomongo - MongoDB management tool http://robomongo.org/
- Postman - GUI tool to test API requests https://www.getpostman.com


