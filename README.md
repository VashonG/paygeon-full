
  ## Requirements
  
  For development, you will only need Node.js and a node global package.
  
  ### Node
  - #### Node installation on Windows
  
    Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have 'git' available in your PATH, 'npm' might need it (You can find git [here](https://git-scm.com/)).
  
  - #### Node installation on Ubuntu
  
    You can install nodejs and npm easily with apt install, just run the following commands.
  
        $ sudo apt install nodejs
        $ sudo apt install npm
  
  - #### Other Operating Systems
    You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).
  
  If the installation was successful, you should be able to run the following command.
  
      $ node --version
      v8.11.3
  
      $ npm --version
      6.1.0
  
  If you need to update 'npm', you can make it using 'npm'! Cool right? After running the following command, just open again the command line and be happy.
      $ npm install npm -g
  
  ## Project-Setup
  after all setup you must to go bizzy3932/project/
  open terminal and run given below command


      $ npm install

  
  
  ## Database-Setup
  now you must to go the given folder bizzy3932/dump/project_747fy36r61t3002j531x9ki1zj15
  open terminal and run given below command


      $ mongorestore --db project_747fy36r61t3002j531x9ki1zj15 --verbose project_747fy36r61t3002j531x9ki1zj15/

  
  ## Project-Run
  go to bizzy3932/project/
  run given below command

      $ node index.js
  