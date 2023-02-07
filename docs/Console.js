
// CALL THE CSS FILE OF CONSOLE
var onlyOnce = (function () {
  var executed = false;
  return function () {
    if (!executed) {
      var cssId = 'overallConsoleStyleFromWeb';
      if (!document.getElementById(cssId)) {
        var head = document.querySelector('head');
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        // link.href = 'https://zembi.github.io/CustomConsoleChromeWeb-V.1/docs/style.css';
        link.href = 'docs/style.css';
        link.media = 'all';
        head.appendChild(link);
      }

      executed = true;
    }
  };
})();

onlyOnce();

// DO NOT USE CONSOLE.LOG FUNCTION ANYWHERE HERE
// EITHER DISABLE THE FUNCTION OR USE OTHER TYPES OF DEBUG TOO
class Console {
  started;
  enabOrDisab;
  consoleDefaultFunc;
  constructor(consoleElmnt) {
    this.started = false;
    this.enabOrDisab = true;
    this.consoleElmnt = consoleElmnt;

    this.consoleStatus = false;

    this.consoleIndexSymbol = '>>';

    this.alignContent = null;
    this.nextAlign = null;

    this.counter = -1;

    this.consoleSize = null;

    // VALUES OF VARS
    this.consoleUniCode = 'HSQL0219';
    // LOCAL STORAGE
    this.localStorageVarString = 'overallConsoleStatus' + this.consoleUniCode;
    // CSS
    this.consoleChangeHeightCssVar = '--consoleChangeHeight' + this.consoleUniCode;
    this.flexDirectCssVar = '--flexDirect' + this.consoleUniCode;
    this.consoleAlignCssVar = '--consoleAlign' + this.consoleUniCode;
  }

  coreConsoleElements() {
    this.consoleBtn = this.consoleElmnt.querySelector('#consoleTitle').querySelector('button');
    this.consoleContentElmnt = this.consoleElmnt.querySelector('#consoleContent');
  }

  get GetAlign() {
    return this.alignContent;
  }
  set SetAlign(value) {
    this.alignContent = value.toLowerCase();
  }

  get GetNextAlign() {
    return this.nextAlign;
  }
  set SetNextAlign(value) {
    this.nextAlign = value.toLowerCase();
  }

  get GetConsoleCurrentHeight() {
    return this.consoleSize;
  }
  set SetConsoleCurrentHeight(newConsoleSize) {
    this.consoleSize = newConsoleSize;
  }

  start() {
    if (!this.started) {
      this.structureTheObject();
      this.started = true;
    }
    else {
    }
  }

  structureTheObject() {
    this.htmlConsoleStructure();
    this.coreConsoleElements();

    this.resizeConsole(this.consoleChangeHeightCssVar, '25%');
    this.initializationMessage();
    this.addNewLineToConsole('msg', 'Test line');

    this.consoleStatusCheckFromLocalStorage();
    this.consoleCoreButtonsEvents();
    this.enableConsoleLogEvent();
    this.enable();

    this.shortcutEvents();
  }

  htmlConsoleStructure() {
    this.consoleElmnt.classList.add('consoleMainElement');

    this.consoleElmnt.classList.add('closedCoreConsole');
    this.consoleElmnt.title = 'Alt + C';

    this.consoleElmnt.innerHTML = `
      <div id='consoleTitle'>
        <button class='closedCoreConsoleBtn consoleImportantFocus'>
          <h2>Console</h2>
        </button>
      </div>

      <div class='closedCoreConsoleContent' id='consoleContent'></div>

      <div id='consoleBtns'>
        <button class='imprtntConsoleBtn' id='changeConsoleAlignBtn' title='Alt + Q'></button>
        <button class='imprtntConsoleBtn' id='clearConsoleBtn' title='Alt + W'>Clear</button>
        <select class='imprtntConsoleBtn' id='sizesOfCoreConsoleSlct' title='Alt + E'>
              <option value='calc(100% - 32px)'>100%</option>
              <option value='65%'>65%</option>
              <option value='50%'>50%</option>
              <option value='35%'>35%</option>
              <option value='25%'>25%</option>
        </select>
      </div>`;
  }

  // GET TRACE AS STRING SO I CAN SHOW THE LINE OF MESSAGE ON MY CONSOLE
  getStackTraceImportant(urlAndLine = null) {
    // IF URL AND LINE DOESNT EXIST YET
    if (urlAndLine === null) {
      urlAndLine = Error().stack;
    }

    let ar = urlAndLine.split('\n');
    let lastLine = ar[ar.length - 1];

    // IMPORTANT URL TO SHOW WHERE MESSAGE CAME FROM, ON CONSOLE
    let lastUrl = lastLine.split(' ');
    lastUrl = lastUrl[lastUrl.length - 1];

    // SPLIT URL AND GET FILE LOCATION AS WELL AS LINE NUMBER
    let urlEnd = lastUrl.substring(lastUrl.length, -lastUrl.lastIndexOf('/'));
    let urlImprtEnd = urlEnd.substring(0, urlEnd.lastIndexOf(':'));
    let fileAndLine = urlImprtEnd.substring(urlImprtEnd.lastIndexOf('/') + 1, urlImprtEnd.length);
    let file = fileAndLine.substring(0, fileAndLine.lastIndexOf(':'));
    if (file === '') {
      file = '(index)';
    }
    let line = fileAndLine.substring(fileAndLine.lastIndexOf(':') + 1, fileAndLine.length);

    return { file, line };
  }

  // FUNCTION THAT HELPS TRACE THE LINE OF THE MESAGE IN CONSOLE
  enableConsoleLogEvent() {
    this.consoleDefaultFunc = console.log;

    let thisObj = this;
    // ----------CONSOLE LOG CASE----------
    // window.console.log = function (message) {
    //   let urlLine = thisObj.getStackTraceImportant();
    //   const msgAndInfo = { message, file: urlLine.file, line: urlLine.line };

    //   thisObj.addNewLineToConsole('msg', msgAndInfo);
    // }

    // ----------ERROR CASE----------
    window.onerror = function (error, url, line, column, errorObj) {
      let urlLine = thisObj.getStackTraceImportant(errorObj.stack);

      thisObj.addNewLineToConsole('err', { message: errorObj, file: urlLine.file, line: urlLine.line });
    }
  }
  // fel

  // STATUS INITIALIZATION
  consoleStatusCheckFromLocalStorage() {
    let localStoreStatus = JSON.parse(localStorage.getItem(this.localStorageVarString));

    if (localStoreStatus == null || localStoreStatus[0] == false) {
      //DEFAULT
      this.closeConsole();
    }
    else {
      this.openConsole();
    }

    // HEIGHT INITIALIZATION
    if (localStoreStatus != null) {
      let consoleHeight = localStoreStatus[1];
      let arrOptions = Array.from(this.consoleElmnt.querySelector('#sizesOfCoreConsoleSlct').querySelectorAll('option'));

      arrOptions.map((option) => {
        if (option.value === consoleHeight) {
          this.consoleElmnt.querySelector('#sizesOfCoreConsoleSlct').value = option.value;
        }
      });
      //consoleHeight = consoleHeight.slice(0, consoleHeight.indexOf('%'));
      this.resizeConsole(this.consoleChangeHeightCssVar, consoleHeight);
    }

    // ALIGN INITIALIZATION
    if (localStoreStatus != null) {
      this.initialAlign(this.flexDirectCssVar, this.consoleAlignCssVar, localStoreStatus[2]);
    }
    else {
      this.initialAlign(this.flexDirectCssVar, this.consoleAlignCssVar, 'center');
    }

    let buttonInfo = this.nextAlign.toUpperCase();
    this.consoleElmnt.querySelector('#changeConsoleAlignBtn').innerHTML = `Align [${buttonInfo}]`;


    this.consoleBtn.addEventListener('click', () => {
      if (this.consoleElmnt.classList.contains('openCoreConsole')) {
        this.closeConsole();
      }
      else {
        this.openConsole();
      }

      let consoleFunct = [this.getConsoleCurrentStatus(), this.consoleSize, this.alignContent];
      consoleFunct = JSON.stringify(consoleFunct);
      localStorage.setItem(this.localStorageVarString, consoleFunct);
    });

    let consoleFunct = [this.getConsoleCurrentStatus(), this.consoleSize, this.alignContent];
    consoleFunct = JSON.stringify(consoleFunct);
    localStorage.setItem(this.localStorageVarString, consoleFunct);
  }

  // CORE CONSOLE FUNCTIONS
  consoleCoreButtonsEvents() {
    // ALIGN CONSOLE EVENT
    this.consoleElmnt.querySelector('#changeConsoleAlignBtn').addEventListener('click', () => {
      this.changeAlign(this.consoleAlignCssVar);

      let buttonInfo = this.nextAlign.toUpperCase();
      this.consoleElmnt.querySelector('#changeConsoleAlignBtn').innerHTML = `Align[${buttonInfo}]`;

      let consoleFunct = [this.getConsoleCurrentStatus(), this.consoleSize, this.alignContent];
      consoleFunct = JSON.stringify(consoleFunct);
      localStorage.setItem(this.localStorageVarString, consoleFunct);
    });

    // CLEAR CONSOLE EVENT
    this.consoleElmnt.querySelector('#clearConsoleBtn').addEventListener('click', () => {
      this.clearConsoleEvent();
    });

    // CHANGE SIZE CONSOLE EVENT
    this.consoleElmnt.querySelector('#sizesOfCoreConsoleSlct').addEventListener('change', () => {
      let newHeight = this.consoleElmnt.querySelector('#sizesOfCoreConsoleSlct').value;
      this.resizeConsole(this.consoleChangeHeightCssVar, newHeight);


      let consoleFunct = [this.getConsoleCurrentStatus(), this.consoleSize, this.alignContent];
      consoleFunct = JSON.stringify(consoleFunct);
      localStorage.setItem(this.localStorageVarString, consoleFunct);
    });
  }


  initializationMessage() {
    this.consoleContentElmnt.innerHTML += `
      <div class='newConsoleLine'>
        <p class='intiliazedLineOfConsole'>
          --------------------------------------------------------------------------
         <br>
            | Welcome to custom Console |
         <br>
              | Important console functions under output |
         <br>
                --------------------------------------------------------------------------
         </p>
      </div>`;


  }

  // UPDATE IF CONSOLE IS OPENED OR CLOSED BY RETURNING TRUE FOR OPENED AND FALSE FOR CLOSED
  getConsoleCurrentStatus() {
    let status;

    if (this.consoleElmnt.classList.contains('openCoreConsole')) {
      return true;
    }
    else if (this.consoleElmnt.classList.contains('closedCoreConsole')) {
      return false;
    }
  }

  addNewLineToConsole(typeOfMsg, msgfileLocLine) {
    let consolePointer = document.getElementById('consolePointer');

    // IF IT ISN'T FIRST LINE OF CONSOLE
    if (consolePointer != null) {
      consolePointer.id = '';
      consolePointer.className = 'consoleCountPointer';
    }

    let consoleLastLine = `
      <div class='newConsoleLine' id='lastLineInConsole'>
        <hr>
        <div class='lastLineInConsole'>
          <span id='consolePointer'>${this.consoleIndexSymbol}</span>
          <span id='consolePointerPar'></span>
        </div>
      </div>`;

    if (this.counter < 0) {
      this.consoleContentElmnt.innerHTML += consoleLastLine;
    }
    else {

      // DELETE LAST LINE OF CONSOLE AND RECREATE IT AFTER
      document.getElementById('lastLineInConsole').remove();

      // NUMBER COUNT CONSOLE
      let finalCountForm = (this.counter + 1) + ':';
      if (this.counter < 9) {
        finalCountForm = '0' + finalCountForm;
      }


      this.consoleContentElmnt.innerHTML += `
        <hr>
        <div class='newConsoleLine'>
          <span class='consoleCountPointer'>${finalCountForm}</span>
          <span class='consoleLineContent' id='consoleObj${this.counter}'></span>
        </div>
        ${consoleLastLine}`;

      let parentOfObj = document.querySelector(`#consoleObj${this.counter}`);

      let consoleObjIdElmnts = { mainC: this.counter, secondaryC: 0 };
      const consoleObj = new ConsoleLine(parentOfObj, msgfileLocLine, consoleObjIdElmnts, this, typeOfMsg);
      consoleObj.start();
    }

    this.consoleContentElmnt.scrollTop = this.consoleContentElmnt.scrollHeight;

    this.counter++;
  }

  closeConsole() {
    this.consoleElmnt.classList.remove('openCoreConsole');
    this.consoleElmnt.classList.add('closedCoreConsole');

    this.consoleBtn.classList.remove('openCoreConsoleBtn');
    this.consoleBtn.classList.add('closedCoreConsoleBtn');

    this.consoleContentElmnt.classList.remove('openCoreConsoleContent');
    this.consoleContentElmnt.classList.add('closedCoreConsoleContent');

    this.consoleStatus = false;

    let buttonsToDisable = Array.from(this.consoleElmnt.querySelectorAll('button:not(.consoleImportantFocus), input:not(.consoleImportantFocus), select'));

    buttonsToDisable.map((option) => {
      option.tabIndex = '-1';
      option.blur();
    });
  }

  openConsole() {
    this.consoleElmnt.classList.remove('closedCoreConsole');
    this.consoleElmnt.classList.add('openCoreConsole');

    this.consoleBtn.classList.remove('closedCoreConsoleBtn');
    this.consoleBtn.classList.add('openCoreConsoleBtn');

    this.consoleContentElmnt.classList.remove('closedCoreConsoleContent');
    this.consoleContentElmnt.classList.add('openCoreConsoleContent');

    this.consoleStatus = true;

    let buttonsToDisable = Array.from(this.consoleElmnt.querySelectorAll('button:not(.consoleImportantFocus), input, select'));

    buttonsToDisable.map((option) => {
      option.tabIndex = '0';
    });
  }

  initialAlign(flexDirect, consoleAlignCssVar, currAlign) {
    let root = document.querySelector(':root');

    currAlign = currAlign.toLowerCase();

    root.style.setProperty(flexDirect, 'row');
    root.style.setProperty(consoleAlignCssVar, currAlign);

    this.alignContent = currAlign;
    if (currAlign === 'center') {
      this.nextAlign = 'left';
    }
    else {
      this.nextAlign = 'center';
    }

    document.getElementById('consolePointer').innerHTML = this.consoleIndexSymbol;
  }

  changeAlign(consoleAlignCssVar) {
    let root = document.querySelector(':root');

    if (this.alignContent === 'center') {
      this.nextAlign = this.alignContent;
      this.alignContent = 'left';
    }
    else {
      this.nextAlign = this.alignContent;
      this.alignContent = 'center';
    }

    root.style.setProperty(consoleAlignCssVar, this.alignContent);
  }

  clearConsoleEvent() {
    this.counter = -1;
    document.getElementById('consoleContent').innerHTML = '';
    this.initializationMessage();
    this.addNewLineToConsole('msg', 'Test line');
  }

  resizeConsole(consoleHeightCssVar, newHeight) {
    let root = document.querySelector(':root');
    root.style.setProperty(consoleHeightCssVar, newHeight);
    this.consoleSize = newHeight;
  }

  // ADD SHORTCUT KEYS AND EVENTS
  shortcutEvents() {
    document.addEventListener('keydown', (e) => {
      let specialKey = e.altKey;

      if (e.key.toLowerCase() === 'c' && specialKey) {
        this.consoleBtn.click();
        e.preventDefault();
      }

      // IMPORTANT CONSOLE BUTTONS
      if (e.key.toLowerCase() === 'q' && specialKey && this.consoleStatus) {
        this.consoleElmnt.querySelector('#changeConsoleAlignBtn').focus();
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'w' && specialKey && this.consoleStatus) {
        this.consoleElmnt.querySelector('#clearConsoleBtn').focus();
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'e' && specialKey && this.consoleStatus) {
        this.consoleElmnt.querySelector('#sizesOfCoreConsoleSlct').focus();
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'p' && specialKey) {
        localStorage.removeItem(this.localStorageVarString);
        e.preventDefault();
      }
    });
  }

  // PUBLIC EVENTS WITH THE OBJECT, FOR THE USER ->

  // OPTION OF THE USER TO DISABLE THE CONSOLE AND CONTINUE SHOWING MESSAGES IN THE WEB CONSOLE
  disable() {
    if (this.started && this.enabOrDisab) {
      let buffer = window.console.log;
      window.console.log = this.consoleDefaultFunc;
      this.consoleDefaultFunc = buffer;
      this.enabOrDisab = false;
    }
  }

  enable() {
    if (this.started && !this.enabOrDisab) {
      let buffer = window.console.log;
      window.console.log = this.consoleDefaultFunc;
      this.consoleDefaultFunc = buffer;
      this.enabOrDisab = true;
    }
  }

  DomString() {
    let h = `
    <div id='consoleTitle'>
      <button class='closedCoreConsoleBtn consoleImportantFocus'>
        <h2>Console</h2>
      </button>
    </div>`;

    let ddd = 'consoleMainElement';

    ddd = 'closedCoreConsole';
    ddd = 'Alt + C';

    // let string = `
    // <div id='consoleTitle'>
    //   <button class='closedCoreConsoleBtn consoleImportantFocus'>
    //     <h2>Console</h2>
    //   </button>
    // </div>

    // <div class='closedCoreConsoleContent' id='consoleContent'></div>

    // <div id='consoleBtns'>
    //   <button class='imprtntConsoleBtn' id='changeConsoleAlignBtn' title='Alt + Q'></button>
    //   <button class='imprtntConsoleBtn' id='clearConsoleBtn' title='Alt + W'>Clear</button>
    //   <select class='imprtntConsoleBtn' id='sizesOfCoreConsoleSlct' title='Alt + E'>
    //         <option value='calc(100% - 32px)'>100%</option>
    //         <option value='65%'>65%</option>
    //         <option value='50%'>50%</option>
    //         <option value='35%'>35%</option>
    //         <option value='25%'>25%</option>
    //   </select>
    // </div>'`;
    // let string2 = `<span style='background: red'>fefejfejfhejfhejf</span>`;

    ddd = `
    <div id='consoleTitle'>
      <button class='closedCoreConsoleBtn consoleImportantFocus'>
        <h2>Console</h2>
      </button>
    </div>

    <div class='closedCoreConsoleContent' id='consoleContent'></div>

    <div id='consoleBtns'>
      <button class='imprtntConsoleBtn' id='changeConsoleAlignBtn' title='Alt + Q'></button>
      <button class='imprtntConsoleBtn' id='clearConsoleBtn' title='Alt + W'>Clear</button>
      <select class='imprtntConsoleBtn' id='sizesOfCoreConsoleSlct' title='Alt + E'>
            <option value='calc(100% - 32px)'>100%</option>
            <option value='65%'>65%</option>
            <option value='50%'>50%</option>
            <option value='35%'>35%</option>
            <option value='25%'>25%</option>
      </select>
    </div>`;
  }
}


class ConsoleLine {
  // ------START SECTOR => CORE OF CLASS------
  constructor(parentOfObj, obj, thisIdElmtns, consoleObj, typeOfLine, specialOperation) {
    this.coreParentOfObj = parentOfObj;
    this.parentOfObj = parentOfObj;
    this.obj = obj.message;
    this.parentOfFileAndLine = null;
    this.fileLoc = obj.file;
    this.lineNum = obj.line;
    this.thisIdElmtns = thisIdElmtns;
    this.consoleObj = consoleObj;
    this.typeOfLine = typeOfLine;
    this.specialOperation = specialOperation || null;

    // IN VARS
    this.typeOf = null;
    this.btn;
    this.uniqueId = this.thisIdElmtns.mainC + '' + this.thisIdElmtns.secondaryC;
  }

  start() {
    if (this.isFirstLineOfMessage()) {
      this.prototypeMsgLineOfConsole();
    }

    if (this.typeOfLine === 'msg') {
      let fullLine = true;
      if (this.specialOperation === 'mixedInLine') {
        this.typeOf = 'mixed';
        fullLine = false;
      }

      if (this.specialOperation === 'forMapEntries') {
        this.typeOf = 'mapEntries';
        this.lineIsMixedObjs(fullLine);
      }
      else if (this.specialOperation === 'forSetEntries') {
        this.typeOf = 'setEntries';
        this.lineIsMixedObjs(fullLine);
        // this.basicStructureItems(fullLine);
      }
      else {
        this.basicStructureItems(fullLine);
      }
    }
    else if (this.typeOfLine === 'err') {
      this.isErrorLineOfConsole();
    }

    if (this.isFirstLineOfMessage()) {
      this.fileLocAndLineToShowIfNeeded();
    }
  }

  basicStructureItems(fullLine) {
    if (typeof this.obj === 'object' && this.obj !== null) {
      if (this.isNode(this.obj)) {
        this.typeOf = 'dom';
        this.lineIsDom(fullLine);
      }
      else if (this.isNodeList(this.obj)) {
        this.typeOf = 'nodeList';
        this.lineIsNodeList(fullLine);
      }
      else if (this.isArray(this.obj)) {
        this.obj.sort();
        this.typeOf = 'arrList';
        this.lineIsArrayList(fullLine);
      }
      else if (this.isMap(this.obj)) {
        this.typeOf = 'map';
        if (this.specialOperation === '__entries__') {
          this.lineIsEntries();
        }
        else {
          this.lineIsMap(fullLine);
        }
      }
      else if (this.isSet(this.obj)) {
        this.typeOf = 'set';
        if (this.specialOperation === '__entries__') {
          this.lineIsEntries();
        }
        else {
          this.lineIsSet(fullLine);
        }
      }
      else if (typeof this.obj === 'object') {
        this.typeOf = 'sObj';
        this.lineIsSimpleObject(fullLine);
      }
    }
    else if (this.isFunction(this.obj)) {
      this.typeOf = 'func';
      this.lineIsFunctionOrClass(fullLine);
    }
    else if (this.isBoolean(this.obj)) {
      this.typeOf = 'boolean';
      this.lineIsBoolean();
    }
    else if (this.isNumber(this.obj)) {
      this.typeOf = 'number';
      this.lineIsNumber();
    }
    else if (this.isBigInt(this.obj)) {
      this.typeOf = 'bigInt';
      this.lineIsBigInt();
    }
    else if (this.isString(this.obj)) {
      this.typeOf = 'string';
      this.lineIsString();
    }
    else if (this.isSymbol(this.obj)) {
      this.typeOf = 'string';
      this.lineIsSymbol();
    }
    else if (this.obj === null) {
      this.typeOf = 'null';
      this.lineIsNullOrUndefined('null');
    }
    else if (this.obj === undefined) {
      this.typeOf = 'undef';
      this.lineIsNullOrUndefined('undefined');
    }
  }
  // ------END SECTOR <= CORE OF CLASS------





  // ------START SECTOR => CHECKPOINTS------
  isNode(key) {
    return (key && key.nodeType);
    // return (typeof Node === 'object' ? key instanceof Node : key);
  }
  isNodeList(key) {
    return (key instanceof NodeList);
  }
  isArray(key) {
    return (Array.isArray(key));
  }
  isMap(key) {
    return (key instanceof Map);
  }
  isSet(key) {
    return (key instanceof Set);
  }
  isFunction(key) {
    return (key && {}.toString.call(key) === '[object Function]');
  }
  isBoolean(key) {
    return (typeof key === 'boolean');
  }
  isNumber(key) {
    return (typeof key === 'number');
  }
  isBigInt(key) {
    return (typeof key === 'bigint');
  }
  isString(key) {
    return (typeof key === 'string');
  }
  isSymbol(key) {
    return (typeof key === 'symbol');
  }

  isFirstLineOfMessage() {
    return (this.fileLoc !== null && this.lineNum !== null);
  }
  // ------END SECTOR <= CHECKPOINTS------





  // ------START SECTOR => FIRST OBJ OF CURRENT LINE------
  prototypeMsgLineOfConsole() {
    this.parentOfObj.parentNode.classList.add('newConsoleLineWrapMsg');
    this.parentOfObj.classList.add('newConsoleLineMsg');

    let spanMsgPar = document.createElement('span');
    spanMsgPar.className = 'msgConsolePar';
    this.parentOfObj.appendChild(spanMsgPar);

    let spanErFileAndNum = document.createElement('div');
    spanErFileAndNum.className = 'msgConsoleMainAndDestinLine';
    this.parentOfObj.appendChild(spanErFileAndNum);

    this.parentOfObj = spanMsgPar;
    this.parentOfFileAndLine = spanErFileAndNum;
  }
  // ------END SECTOR <= FIRST OBJ OF CURRENT LINE------





  // ------START SECTOR => ERROR------
  isErrorLineOfConsole() {
    let errorObj = this.obj;

    this.coreParentOfObj.parentNode.classList.add('newConsoleLineWrapError');
    this.coreParentOfObj.classList.add('newConsoleLineError');

    this.parentOfObj.classList.add('errorConsolePar');
    // this.parentOfObj.innerHTML = errorObj.stack;
    this.parentOfObj.innerHTML = '<span>' + this.customizeErrorMessageStack(errorObj); + '</span>';

    this.parentOfFileAndLine.innerHTML = '';
    this.parentOfFileAndLine.classList.add('errorConsoleMainAndDestinLine');

    let spanMsg = document.createElement('span');
    spanMsg.className = 'errorMainConsoleDestinLine';
    spanMsg.innerHTML = 'Error';
    this.parentOfFileAndLine.appendChild(spanMsg);
    let spanInfo = document.createElement('span');
    spanInfo.className = 'errorConsoleDestinLine';
    this.parentOfFileAndLine.appendChild(spanInfo);
    this.parentOfFileAndLine = spanInfo;
  }

  customizeErrorMessageStack(errorObj) {
    let stackAr = errorObj.stack.split('\n');
    let result = stackAr[0] + '\n';

    // REMOVE FIRST ELEMENT OF ARRAY AS IT DOESN'T CONTAIN URL
    stackAr.shift();

    stackAr.forEach((line) => {
      // IMPORTANT URL TO SHOW WHERE MESSAGE CAME FROM, ON CONSOLE
      let lastUrl = line.split(' ');
      lastUrl = lastUrl[lastUrl.length - 1];

      let urlWithParenth = '';

      let containsParenthesis = false;
      if (lastUrl[0] === '(' && lastUrl[lastUrl.length - 1] === ')') {
        urlWithParenth = lastUrl;
        lastUrl = lastUrl.slice(1);
        lastUrl = lastUrl.substring(0, lastUrl.length - 1);
        containsParenthesis = true;
      }

      // SPLIT URL AND GET FILE LOCATION AS WELL AS LINE NUMBER
      let urlImprtEnd = lastUrl.substring(lastUrl.lastIndexOf('/') + 1, lastUrl.length);

      // IF EMPTY FILE LOCATION, SET INDEX AS THE FILE LOCATION
      let checkIfIndex = urlImprtEnd.substring(0, urlImprtEnd.indexOf(':'));
      if (checkIfIndex === '') {
        urlImprtEnd = '(index)' + urlImprtEnd;
      }

      let newLine = '';
      if (containsParenthesis) {
        newLine = line.replace(urlWithParenth, '(<span class="errorUrlChangedToLastFile">' + urlImprtEnd + '</span>)\n');
      }
      else {
        newLine = line.replace(lastUrl, '<span class="errorUrlChangedToLastFile">' + urlImprtEnd + '</span\n');
      }
      result += newLine;
    });

    return result;
  }
  // ------END SECTOR <= ERROR------





  // ------START SECTOR => STRUCTURE LINE 1------
  // 1.CONSOLE LINE REACTION TO NODE OBJ
  lineIsDom(fullLine) {
    let currObjELmnt = this.parentOfObj;
    let objsChild = this.obj;
    if (objsChild.tagName === undefined) {
      this.lineIsDomAsHtml();
      this.lineIsSimpleObject();
    }
    else {
      const uniqueInId = this.uniqueId;
      const tagN = objsChild.tagName.toLowerCase();
      let id = '';
      if (objsChild.id !== '') {
        id = '#' + objsChild.id;
      }
      let classesAr = null;
      let classes = '';

      classesAr = objsChild.className.split(' ');

      classesAr.map((value) => {
        if (value !== '') {
          classes += '.' + value;
        }
      });

      // CREATE HTML PROTOTYPE
      let spanDom = document.createElement('span');
      spanDom.id = 'consoleDomWrap' + uniqueInId;
      spanDom.className = 'consoleDomWrap';
      currObjELmnt.appendChild(spanDom);

      let spanTagN = document.createElement('span');
      spanDom.id = 'consoleDomTagN' + uniqueInId;
      spanTagN.className = 'consoleDomTagN';
      spanTagN.innerHTML = tagN + '';
      spanDom.appendChild(spanTagN);

      let spanId = document.createElement('span');
      spanId.id = 'consoleDomId' + uniqueInId;
      spanId.className = 'consoleDomId';
      spanId.innerHTML = id;
      // spanDom.innerHTML += '_';
      spanDom.appendChild(spanId);

      let spanClasses = document.createElement('span');
      spanClasses.id = 'consoleDomClasses' + uniqueInId;
      spanClasses.className = 'consoleDomClasses';
      spanClasses.innerHTML = classes;
      spanDom.appendChild(spanClasses);

      const thisObj = this;
      document.addEventListener('mouseover', function (e) {
        const target = e.target.closest('#' + spanDom.id);

        if (target) {
          thisObj.consoleObj.consoleElmnt.style.background = 'transparent';
          objsChild.classList.add('consoleDomHoverMouse');

          // GET ALL PARENTS AND THEN FORCE THEM TO OVERFLOW
          let helper = objsChild;
          const parents = [];

          while (helper) {
            parents.unshift(helper);
            helper = helper.parentNode;
          }

          parents.map((value) => {
            // objsChild.classList.add('consoleDomHoverMouseOverflowForce');
          });
        }
      });

      document.addEventListener('mouseout', function (e) {
        const target = e.target.closest('#' + spanDom.id);

        if (target) {
          thisObj.consoleObj.consoleElmnt.style.background = 'rgb(55, 55, 55, 0.9)';
          objsChild.classList.remove('consoleDomHoverMouse');

          // GET ALL PARENTS AND THEN RELEASE THEM FROM OVERFLOW
          let helper = objsChild;
          const parents = [];

          while (helper) {
            parents.unshift(helper);
            helper = helper.parentNode;
          }

          parents.splice(0, 3);
          parents.map((value) => {
            // objsChild.classList.remove('consoleDomHoverMouseOverflowForce');
          });
        }
      });
    }
  }
  lineIsDomAsHtml(fullLine) {

  }

  // 2.CONSOLE LINE REACTION TO NODELIST
  lineIsNodeList(fullLine) {
    this.lineIsArrayList(fullLine);
  }

  // 3.CONSOLE LINE REACTION TO ARRAYLIST
  lineIsArrayList(fullLine) {
    // CREATE THE MAIN CORE OF HTML CONSOLE OBJECT LINE
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);

    // IF IT IS A FULL LINE OBJECT
    if (fullLine) {
      let btn = document.createElement('button');
      btn.className = 'consoleObjBtn';
      btn.id = 'consoleObjBtn' + this.uniqueId;
      wrapOfBtn.appendChild(btn);
      let btnImg = document.createElement('img');
      btnImg.className = 'consoleObjBtnImg';
      btnImg.id = 'consoleObjBtnImg' + this.uniqueId;
      btn.appendChild(btnImg);
      let btnPar = document.createElement('span');
      btnPar.className = 'consoleLineArrayParenthesis';
      btnPar.id = 'consoleLineArrayParenthesis' + this.uniqueId;
      btnPar.innerHTML = `(${this.obj.length})`;
      btn.appendChild(btnPar);
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;
      btnP.innerHTML = this.obj.constructor.name;
      btn.appendChild(btnP);

      let wrapObjInfo = document.createElement('span');
      wrapObjInfo.className = 'consoleObjLineWrapInfo closedConsoleObjLineInfo';
      wrapObjInfo.id = 'consoleObjLineWrapInfo' + this.uniqueId;
      wholeLineObj.appendChild(wrapObjInfo);
      let objInfo = document.createElement('div');
      objInfo.className = 'consoleObjLineInfo';
      objInfo.id = 'consoleObjLineInfo' + this.uniqueId;
      wrapObjInfo.appendChild(objInfo);

      const thisObj = this;
      // ADD CONSOLEOBJLINE'S BTN EVENT
      document.addEventListener('click', function (e) {
        const target = e.target.closest('#' + btn.id);

        if (target) {
          const store = {
            wholeLineObj: document.querySelector('#consoleObjLine' + thisObj.uniqueId),
            wrapOfBtn: document.querySelector('#beforeConsoleObjBtn' + thisObj.uniqueId),
            btn: document.querySelector('#consoleObjBtn' + thisObj.uniqueId),
            btnImg: document.querySelector('#consoleObjBtnImg' + thisObj.uniqueId),
            btnPar: document.querySelector('#consoleLineArrayParenthesis' + thisObj.uniqueId),
            btnP: document.querySelector('#consoleObjBtnP' + thisObj.uniqueId),
            wrapObjInfo: document.querySelector('#consoleObjLineWrapInfo' + thisObj.uniqueId),
            objInfo: document.querySelector('#consoleObjLineInfo' + thisObj.uniqueId)
          };

          store.btnP.classList.toggle('consoleObjBtnDecorate');
          store.btnImg.classList.toggle('consoleObjBtnOpenedImg');

          store.wrapObjInfo.classList.toggle('closedConsoleObjLineInfo');

          if (store.btnImg.classList.contains('consoleObjBtnOpenedImg')) {
            // OBJ'S CHILDREN CHECK
            for (const [key, value] of Object.entries(thisObj.obj)) {
              // OBJ'S CHILD PROTOTYPE
              let lineOfObj = document.createElement('p');
              lineOfObj.className = 'consoleArrayLineInfoP';
              store.objInfo.appendChild(lineOfObj);

              let keyObj = document.createElement('span');
              keyObj.className = 'consoleObjLineLeftSp';
              keyObj.innerHTML = key;
              lineOfObj.appendChild(keyObj);
              let splitObj = document.createElement('span');
              splitObj.className = 'consoleObjLineMidSp';
              splitObj.innerHTML = ':';
              lineOfObj.appendChild(splitObj);
              let valueObj = document.createElement('span');
              valueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
              lineOfObj.appendChild(valueObj);

              thisObj.createChildConsoleLine(valueObj, value);
            }

            thisObj.lineIsObjLength(store.objInfo);

            if (thisObj.specialOperation === '__proto__') {
              thisObj.lineGetSimpleMethods(store.objInfo);
              thisObj.lineGetters(store.objInfo);
              thisObj.lineSetters(store.objInfo);
            }

            thisObj.lineIsObjsPrototype(store.objInfo);
          }
          else {
            store.objInfo.innerHTML = '';
          }
        }
      });
    }
    // IF IT IS IN, A MIXED OF OBJECTS, LINE
    else {
      let btn = document.createElement('div');
      btn.className = 'consoleObjBtn';
      btn.id = 'consoleObjBtn' + this.uniqueId;
      wrapOfBtn.appendChild(btn);
      let btnPar = document.createElement('span');
      btnPar.className = 'consoleLineArrayParenthesis';
      btnPar.id = 'consoleLineArrayParenthesis' + this.uniqueId;
      btnPar.innerHTML = `(${this.obj.length})`;
      btn.appendChild(btnPar);
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP consoleObjPartLineBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;
      btnP.innerHTML = this.obj.constructor.name;
      btn.appendChild(btnP);
    }

    this.parentOfObj.appendChild(wholeLineObj);

    this.parentOfObj = wrapOfBtn;
  }

  // 4.CONSOLE LINE REACTION TO MAP
  lineIsMap(fullLine) {
    // CREATE THE MAIN CORE OF HTML CONSOLE OBJECT LINE
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);


    // IF IT IS A FULL LINE OBJECT
    if (fullLine) {
      let btn = document.createElement('button');
      btn.className = 'consoleObjBtn';
      btn.id = 'consoleObjBtn' + this.uniqueId;
      wrapOfBtn.appendChild(btn);
      let btnImg = document.createElement('img');
      btnImg.className = 'consoleObjBtnImg';
      btnImg.id = 'consoleObjBtnImg' + this.uniqueId;
      btn.appendChild(btnImg);
      let btnPar = document.createElement('span');
      btnPar.className = 'consoleLineArrayParenthesis';
      btnPar.id = 'consoleLineArrayParenthesis' + this.uniqueId;
      btnPar.innerHTML = `(${this.obj.size})`;
      btn.appendChild(btnPar);
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;
      btnP.innerHTML = this.obj.constructor.name;
      btn.appendChild(btnP);

      let wrapObjInfo = document.createElement('span');
      wrapObjInfo.className = 'consoleObjLineWrapInfo closedConsoleObjLineInfo';
      wrapObjInfo.id = 'consoleObjLineWrapInfo' + this.uniqueId;
      wholeLineObj.appendChild(wrapObjInfo);
      let objInfo = document.createElement('div');
      objInfo.className = 'consoleObjLineInfo';
      objInfo.id = 'consoleObjLineInfo' + this.uniqueId;
      wrapObjInfo.appendChild(objInfo);

      const thisObj = this;
      // ADD CONSOLEOBJLINE'S BTN EVENT
      document.addEventListener('click', function (e) {
        const target = e.target.closest('#' + btn.id);

        if (target) {
          const store = {
            wholeLineObj: document.querySelector('#consoleObjLine' + thisObj.uniqueId),
            wrapOfBtn: document.querySelector('#beforeConsoleObjBtn' + thisObj.uniqueId),
            btn: document.querySelector('#consoleObjBtn' + thisObj.uniqueId),
            btnImg: document.querySelector('#consoleObjBtnImg' + thisObj.uniqueId),
            btnPar: document.querySelector('#consoleLineArrayParenthesis' + thisObj.uniqueId),
            btnP: document.querySelector('#consoleObjBtnP' + thisObj.uniqueId),
            wrapObjInfo: document.querySelector('#consoleObjLineWrapInfo' + thisObj.uniqueId),
            objInfo: document.querySelector('#consoleObjLineInfo' + thisObj.uniqueId)
          };

          store.btnP.classList.toggle('consoleObjBtnDecorate');
          store.btnImg.classList.toggle('consoleObjBtnOpenedImg');

          store.wrapObjInfo.classList.toggle('closedConsoleObjLineInfo');

          if (store.btnImg.classList.contains('consoleObjBtnOpenedImg')) {
            thisObj.lineNeedsEntries(store.objInfo);

            thisObj.lineIsObjLength(store.objInfo);
            if (thisObj.specialOperation === '__proto__') {
              thisObj.lineGetSimpleMethods(store.objInfo);
              thisObj.lineGetters(store.objInfo);
              thisObj.lineSetters(store.objInfo);
            }

            thisObj.lineIsObjsPrototype(store.objInfo);
          }
          else {
            store.objInfo.innerHTML = '';
          }
        }
      });
    }
    // IF IT IS IN, A MIXED OF OBJECTS, LINE
    else {
      let btn = document.createElement('div');
      btn.className = 'consoleObjBtn';
      btn.id = 'consoleObjBtn' + this.uniqueId;
      wrapOfBtn.appendChild(btn);
      let btnPar = document.createElement('span');
      btnPar.className = 'consoleLineArrayParenthesis';
      btnPar.id = 'consoleLineArrayParenthesis' + this.uniqueId;
      btnPar.innerHTML = `(${this.obj.size})`;
      btn.appendChild(btnPar);
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP consoleObjPartLineBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;
      btnP.innerHTML = this.obj.constructor.name;
      btn.appendChild(btnP);
    }

    this.parentOfObj.appendChild(wholeLineObj);

    this.parentOfObj = wrapOfBtn;
  }

  // 5.CONSOLE LINE REACTION TO SET
  lineIsSet(fullLine) {
    // CREATE THE MAIN CORE OF HTML CONSOLE OBJECT LINE
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);


    // IF IT IS A FULL LINE OBJECT
    if (fullLine) {
      let btn = document.createElement('button');
      btn.className = 'consoleObjBtn';
      wrapOfBtn.appendChild(btn);
      btn.id = 'consoleObjBtn' + this.uniqueId;
      let btnImg = document.createElement('img');
      btnImg.className = 'consoleObjBtnImg';
      btnImg.id = 'consoleObjBtnImg' + this.uniqueId;
      btn.appendChild(btnImg);
      let btnPar = document.createElement('span');
      btnPar.className = 'consoleLineArrayParenthesis';
      btnPar.id = 'consoleLineArrayParenthesis' + this.uniqueId;
      btnPar.innerHTML = `(${this.obj.size})`;
      btn.appendChild(btnPar);
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;
      btnP.innerHTML = this.obj.constructor.name;
      btn.appendChild(btnP);

      let wrapObjInfo = document.createElement('span');
      wrapObjInfo.className = 'consoleObjLineWrapInfo closedConsoleObjLineInfo';
      wrapObjInfo.id = 'consoleObjLineWrapInfo' + this.uniqueId;
      wholeLineObj.appendChild(wrapObjInfo);
      let objInfo = document.createElement('div');
      objInfo.className = 'consoleObjLineInfo';
      objInfo.id = 'consoleObjLineInfo' + this.uniqueId;
      wrapObjInfo.appendChild(objInfo);

      const thisObj = this;
      // ADD CONSOLEOBJLINE'S BTN EVENT
      document.addEventListener('click', function (e) {
        const target = e.target.closest('#' + btn.id);

        if (target) {
          const store = {
            wholeLineObj: document.querySelector('#consoleObjLine' + thisObj.uniqueId),
            wrapOfBtn: document.querySelector('#beforeConsoleObjBtn' + thisObj.uniqueId),
            btn: document.querySelector('#consoleObjBtn' + thisObj.uniqueId),
            btnImg: document.querySelector('#consoleObjBtnImg' + thisObj.uniqueId),
            btnPar: document.querySelector('#consoleLineArrayParenthesis' + thisObj.uniqueId),
            btnP: document.querySelector('#consoleObjBtnP' + thisObj.uniqueId),
            wrapObjInfo: document.querySelector('#consoleObjLineWrapInfo' + thisObj.uniqueId),
            objInfo: document.querySelector('#consoleObjLineInfo' + thisObj.uniqueId)
          };

          store.btnP.classList.toggle('consoleObjBtnDecorate');
          store.btnImg.classList.toggle('consoleObjBtnOpenedImg');

          store.wrapObjInfo.classList.toggle('closedConsoleObjLineInfo');

          if (store.btnImg.classList.contains('consoleObjBtnOpenedImg')) {
            thisObj.lineNeedsEntries(store.objInfo);

            thisObj.lineIsObjLength(store.objInfo);
            if (thisObj.specialOperation === '__proto__') {
              thisObj.lineGetSimpleMethods(store.objInfo);
              thisObj.lineGetters(store.objInfo);
              thisObj.lineSetters(store.objInfo);
            }

            thisObj.lineIsObjsPrototype(store.objInfo);
          }
          else {
            store.objInfo.innerHTML = '';
          }
        }
      });
    }
    // IF IT IS IN, A MIXED OF OBJECTS, LINE
    else {
      let btn = document.createElement('div');
      btn.className = 'consoleObjBtn';
      wrapOfBtn.appendChild(btn);
      btn.id = 'consoleObjBtn' + this.uniqueId;
      let btnPar = document.createElement('span');
      btnPar.className = 'consoleLineArrayParenthesis';
      btnPar.id = 'consoleLineArrayParenthesis' + this.uniqueId;
      btnPar.innerHTML = `(${this.obj.size})`;
      btn.appendChild(btnPar);
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP consoleObjPartLineBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;
      btnP.innerHTML = this.obj.constructor.name;
      btn.appendChild(btnP);
    }

    this.parentOfObj.appendChild(wholeLineObj);

    this.parentOfObj = wrapOfBtn;
  }

  // 6.CONSOLE LINE REACTION TO CASUAL OBJ
  lineIsSimpleObject(fullLine) {
    // CREATE THE MAIN CORE OF HTML CONSOLE OBJECT LINE
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);


    // IF IT IS A FULL LINE OBJECT
    if (fullLine) {
      let btn = document.createElement('button');
      btn.className = 'consoleObjBtn';
      wrapOfBtn.appendChild(btn);
      btn.id = 'consoleObjBtn' + this.uniqueId;
      let btnImg = document.createElement('img');
      btnImg.className = 'consoleObjBtnImg';
      btnImg.id = 'consoleObjBtnImg' + this.uniqueId;
      btn.appendChild(btnImg);
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;

      // ---------SPECIAL EXCEPTIONS-----------
      // MATH CASE
      if (this.obj === Math) {
        btnP.innerHTML = '<span class="consoleObjLineMathInfo">Math</span>';
      }
      // REGEXP CASE
      else if (this.obj instanceof RegExp) {
        btnP.innerHTML = this.obj.constructor.name + '  /<span class="consoleObjLineRegExpInfo">' + this.obj.source + '</span>/';
      }
      // DATE CASE
      else if (this.obj instanceof Date) {
        btnP.innerHTML = '<span class="consoleObjLineDateInfo">' + this.obj + '</span>';
      }
      // JSON CASE
      else if (this.obj === JSON) {
        btnP.innerHTML = '<span class="consoleObjLineJSONInfo">JSON</span>';
      }
      // --------------------------------------
      else {
        btnP.innerHTML = this.obj.constructor.name;
      }

      btn.appendChild(btnP);

      let wrapObjInfo = document.createElement('span');
      wrapObjInfo.className = 'consoleObjLineWrapInfo closedConsoleObjLineInfo';
      wrapObjInfo.id = 'consoleObjLineWrapInfo' + this.uniqueId;
      wholeLineObj.appendChild(wrapObjInfo);
      let objInfo = document.createElement('div');
      objInfo.className = 'consoleObjLineInfo';
      objInfo.id = 'consoleObjLineInfo' + this.uniqueId;
      wrapObjInfo.appendChild(objInfo);

      const thisObj = this;
      // ADD CONSOLEOBJLINE'S BTN EVENT
      document.addEventListener('click', function (e) {
        const target = e.target.closest('#' + btn.id);

        if (target) {
          const store = {
            wholeLineObj: document.querySelector('#consoleObjLine' + thisObj.uniqueId),
            wrapOfBtn: document.querySelector('#beforeConsoleObjBtn' + thisObj.uniqueId),
            btn: document.querySelector('#consoleObjBtn' + thisObj.uniqueId),
            btnImg: document.querySelector('#consoleObjBtnImg' + thisObj.uniqueId),
            btnP: document.querySelector('#consoleObjBtnP' + thisObj.uniqueId),
            wrapObjInfo: document.querySelector('#consoleObjLineWrapInfo' + thisObj.uniqueId),
            objInfo: document.querySelector('#consoleObjLineInfo' + thisObj.uniqueId)
          };

          store.btn.classList.toggle('consoleObjBtnDecorate');
          store.btnImg.classList.toggle('consoleObjBtnOpenedImg');

          store.wrapObjInfo.classList.toggle('closedConsoleObjLineInfo');

          if (store.btnImg.classList.contains('consoleObjBtnOpenedImg')) {
            thisObj.lineGetVariables(store.objInfo);
            thisObj.lineGetStaticMethods(store.objInfo);

            if (thisObj.specialOperation === '__proto__') {
              thisObj.lineGetSimpleMethods(store.objInfo);
              thisObj.lineGetters(store.objInfo);
              thisObj.lineSetters(store.objInfo);
            }

            thisObj.lineIsObjSymbols(store.objInfo);

            thisObj.lineIsObjsPrototype(store.objInfo);

            // CHECK IF THIS.OBJ.VALUEOF EXISTS
            let checkNoError = true;
            try {
              (typeof thisObj.obj.valueOf() === "anything" && thisObj.obj.constructor.name === 'Anything');
            } catch (e) {
              checkNoError = false;
            }

            if (checkNoError) {
              if (typeof thisObj.obj.valueOf() === "boolean" && thisObj.obj.constructor.name === 'Boolean') {
                thisObj.lineIsObjsPrimitiveValue(store.objInfo, thisObj.obj.valueOf());
              }
              else if (typeof thisObj.obj.valueOf() === "number" && thisObj.obj.constructor.name === 'Number') {
                thisObj.lineIsObjsPrimitiveValue(store.objInfo, thisObj.obj.valueOf());
              }
              else if (typeof thisObj.obj.valueOf() === "string" && thisObj.obj.constructor.name === 'String') {
                thisObj.lineIsObjsPrimitiveValue(store.objInfo, thisObj.obj.valueOf());
              }
            }
          }
          else {
            store.objInfo.innerHTML = '';
          }
        }
      });
    }
    // IF IT IS IN, A MIXED OF OBJECTS, LINE
    else {
      let btn = document.createElement('div');
      btn.className = 'consoleObjBtn';
      wrapOfBtn.appendChild(btn);
      btn.id = 'consoleObjBtn' + this.uniqueId;
      let btnP = document.createElement('p');
      btnP.className = 'consoleObjBtnP consoleObjPartLineBtnP';
      btnP.id = 'consoleObjBtnP' + this.uniqueId;
      btnP.innerHTML = this.obj.constructor.name;
      btn.appendChild(btnP);
    }

    this.parentOfObj.appendChild(wholeLineObj);

    this.parentOfObj = wrapOfBtn;
  }

  // 7.CONSOLE LINE REACTION TO FUNCTION
  lineIsFunctionOrClass(fullLine) {
    let objStr = this.obj.toString();

    // STYLING
    let main = objStr.substring(0, objStr.indexOf('{'));
    let sec = objStr.substring(objStr.indexOf('{'), objStr.length).toString();
    sec = this.recognizeAndDisableDomElementsInAString(sec);
    // sec = this.styleFunctionAndClassCodeInConsole(sec);

    let spanF = document.createElement('span');
    spanF.className = 'consoleObjLineFunctionMain';
    this.parentOfObj.appendChild(spanF);
    let spanC = document.createElement('div');
    spanC.className = 'consoleObjLineFunctionSecondary';
    this.parentOfObj.appendChild(spanC);

    let main1, main2 = '';
    if (main.includes('class ')) {
      spanF.style.color = 'rgb(86, 182, 194)';
      main1 = 'class ';
      main2 = main.substring(main1.length, main.length);
      if (main2.includes(' extends ')) {
        let main2ArExten = main2.split(' extends ');
        let main2Edit = main2.replace(main2ArExten[main2ArExten.length - 1], '<span class="consoleObjLineClassExtendsMain">' + main2ArExten[main2ArExten.length - 1] + '</span>');
        main2Edit = main2Edit.replace(' extends ', ' <span class="consoleObjLineClassSpecialOccasionsMain">extends</span > ');
        main2 = main2Edit;
      }
    }
    else {
      let main2Edit = '';
      if (main.includes('function ')) {
        let mainAr = main.split(' ');
        main1 = 'f ';
        main2 = mainAr[mainAr.length - 2] + ' ';
        main2Edit = main2;
      }
      else {
        main1 = 'f ';
        main2 = main;
        main2Edit = main2.replace('=>', '<span class="consoleObjLineFunctionSpecialSymbolMain">=></span >');
      }

      if (main2.includes('(') && main2.includes(')')) {
        main2Edit = main2Edit.replace('(', '<span class="consoleObjLineFunctionParenthesisMain">(</span >');
        main2Edit = main2Edit.replace(')', '<span class="consoleObjLineFunctionParenthesisMain">)</span >');
        let functionsParameters = main2.substring(main2.indexOf('(') + 1, main2.indexOf(')'));
        if (functionsParameters.includes(',')) {
          functionsParameters = functionsParameters.split(',');
          functionsParameters.map((param) => {
            main2Edit = main2Edit.replace(param, '<span class="consoleObjLineFunctionParametersMain">' + param + '</span>');
          });
        }
        main2 = main2Edit;
      }
    }

    this.parentOfObj.classList.add('consoleObjLineFunction');

    spanF.innerHTML = main1;


    if (fullLine) {
      let spanBtn = document.createElement('button');
      spanBtn.className = 'consoleObjLineFunctionSecondaryBtn';
      spanBtn.id = 'consoleObjLineFunctionSecondaryBtn' + this.uniqueId;
      spanBtn.title = 'Open Method';
      spanBtn.innerHTML = main2 + ' { ... }';
      spanC.appendChild(spanBtn);
      let spanContent = document.createElement('span');
      spanContent.className = 'consoleObjLineFunctionSecondaryBtnContent';
      spanContent.id = 'consoleObjLineFunctionSecondaryBtnContent' + this.uniqueId;
      spanC.appendChild(spanContent);

      const thisObj = this;
      document.addEventListener('click', (e) => {
        const target = e.target.closest('#' + spanBtn.id);

        if (target) {

          const store = {
            spanBtn: document.querySelector('#consoleObjLineFunctionSecondaryBtn' + thisObj.uniqueId),
            spanContent: document.querySelector('#consoleObjLineFunctionSecondaryBtnContent' + thisObj.uniqueId)
          }

          store.spanBtn.classList.toggle('openedFunctionOrClassContent');

          if (store.spanBtn.classList.contains('openedFunctionOrClassContent')) {
            store.spanBtn.title = 'Close Method';
            store.spanBtn.innerHTML = main2;
            store.spanContent.title = main1 + main2 + ' ' + sec;
            // let content = sec.slice(1);

            // let lineNumber = sec.split('\n').length;
            // let lineLimit = 1000;
            // if (lineNumber > lineLimit) {
            //   let c = 0;
            //   content = '';
            //   sec.split('\n').map((line) => {
            //     if (c < lineLimit) {
            //       content += line + '\n';
            //       c++;
            //     }
            //   });
            //   content += '    ......    \n  }';
            // }
            store.spanContent.innerHTML = sec;
            store.spanContent.title = 'Double click to close';

            store.spanContent.addEventListener('dblclick', () => {
              store.spanBtn.classList.remove('openedFunctionOrClassContent');
              store.spanBtn.title = 'Open Method';
              store.spanBtn.innerHTML = main2 + ' { ... }';
              store.spanContent.innerHTML = '';
            })
          }
          else {
            store.spanBtn.title = 'Open Method';
            store.spanBtn.innerHTML = main2 + ' { ... }';
            store.spanContent.innerHTML = '';
          }
        }
      });
    }
    else {
      spanC.classList.add('consoleObjLineFunctionSecondaryPartLine');
      let spanBtn = document.createElement('div');
      spanBtn.className = 'consoleObjLineFunctionSecondaryBtn';
      spanBtn.id = 'consoleObjLineFunctionSecondaryBtn' + this.uniqueId;
      spanBtn.title = main1 + main2 + ' ' + sec;
      spanBtn.innerHTML = main2 + '...';
      spanC.appendChild(spanBtn);
      let spanContent = document.createElement('span');
      spanContent.className = 'consoleObjLineFunctionSecondaryBtnContent';
      spanContent.id = 'consoleObjLineFunctionSecondaryBtnContent' + this.uniqueId;
      spanC.appendChild(spanContent);
    }
  }

  // 8.CONSOLE LINE REACTION TO ENTRIES
  lineIsEntries() {
    // CREATE THE BUTTON [[ENTRIES]]
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjEntriesLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjEntriesBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);
    let btn = document.createElement('button');
    btn.className = 'consoleObjBtn';
    btn.id = 'consoleObjEntriesBtn' + this.uniqueId;
    wrapOfBtn.appendChild(btn);
    let btnImg = document.createElement('img');
    btnImg.className = 'consoleObjBtnImg';
    btnImg.id = 'consoleObjBtnEntriesImg' + this.uniqueId;
    btn.appendChild(btnImg);
    let btnP = document.createElement('p');
    btnP.className = 'consoleObjBtnP consoleObjEntriesBtnP';
    btnP.id = 'consoleObjEntriesBtnP' + this.uniqueId;
    btnP.innerHTML = '[[Entries]]';
    btn.appendChild(btnP);

    let wrapObjInfo = document.createElement('span');
    wrapObjInfo.className = 'consoleObjLineWrapInfo closedConsoleObjLineInfo';
    wrapObjInfo.id = 'consoleObjEntriesLineWrapInfo' + this.uniqueId;
    wholeLineObj.appendChild(wrapObjInfo);
    let objInfo = document.createElement('div');
    objInfo.className = 'consoleObjLineInfo';
    objInfo.id = 'consoleObjEntriesLineInfo' + this.uniqueId;
    wrapObjInfo.appendChild(objInfo);

    this.parentOfObj.appendChild(wholeLineObj);


    const thisObj = this;
    document.addEventListener('click', function (e) {
      const target = e.target.closest('#' + btn.id);

      if (target) {
        const store = {
          wholeLineObj: document.querySelector('#consoleObjEntriesLine' + thisObj.uniqueId),
          wrapOfBtn: document.querySelector('#beforeConsoleObjEntriesBtn' + thisObj.uniqueId),
          btn: document.querySelector('#consoleObjEntriesBtn' + thisObj.uniqueId),
          btnImg: document.querySelector('#consoleObjBtnEntriesImg' + thisObj.uniqueId),
          btnP: document.querySelector('#consoleObjEntriesBtnP' + thisObj.uniqueId),
          wrapObjInfo: document.querySelector('#consoleObjEntriesLineWrapInfo' + thisObj.uniqueId),
          objInfo: document.querySelector('#consoleObjEntriesLineInfo' + thisObj.uniqueId)
        };

        store.btnP.classList.toggle('consoleObjBtnDecorate');
        store.btnImg.classList.toggle('consoleObjBtnOpenedImg');
        store.wrapObjInfo.classList.toggle('closedConsoleObjLineInfo');

        if (store.btnImg.classList.contains('consoleObjBtnOpenedImg')) {
          // OBJ'S CHILDREN CHECK
          let setC = 0;
          thisObj.obj.forEach((value, key) => {
            let lineOfObj = document.createElement('p');
            lineOfObj.className = 'consoleArrayLineInfoP';
            store.objInfo.appendChild(lineOfObj);

            let keyObj = document.createElement('span');
            keyObj.className = 'consoleObjLineLeftSp';
            if (thisObj.typeOf === 'map') {
              keyObj.innerHTML = setC;
            }
            else if (thisObj.typeOf === 'set') {
              keyObj.innerHTML = setC;
            }
            lineOfObj.appendChild(keyObj);
            let splitObj = document.createElement('span');
            splitObj.className = 'consoleObjLineMidSp';
            splitObj.innerHTML = ':';
            lineOfObj.appendChild(splitObj);
            let valueObj = document.createElement('span');
            valueObj.className = 'consoleObjLineRightSp insideConsoleObjLine consoleObjLineRightIfMixed';
            lineOfObj.appendChild(valueObj);

            if (thisObj.typeOf === 'map') {
              let map = new Map();
              map.set(key, value);
              thisObj.createChildConsoleLine(valueObj, map, 'forMapEntries');
            }
            else if (thisObj.typeOf === 'set') {
              let set = new Set();
              set.add(key);
              thisObj.createChildConsoleLine(valueObj, set, 'forSetEntries');
            }
            // let helperCapitalize = thisObj.typeOf.toLowerCase();
            // helperCapitalize = helperCapitalize.charAt(0).toUpperCase() + helperCapitalize.slice(1);

            setC++;
          });
        }
        else {
          store.objInfo.innerHTML = '';
        }
      }
    });

    // OPEN FIRST TIME
    btn.click();

  }

  // 9.CONSOLE REACTION TO BOOLEAN
  lineIsBoolean() {
    this.parentOfObj.innerHTML += `<span>${this.obj}</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineBoolean');
  }

  // 10.CONSOLE REACTION TO NUMBER
  lineIsNumber() {
    this.parentOfObj.innerHTML += `<span>${this.obj}</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineNumber');
  }

  // 11.CONSOLE REACTION TO BIG INTEGER
  lineIsBigInt() {
    this.parentOfObj.innerHTML += `<span>${this.obj}n</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineBigInt');
  }

  // 12.CONSOLE REACTION TO STRING
  lineIsString() {
    let disableIfHtmlIsToShowUp = this.recognizeAndDisableDomElementsInAString(this.obj);
    let symbol = '"';
    // if (disableIfHtmlIsToShowUp.toString().includes('\'')) {
    //   symbol = '"';
    //   if (disableIfHtmlIsToShowUp.toString().includes('\"')) {
    //     symbol = '`';
    //     if (disableIfHtmlIsToShowUp.toString().includes('`')) {
    //       symbol = "'";
    //     }
    //   }
    // }
    this.parentOfObj.innerHTML += `<span><span class='consoleLineObjStringSymbolBeforeAfter'>${symbol} </span>${disableIfHtmlIsToShowUp}<span class='consoleLineObjStringSymbolBeforeAfter'>${symbol} </span</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineString');
  }

  // 13.CONSOLE REACTION TO STRING
  lineIsSymbol() {
    this.parentOfObj.innerHTML += `<span>${this.obj.toString()}</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineSymbol');
  }

  // 14.CONSOLE REACTION TO NULL
  lineIsNullOrUndefined(msg) {
    this.parentOfObj.innerHTML += `<span>${msg}</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineNull');
  }

  // 15.CONSOLE REACTION TO MIXED OBJS
  lineIsMixedObjs(fullLine) {
    // CREATE THE BUTTON [[ENTRIES]]
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjEntriesLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjEntriesBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);
    let btn = document.createElement('button');
    btn.className = 'consoleObjBtn';
    btn.id = 'consoleObjEntriesBtn' + this.uniqueId;
    wrapOfBtn.appendChild(btn);
    let btnImg = document.createElement('img');
    btnImg.className = 'consoleObjBtnImg';
    btnImg.id = 'consoleObjBtnEntriesImg' + this.uniqueId;
    btn.appendChild(btnImg);

    let wrapObjInfo = document.createElement('span');
    wrapObjInfo.className = 'consoleObjLineWrapInfo closedConsoleObjLineInfo';
    wrapObjInfo.id = 'consoleObjEntriesLineWrapInfo' + this.uniqueId;
    wholeLineObj.appendChild(wrapObjInfo);
    let objInfo = document.createElement('div');
    objInfo.className = 'consoleObjLineInfo';
    objInfo.id = 'consoleObjEntriesLineInfo' + this.uniqueId;
    wrapObjInfo.appendChild(objInfo);

    this.parentOfObj.appendChild(wholeLineObj);

    if (this.specialOperation === 'forMapEntries' || this.specialOperation === 'forSetEntries') {
      btn.classList.add('consoleObjLineRightIfMixedBtn');

      let beforeValues = document.createElement('span');
      beforeValues.style.marginLeft = '5px';
      btn.appendChild(beforeValues);
      let value1 = document.createElement('span');
      btn.appendChild(value1);
      let midValues = document.createElement('span');
      btn.appendChild(midValues);
      let value2 = document.createElement('span');
      btn.appendChild(value2);
      let afterValues = document.createElement('span');
      btn.appendChild(afterValues);

      const thisObj = this;

      let keyOfObj = null;
      let valueOfObj = null;
      if (this.specialOperation === 'forMapEntries') {
        this.obj.forEach(function (value, key) {
          keyOfObj = key;
          valueOfObj = value;
        });

        beforeValues.innerHTML = '{ ';
        this.createChildConsoleLine(value1, keyOfObj, 'mixedInLine');
        midValues.innerHTML = '  =>  ';
        this.createChildConsoleLine(value2, valueOfObj, 'mixedInLine');
        afterValues.innerHTML = ' }';
      }
      else {
        this.obj.forEach((item) => {
          valueOfObj = item;
        });

        this.createChildConsoleLine(value1, valueOfObj, 'mixedInLine');
      }

      document.addEventListener('click', function (e) {
        const target = e.target.closest('#' + btn.id);

        if (target) {
          const store = {
            btn: document.querySelector('#consoleObjEntriesBtn' + thisObj.uniqueId),
            btnImg: document.querySelector('#consoleObjBtnEntriesImg' + thisObj.uniqueId),
            wrapObjInfo: document.querySelector('#consoleObjEntriesLineWrapInfo' + thisObj.uniqueId),
            objInfo: document.querySelector('#consoleObjEntriesLineInfo' + thisObj.uniqueId)
          };

          store.btn.classList.toggle('consoleObjBtnDecorate');
          store.btnImg.classList.toggle('consoleObjBtnOpenedImg');

          store.wrapObjInfo.classList.toggle('closedConsoleObjLineInfo');

          if (store.btnImg.classList.contains('consoleObjBtnOpenedImg')) {
            if (thisObj.specialOperation === 'forMapEntries') {
              let keyObjInfoElmnt = document.createElement('span');
              store.objInfo.appendChild(keyObjInfoElmnt);
              thisObj.lineSetEntriesChild(keyObjInfoElmnt, keyOfObj, 'key');
            }
            let valueObjInfoElmnt = document.createElement('span');
            store.objInfo.appendChild(valueObjInfoElmnt);
            thisObj.lineSetEntriesChild(valueObjInfoElmnt, valueOfObj, 'value');
          }
          else {
            store.objInfo.innerHTML = '';
          }
        }
      });
    }
  }
  // ------END SECTOR <= STRUCTURE LINE 1------





  // ------START SECTOR => STRUCTURE LINE 2------
  // 1.CONSOLE OBJ'S AVAILABLE VARIABLE PROPERTIES
  lineGetVariables(parentToStore) {
    // OBJ'S VARIABLES TO
    const getAllVars = (obj) => {
      let properties = new Set();
      let currentObj = obj;

      do {
        Object.getOwnPropertyNames(currentObj).map((item) => {
          properties.add(item);
        });
      }
      while ((currentObj = Object.getPrototypeOf(currentObj)));

      let result = [...properties.keys()].filter((item) => {
        try {
          return (typeof obj[item] !== 'function');
        } catch (e) {
          return false;
        }
      });

      function startsWithUppercase(str) {
        return str.substr(0, 1).match(/[A-Z\u00C0-\u00DC]/);
      }
      result.sort(function (a, b) {
        if (startsWithUppercase(a) && !startsWithUppercase(b)) {
          return 1;
        } else if (startsWithUppercase(b) && !startsWithUppercase(a)) {
          return -1;
        }
        return a.localeCompare(b);
      });

      return result;
    }

    let vars = [...getAllVars(this.obj)];
    delete vars[vars.indexOf('__proto__')];

    vars.map((methodName) => {
      if (this.obj[methodName] !== undefined) {
        this.createVarAndMethodElements(parentToStore, methodName, this.obj[methodName], 'var');
      }
    });
  }

  // 2.CONSOLE OBJ'S AVAILABLE METHOD PROPERTIES
  lineGetSimpleMethods(parentToStore) {
    // OBJ'S FUNCTIONS TO
    const getAllMethods = (obj) => {
      let properties = new Set();
      let currentObj = obj;

      do {
        Object.getOwnPropertyNames(currentObj).map((item) => {
          properties.add(item);
        });
      }
      while ((currentObj = Object.getPrototypeOf(currentObj)));

      let result = [...properties.keys()].filter((item) => {
        try {
          return (typeof obj[item] === 'function');
        } catch (e) {
          return false;
        }
      });

      function startsWithUppercase(str) {
        return str.substr(0, 1).match(/[A-Z\u00C0-\u00DC]/);
      }
      result.sort(function (a, b) {
        if (startsWithUppercase(a) && !startsWithUppercase(b)) {
          return -1;
        } else if (startsWithUppercase(b) && !startsWithUppercase(a)) {
          return 1;
        }
        return a.localeCompare(b);
      });

      return result;
    }

    let methods = [...getAllMethods(this.obj)];
    delete methods[methods.indexOf('__proto__')];
    delete methods[methods.indexOf('__defineGetter__')];
    delete methods[methods.indexOf('__defineSetter__')];
    delete methods[methods.indexOf('__lookupGetter__')];
    delete methods[methods.indexOf('__lookupSetter__')];

    methods.map((methodName) => {
      this.createVarAndMethodElements(parentToStore, methodName, this.obj[methodName], 'methods');
    })
  }

  // 3.CONSOLE OBJ'S AVAILABLE  STATIC METHOD PROPERTIES
  lineGetStaticMethods(parentToStore) {
    // OBJ'S STATIC FUNCTIONS TO
    const getStaticMethods = Object.getOwnPropertyNames(this.obj).filter((item) => {
      try {
        return (typeof this.obj[item] === 'function');
      } catch (e) {
        return false;
      }
    });

    getStaticMethods.map((methodName) => {
      this.createVarAndMethodElements(parentToStore, methodName, this.obj[methodName], 'methods');
    })
  }

  // 4.CONSOLE OBJ'S AVAILABLE GETTERS PROPERTIES
  lineGetters(parentToStore) {
    let leftOut = [];
    // OBJ'S GETTERS TO
    const getAllVars = (obj) => {
      let properties = new Set();
      let currentObj = obj;

      do {
        Object.getOwnPropertyNames(currentObj).map((item) => {
          properties.add(item);
        });
      }
      while ((currentObj = Object.getPrototypeOf(currentObj)));

      let result = [...properties.keys()].filter((item) => {
        try {
          return (typeof obj[item] !== 'function');
        } catch (e) {
          leftOut.push(item);
          return false;
        }
      });

      function startsWithUppercase(str) {
        return str.substr(0, 1).match(/[A-Z\u00C0-\u00DC]/);
      }
      result.sort(function (a, b) {
        if (startsWithUppercase(a) && !startsWithUppercase(b)) {
          return 1;
        } else if (startsWithUppercase(b) && !startsWithUppercase(a)) {
          return -1;
        }
        return a.localeCompare(b);
      });

      return result;
    }

    let vars = [...getAllVars(this.obj)];
    delete vars[vars.indexOf('__proto__')];

    let getMethods = [];
    vars.map((methodName) => {
      let check = Object.getOwnPropertyDescriptor(this.obj, methodName);
      if (check !== undefined) {
        let getOrSet = Object.getOwnPropertyDescriptor(this.obj, methodName);
        if (getOrSet !== undefined) {
          // GETTERS
          if (getOrSet.set === undefined && getOrSet.get !== undefined) {
            getMethods.push({ name: methodName, method: getOrSet.get });
          }
        }
      }
    });

    getMethods.map((getter) => {
      this.createVarAndMethodElements(parentToStore, getter.name, getter.method, 'get');
    });


    let leftOutMethods = [];
    leftOut.map((leftOutMethodName) => {
      let check = Object.getOwnPropertyDescriptor(this.obj, leftOutMethodName);
      if (check !== undefined) {
        let getOrSet = Object.getOwnPropertyDescriptor(this.obj, leftOutMethodName);
        if (getOrSet !== undefined) {
          // GETTERS
          if (getOrSet.set === undefined && getOrSet.get !== undefined) {
            leftOutMethods.push({ name: leftOutMethodName, method: getOrSet.get });
          }
        }
      }
    });

    leftOutMethods.map((getter) => {
      this.createVarAndMethodElements(parentToStore, getter.name, getter.method, 'get');
    });
  }

  // 5.CONSOLE OBJ'S AVAILABLE SETTERS PROPERTIES
  lineSetters(parentToStore) {
    let leftOut = [];
    // OBJ'S GETTERS TO
    const getAllVars = (obj) => {
      let properties = new Set();
      let currentObj = obj;

      do {
        Object.getOwnPropertyNames(currentObj).map((item) => {
          properties.add(item);
        });
      }
      while ((currentObj = Object.getPrototypeOf(currentObj)));

      let result = [...properties.keys()].filter((item) => {
        try {
          return (typeof obj[item] !== 'function');
        } catch (e) {
          leftOut.push(item);
          return false;
        }
      });

      function startsWithUppercase(str) {
        return str.substr(0, 1).match(/[A-Z\u00C0-\u00DC]/);
      }
      result.sort(function (a, b) {
        if (startsWithUppercase(a) && !startsWithUppercase(b)) {
          return 1;
        } else if (startsWithUppercase(b) && !startsWithUppercase(a)) {
          return -1;
        }
        return a.localeCompare(b);
      });

      return result;
    }

    let vars = [...getAllVars(this.obj)];
    delete vars[vars.indexOf('__proto__')];

    let setMethods = [];

    vars.map((methodName) => {
      let check = Object.getOwnPropertyDescriptor(this.obj, methodName);
      if (check !== undefined) {
        let getOrSet = Object.getOwnPropertyDescriptor(this.obj, methodName);
        if (getOrSet !== undefined) {
          // SETTERS
          if (getOrSet.get === undefined && getOrSet.set !== undefined) {
            setMethods.push({ name: methodName, method: getOrSet.set });
          }
        }
      }
    });

    setMethods.map((setter) => {
      this.createVarAndMethodElements(parentToStore, setter.name, setter.method, 'set');
    });

    let leftOutMethods = [];
    leftOut.map((leftOutMethodName) => {
      let check = Object.getOwnPropertyDescriptor(this.obj, leftOutMethodName);
      if (check !== undefined) {
        let getOrSet = Object.getOwnPropertyDescriptor(this.obj, leftOutMethodName);
        if (getOrSet !== undefined) {
          // GETTERS
          if (getOrSet.get === undefined && getOrSet.set !== undefined) {
            leftOutMethods.push({ name: leftOutMethodName, method: getOrSet.set });
          }
        }
      }
    });

    leftOutMethods.map((setter) => {
      this.createVarAndMethodElements(parentToStore, setter.name, setter.method, 'set');
    });
  }

  // GENERAL CONSOLE OBJ'S PROPERTIES' STRUCTURE
  createVarAndMethodElements(parentNode, methodName, value, typeOf) {
    // OBJ'S CHILD PROTOTYPE
    let lineOfObj = document.createElement('p');
    lineOfObj.className = 'consoleObjLineInfoP';
    parentNode.appendChild(lineOfObj);

    let keyObj = document.createElement('span');
    keyObj.className = 'consoleObjLineLeftSp';

    if (typeOf === 'var') {
      keyObj.innerHTML = methodName;
    }
    else if (typeOf === 'get') {
      keyObj.innerHTML = 'get ' + methodName;
      keyObj.classList.add('consoleObjLineLeftGettersSp');
    }
    else if (typeOf === 'set') {
      keyObj.innerHTML = 'set ' + methodName;
      keyObj.classList.add('consoleObjLineLeftSettersSp');
    }
    else {
      keyObj.innerHTML = methodName;
      keyObj.classList.add('consoleObjLineLeftMethodsSp');
    }

    lineOfObj.appendChild(keyObj);
    let splitObj = document.createElement('span');
    splitObj.className = 'consoleObjLineMidSp';
    splitObj.innerHTML = ':';
    lineOfObj.appendChild(splitObj);
    let valueObj = document.createElement('span');
    valueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
    lineOfObj.appendChild(valueObj);

    this.childObj = valueObj;
    this.createChildConsoleLine(valueObj, value);
  }

  // GENERAL STRUCTURE OF ENTRIES' CHILDREN
  lineSetEntriesChild(parentToStore, obj, nameOf) {
    this.createVarAndMethodElements(parentToStore, nameOf, obj, 'var');
  }
  // ------END SECTOR <= STRUCTURE LINE 2------





  // ------START SECTOR => STRUCTURE LINE 3------
  // 1.IF LINE NEEDS ENTRIES AS A CHILD THEN ADDED IT HERE
  lineNeedsEntries(parentToStore) {
    let lineOfObj = document.createElement('p');
    lineOfObj.className = 'consoleArrayLineInfoP';
    parentToStore.appendChild(lineOfObj);

    let keyObj = document.createElement('span');
    keyObj.className = 'consoleObjLineLeftSp';
    keyObj.innerHTML = '';
    lineOfObj.appendChild(keyObj);
    let splitObj = document.createElement('span');
    splitObj.className = 'consoleObjLineMidSp';
    splitObj.innerHTML = '';
    lineOfObj.appendChild(splitObj);
    let valueObj = document.createElement('span');
    valueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
    lineOfObj.appendChild(valueObj);

    this.createChildConsoleLine(valueObj, this.obj, '__entries__');
  }

  // 2.CONSOLE LINE REACTON TO LENGTH OF ARRAY OR MAP OR SET ITEM
  lineIsObjLength(parentToStore) {
    // ADD LINE FOR LENGTH
    let lineOfObj = document.createElement('p');
    lineOfObj.className = 'consoleArrayLineInfoP';
    parentToStore.appendChild(lineOfObj);

    let keyObj = document.createElement('span');
    keyObj.className = 'consoleObjLineSecondary';
    lineOfObj.appendChild(keyObj);
    let splitObj = document.createElement('span');
    splitObj.className = 'consoleObjLineMidSp';
    splitObj.innerHTML = ':';
    lineOfObj.appendChild(splitObj);
    let valueObj = document.createElement('span');
    valueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
    lineOfObj.appendChild(valueObj);

    let size = null;

    if (this.typeOf === 'arrList' || this.typeOf === 'nodeList') {
      keyObj.innerHTML = 'length';
      size = this.obj.length;
    }
    else if (this.typeOf === 'map' || this.typeOf === 'set') {
      keyObj.innerHTML = 'size';
      size = this.obj.size;
    }

    this.createChildConsoleLine(valueObj, size);
  }

  // 3.CONSOLE LINE REACTON TO SYMBOL PROPERTIES OF OBJECT
  lineIsObjSymbols(parentToStore) {
    let symbolKeys = Object.getOwnPropertySymbols(this.obj);

    symbolKeys.forEach((key) => {
      // ADD LINE FOR SYMBOL'S KEY
      let lineOfObj = document.createElement('p');
      lineOfObj.className = 'consoleArrayLineInfoP';
      parentToStore.appendChild(lineOfObj);

      let keyObj = document.createElement('span');
      keyObj.className = 'consoleObjLineLeftMethodsSp';
      keyObj.innerHTML = key.toString();
      lineOfObj.appendChild(keyObj);
      let splitObj = document.createElement('span');
      splitObj.className = 'consoleObjLineMidSp';
      splitObj.innerHTML = ':';
      lineOfObj.appendChild(splitObj);
      let valueObj = document.createElement('span');
      valueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
      lineOfObj.appendChild(valueObj);

      this.createChildConsoleLine(valueObj, this.obj[key]);
    });
  }

  // 4.CONSOLE LINE REACTON TO OBJECT PROTOTYPE
  lineIsObjsPrototype(parentToStore) {
    // ADD LINE FOR PROTOTYPE OF OBJECT
    let protLineOfObj = document.createElement('p');
    protLineOfObj.className = 'consoleArrayLineInfoP';
    parentToStore.appendChild(protLineOfObj);

    let protKeyObj = document.createElement('span');
    protKeyObj.className = 'consoleObjLinePrototype';
    protKeyObj.innerHTML = '[[Prototype]]';
    protLineOfObj.appendChild(protKeyObj);
    let protSplitObj = document.createElement('span');
    protSplitObj.className = 'consoleObjLineMidSp';
    protSplitObj.innerHTML = ':';
    protLineOfObj.appendChild(protSplitObj);
    let protValueObj = document.createElement('span');
    protValueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
    protLineOfObj.appendChild(protValueObj);

    if (Object.getPrototypeOf(this.obj) !== null) {
      this.createChildConsoleLine(protValueObj, Object.getPrototypeOf(this.obj), '__proto__');
    }
    else {
      this.createChildConsoleLine(protValueObj, '', '__proto__');
    }
  }

  // 5.CONSOLE LINE REACTON TO OBJECT PROTOTYPE
  lineIsObjsPrimitiveValue(parentToStore, value) {
    // ADD LINE FOR PROTOTYPE OF OBJECT
    let primitValLineOfObj = document.createElement('p');
    primitValLineOfObj.className = 'consoleArrayLineInfoP';
    parentToStore.appendChild(primitValLineOfObj);

    let primitValKeyObj = document.createElement('span');
    primitValKeyObj.className = 'consoleObjLinePrototype';
    primitValKeyObj.innerHTML = '[[PrimitiveValue]]';
    primitValLineOfObj.appendChild(primitValKeyObj);
    let primitValSplitObj = document.createElement('span');
    primitValSplitObj.className = 'consoleObjLineMidSp';
    primitValSplitObj.innerHTML = ':';
    primitValLineOfObj.appendChild(primitValSplitObj);
    let primitValValueObj = document.createElement('span');
    primitValValueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
    primitValLineOfObj.appendChild(primitValValueObj);

    this.createChildConsoleLine(primitValValueObj, value);
  }
  // ------END SECTOR <= STRUCTURE LINE 3------




  // ------START SECTOR => OTHER FUNCTIONS------
  // ADD NUM AND FILE LOC OF LINE, IF IS THE FIRST
  fileLocAndLineToShowIfNeeded() {
    let linkDestinations = this.fileLoc.split('/');
    let finalLinkDestination = linkDestinations[linkDestinations.length - 1] + ': ';

    this.parentOfFileAndLine.innerHTML = `<span class=''>${finalLinkDestination}${this.lineNum}</span>`;

    this.parentOfObj.classList.add('beforeConsoleObjBtnFirst');
  }


  recognizeAndDisableDomElementsInAString(string) {
    const chars = {
      '<': '&lt;', '>': '&gt;', '"': "&quot;", '\n': '\r\n', '\r': ''
    };
    string = string.replace(/[<>"]/g, i => chars[i]);

    return string;

    // let parser = new DOMParser();
    // const result = parser.parseFromString(string, 'text/html');

    // let body = result.children[0].children[1];
    // let copyString = string;
    // let editedString = string.replace(/[<>"']/g, i => chars[i]);
    // let resultString = string;

    // [...body.children].forEach((element) => {
    //   let dom = element.outerHTML.replace(/[\n]/g, i => chars[i]);
    //   let editedDom = dom.replace(/[<>"']/g, i => chars[i]);

    //   if (editedString.includes(editedDom)) {
    //     const charsDom = {
    //       '"': "&quot;", '<': '&lt;', '>': '&gt;'
    //     };
    //     let finalDom = dom.replaceAll(/[<>"]/g, i => charsDom[i]);
    //     let foundInString = copyString.substring(editedString.indexOf(editedDom), editedString.indexOf(editedDom) + editedDom.length);
    //     resultString = resultString.replace(foundInString, finalDom);
    //   }
    //   else {
    //     console.log(editedString);
    //     console.log(editedDom);
    //   }
    // });
    //
    // return resultString;
  }

  styleFunctionAndClassCodeInConsole(string) {
    let copyString = string;
    let resultString = '';

    let lineNumber = copyString.split('\n').length;

    // let lineLimit = 1000;
    // if (lineNumber > lineLimit) {
    // let c = 0;
    copyString.split('\n').map((line) => {
      // if (c < lineLimit) {
      resultString += line + '\n';
      // c++;
      // }
    });
    //   content += '    ......    \n  }';
    // }

    return resultString;
  }


  increaseThisIdElmtnsSecCopy() {
    let copy = this.thisIdElmtns;
    copy.secondaryC++;
    return copy;
  }

  createChildConsoleLine(currObjELmnt, objsChild, specialOperation) {
    // CHILDREN DON'T NEED FILE LOC AND LINE NUMBER
    let child = { message: objsChild, file: null, line: null }

    specialOperation = specialOperation || null;

    // SEND TO CHILD OF THIS OBJ IN CONSOLE
    let newthisIdElmtns = this.increaseThisIdElmtnsSecCopy();
    const childObj = new ConsoleLine(currObjELmnt, child, newthisIdElmtns, this.consoleObj, this.typeOfLine, specialOperation);
    childObj.start();
  }
  // ------END SECTOR <= OTHER FUNCTIONS------
}