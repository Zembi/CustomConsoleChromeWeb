# CustomConsoleChromeWeb
Created my own console, using it to my projects, for my convience. You can try it out, too.<br>
The idea is that after following the steps, down below, by calling the function console.log(), the messages will be appeared in the custom Console and not in the Chrome's console.<br>
Future versions will be posted, so if you are interested, be aware! Any new ideas about its development, will be appreciated.
<img src="header.svg" width="800" height="400">
<span style='width: 100%; text-align: center;'>HEADER</span>
<br>
1-Import the console to your project, by adding to header the following line:
    
    <header>
        // ...
        // ...
        <script type="text/javascript" src='https://zembi.github.io/CustomConsoleChromeWeb-V.1/docs/Console.js'></script>
        // ...
        // ...
    </header>

<span>BODY</span><br>
2-In html, inside the body element, add an empty div with just one id of your choice or just add the following line:

    <div id='consoleIn'></div>


3-Creating the object of Console, through your Js script, by adding the following lines:

    const consoleElmnt = document.getElementById('consoleIn'); // same ID with step 2 div
    const consoleObj = new Console(consoleElmnt);


4-Finally, to activate the functionality of Console, call the function start()

    consoleObj.start(); // consoleObj is the variable that contains the Console object (see previous step)
    //.... any call of the console.log() function from now on, will be executed, only in the custom Console
    
(!Warning!): This will result in overwriting the console.log() function and so no messages will be shown in the default console of Chrome.<br>
You can always disable the custom Console, by stop calling the function start(). This will lead to the default functionality of<br>
console.log(), again. No need to delete the object everytime you decide to work with the Chrome's console!
