<h2 align='center'>CustomConsoleChromeWeb</h2>
Created my own console, using it to my projects, for my convience. You can try it out, too.
The idea is that after following the steps, down below, by calling the function console.log(), the messages will be appeared in the custom Console and not in the Chrome's console.
Future versions will be posted, so if you are interested, be aware! Any new ideas about its development, will be appreciated.
<br>
<h3 align='center'>IN HEADER TAG</h3>
1-Import the console to your project, by adding to header the following line:
    
    <header>
        // ...
        // ...
        <script type="text/javascript" src='https://zembi.github.io/CustomConsoleChromeWeb-V.1/docs/Console.js'></script>
        // ...
        // ...
    </header>
<h3 align='center'>IN BODY TAG</h3>
2-In html, inside the body element, add an empty div with just one id of your choice or just add the following line:

    <div id='consoleIn'></div>


3-Creating the object of Console, through your Js script, by adding the following lines:

    const consoleElmnt = document.getElementById('consoleIn'); // same ID with step 2 div
    const consoleObj = new Console(consoleElmnt);


4-Finally, to activate the functionality of Console, call the function start()

    consoleObj.start(); // consoleObj is the variable that contains the Console object (see previous step)
    //.... any call of the console.log() function from now on, will be executed, only in the custom Console
    
> (**!_TIP_!**): Custom Console, currently, is a debugging tool rather than a copy of the default console, as it starts working, only after html is loaded.
>               Therefore, it is essential that you understand that any messages that is to be shown in console from other apis or server requests, will not
>               be appeared in the custom Console, but in the default one. I recommend you to intialize the Console object, exactly after the last element of
>               html and before any other script.
<br>
> (**!_WARNING_!**): This will result in overwriting the console.log() function and so no messages will be shown in the default console of Chrome.

You can always disable the custom Console, by stop calling the function start(). This will lead to the default functionality of<br>
console.log(), again. No need to delete the object everytime you decide to work with the Chrome's console!
