<h2 align='center'>CustomConsoleChromeWeb</h2>
Created a custom web console, using it on my projects, for my convience. You can try it out, too.
The idea is that after following the steps down below, by calling the function console.log(), the messages will be appeared in the custom Console and not, in the default one of your broswer.
Future versions will be posted, so if you are interested, be aware! Any ideas about its development, will be appreciated.
<br>
<h3 align='center'>IN HEADER TAG</h3>
1-Import the console to your project, by adding to the header the following line:
    
    <header>
        // ...
        // .....
        <script type="text/javascript" src='https://zembi.github.io/CustomConsoleChromeWeb-V.1/docs/Console.js'></script>
        // .....
        // ...
    </header>
    
<h3 align='center'>IN BODY TAG</h3>
2-In HTML, inside the body element, add an empty div with just one ID of your choice or just add the following line:

    <div id='consoleIn'></div>


3-Create the Console object, through your Js script, by adding the following lines:

    const consoleElmnt = document.getElementById('consoleIn'); // same ID with step 2 div
    const consoleObj = new Console(consoleElmnt);


4-Finally, to activate the Console, call the function start()

    consoleObj.start(); // consoleObj is the variable that contains the Console object (see previous step)
    //.... any call of the console.log() function from now on, will be executed, only in the custom Console
    
<h3 align='center'>Be aware of</h3>

> (**_TIP_**): Custom Console, currently, is a debugging tool rather than a copy of the default console, as it starts working, only after html is loaded.
               Therefore, it is essential to understand that any messages that are coming from other apis or server requests, will not be appeared in the
               custom Console, but instead to the web one. I recommend you placing the initialization of the Console object, to the section where is to add
               your Js code, exactly after the last element of HTML and before any other script.

> (**_!WARNING!_**): This will result in overwriting the console.log() function and so no messages will be shown in the web console of your broswer.

You can always disable the custom Console, by stop calling the function start(). This will lead to the default functionality of<br>
console.log(), again. No need to delete the object everytime you decide to work with the Chrome's console!
    
    // either turn the line to comment
    // consoleObj.start();
    
    // or disabling it [which returns console.log() to default and any call after this, will be displayed in the original web console]
    consoleObj.disable();
