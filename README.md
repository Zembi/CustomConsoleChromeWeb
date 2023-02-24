<h2 align='center'>CustomConsoleChromeWeb</h2>
Created a custom web console, using it on my projects, for my convience. You can try it out, too. It is not completed yet, as there are a lot of things I want
to add on. The idea is that after following the steps down below, by calling the function console.log(), the messages will be displayed in the custom Console
and not, in the default one of your broswer. Future versions will be posted, so if you are interested, be aware! New ideas would be appreciated.
<br>
<hr>
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
2-Create the Console object, through your Js script, by adding the following line:

    const consoleObj = new Console();


3-Finally, the custom console is ready for usage.

    //.... any call of the console.log() function from now on, will be executed, only in the custom Console
<hr>    
<h3 align='center'>Be aware of</h3>

> (**_TIP_**): Custom Console, currently, is a debugging tool rather than a copy of the default console, as it starts working, only after html is loaded.
               Therefore, it is essential to understand that any messages that are coming from other apis or server requests, will not be appeared in the
               custom Console, but instead to the web one. I recommend you placing the initialization of the Console object, to the section where is to add
               your Js code, exactly after the last element of HTML and before any other script.

> (**_!WARNING!_**): This will result in overwriting the console.log() function and so no messages will be shown in the web console of your broswer.
<hr>
<h3 align='center'>Functions To Interact</h3>
<ol>
    <li>
    You can always disable the custom Console, by calling the function <b><i>disable()</i></b>. This will lead back to the default function of console.log(). 
    You can, also, enable it back again, by calling the function <b><i>enable()</i></b>.  

    // Disable custom console
    consoleObj.disable();

    // Enable it back again
    consoleObj.enable();  
 </li>
