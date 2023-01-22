// DO NOT USE CONSOLE.LOG FUNCTION ANYWHERE HERE
// EITHER DISABLE THE FUNCTION OR USE OTHER TYPES OF DEBUG TOOL

export default class Console {
  constructor(consoleElmnt, consoleBtn, consoleContentElmnt) {
    this.consoleElmnt = consoleElmnt;

    // this.cssCall();
    this.htmlConsoleStructure();
    this.coreConsoleElements();

    this.consoleStatus = false;

    this.consoleIndexSymbol = '>>';

    this.alignContent = null;
    this.nextAlign = null;

    this.counter = -1;

    this.consoleSize = null;
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
    this.resizeConsole('--consoleChangeHeight', '25%');
    this.initializationMessage();
    this.addNewLineToConsole('msg', 'Test line');

    this.consoleStatusCheckFromLocalStorage();
    this.consoleCoreButtonsEvents();
    this.enableConsoleLogEvent();

    this.shortcutEvents();
    // }


    cssCall() {
      var cssId = 'overallConsoleStyle';
      if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://website.example/css/stylesheet.css';
        link.media = 'all';
        head.appendChild(link);
      }
    }

    htmlConsoleStructure() {
      this.consoleElmnt.classList.add('closedCoreConsole');
      this.consoleElmnt.title = 'Shift + C';
      this.consoleElmnt.innerHTML = `
      <div id='consoleTitle'>
        <button class='closedCoreConsoleBtn consoleImportantFocus'>
          <h2>Console</h2>
        </button>
      </div>

      <div class='closedCoreConsoleContent' id='consoleContent'></div>

      <div id='consoleBtns'>
        <button class='imprtntConsoleBtn' id='changeConsoleAlignBtn'></button>
        <button class='imprtntConsoleBtn' id='clearConsoleBtn'>Clear</button>
        <select class='imprtntConsoleBtn' id="sizesOfCoreConsoleSlct">
              <option value="calc(100% - 32px)">100%</option>
              <option value="65%">65%</option>
              <option value="50%">50%</option>
              <option value="35%">35%</option>
              <option value="25%">25%</option>
        </select>
      </div>`;
    }

    // FUNCTION THAT HELPS TRACE THE LINE OF THE MESAGE IN CONSOLE
    enableConsoleLogEvent() {
      // GET TRACE AS STRING SO I CAN SHOW THE LINE OF MESSAGE ON MY CONSOLE
      let getStackTraceImportant = function () {
        var obj = {};
        Error.captureStackTrace(obj, getStackTraceImportant);

        let urlAndLine = obj.stack;

        // FIRST URL FROM CONSOLE.LOG OVERRIDEN CUSTOM FUNCTION
        let firstUrl = urlAndLine.substring(urlAndLine.indexOf('(') + 1, urlAndLine.indexOf(')'));
        urlAndLine = urlAndLine.replace(urlAndLine.substring(0, urlAndLine.indexOf(')') + 1), ' ');

        // IMPORTANT URL TO SHOW WHERE MESSAGE CAME FROM, ON CONSOLE
        let secondUrl = urlAndLine.substring(urlAndLine.indexOf('(') + 1, urlAndLine.indexOf(')'));
        urlAndLine = urlAndLine.replace(urlAndLine.substring(0, urlAndLine.indexOf(')') + 1), ' ');

        // SPLIT URL AND GET FILE LOCATION AS WELL AS LINE NUMBER
        let urlEnd = secondUrl.substring(secondUrl.lastIndexOf('/') + 1, secondUrl.length);
        let urlImprtEnd = urlEnd.substring(0, urlEnd.lastIndexOf(':'));
        let file = urlImprtEnd.substring(0, urlImprtEnd.lastIndexOf(':'));
        let line = urlImprtEnd.substring(urlImprtEnd.lastIndexOf(':') + 1, urlImprtEnd.length);

        return { file, line };
      }

      let thisObj = this;
      // CHANGE CONSOLE FUNCTION
      window.console.log = function (message) {
        let urlLine = getStackTraceImportant();
        const msgAndInfo = { message, file: urlLine.file, line: urlLine.line };

        thisObj.addNewLineToConsole('msg', msgAndInfo);
      }

      window.onerror = function (error, url, line) {
        thisObj.addNewLineToConsole('err', { message: error, file: url, line: line });
      }
    }


    // STATUS INITIALIZATION
    consoleStatusCheckFromLocalStorage() {
      let localStoreStatus = JSON.parse(localStorage.getItem('overallConsoleStatus'));

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
        this.resizeConsole('--consoleChangeHeight', consoleHeight);
      }

      // ALIGN INITIALIZATION
      if (localStoreStatus != null) {
        this.initialAlign('--flexDirect', '--consoleAlign', localStoreStatus[2]);
      }
      else {
        this.initialAlign('--flexDirect', '--consoleAlign', 'center');
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
      });

      let consoleFunct = [this.getConsoleCurrentStatus(), this.consoleSize, this.alignContent];
      consoleFunct = JSON.stringify(consoleFunct);
      localStorage.setItem('overallConsoleStatus', consoleFunct);
    }

    // CORE CONSOLE FUNCTIONS
    consoleCoreButtonsEvents() {
      // ALIGN CONSOLE EVENT
      this.consoleElmnt.querySelector('#changeConsoleAlignBtn').addEventListener('click', () => {
        this.changeAlign('--consoleAlign');

        let buttonInfo = this.nextAlign.toUpperCase();
        this.consoleElmnt.querySelector('#changeConsoleAlignBtn').innerHTML = `Align [${buttonInfo}]`;

        let consoleFunct = [this.getConsoleCurrentStatus(), this.consoleSize, this.alignContent];
        consoleFunct = JSON.stringify(consoleFunct);
        localStorage.setItem('overallConsoleStatus', consoleFunct);
      });

      // CLEAR CONSOLE EVENT
      this.consoleElmnt.querySelector('#clearConsoleBtn').addEventListener('click', () => {
        this.clearConsoleEvent();
      });

      // CHANGE SIZE CONSOLE EVENT
      this.consoleElmnt.querySelector('#sizesOfCoreConsoleSlct').addEventListener('change', () => {
        let newHeight = this.consoleElmnt.querySelector('#sizesOfCoreConsoleSlct').value;
        this.resizeConsole('--consoleChangeHeight', newHeight);


        let consoleFunct = [this.getConsoleCurrentStatus(), this.consoleSize, this.alignContent];
        consoleFunct = JSON.stringify(consoleFunct);
        localStorage.setItem('overallConsoleStatus', consoleFunct);
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

      if (this.counter < 0) {
        this.consoleContentElmnt.innerHTML += `
         <div class='newConsoleLine'>
            <span></span>
            <p></p>
         </div>
         <div class='newConsoleLine' id='lastLineInConsole'>
            <span id='consolePointer'>${this.consoleIndexSymbol}</span>
            <p></p>
         </div>`;
      }
      else {

        // DELETE LAST LINE OF CONSOLE AND RECREATE IT AFTER
        document.getElementById('lastLineInConsole').remove();

        // NUMBER COUNT CONSOLE
        let finalCountForm = (this.counter + 1) + ':';
        if (this.counter < 9) {
          finalCountForm = '0' + finalCountForm;
        }

        let consolePointerLine = `
        <div class='newConsoleLine' id='lastLineInConsole'>
          <hr>
          <div class='lastLineInConsole'>
            <span id='consolePointer'>${this.consoleIndexSymbol}</span>
            <span id='consolePointerPar'></span>
          </div>
        </div>`;


        this.consoleContentElmnt.innerHTML += `
            <hr>
            <div class='newConsoleLine'>
               <span class='consoleCountPointer'>${finalCountForm}</span>
               <span class='consoleLineContent' id='consoleObj${this.counter}'></span>
            </div>
            ${consolePointerLine}`;

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
      this.addNewLineToConsole('Test line');
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
          localStorage.removeItem('overallConsoleStatus');
          e.preventDefault();
        }
      });
    }
  }

class ConsoleLine {
  constructor(parentOfObj, obj, thisIdElmtns, consoleObj, typeOfLine) {
    this.coreParentOfObj = parentOfObj;
    this.parentOfObj = parentOfObj;
    this.obj = obj.message;
    this.parentOfFileAndLine = null;
    this.fileLoc = obj.file;
    this.lineNum = obj.line;
    this.thisIdElmtns = thisIdElmtns;
    this.consoleObj = consoleObj;
    this.typeOfLine = typeOfLine;

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
      if (typeof this.obj === 'object' && this.obj !== null) {
        if (this.isNode(this.obj)) {
          this.typeOf = 'dom';
          this.lineIsDom();
        }
        else if (this.isNodeList(this.obj)) {
          this.typeOf = 'nodeList';
          this.lineIsArrayList();
        }
        else if (Array.isArray(this.obj)) {
          this.obj.sort();
          this.typeOf = 'arrList';
          this.lineIsArrayList();
        }
        else {
          this.typeOf = 'sObj';
          this.lineIsSimpleObject();
        }
      }
      else if (typeof this.obj === 'boolean') {
        this.typeOf = 'boolean';
        this.lineIsBoolean();
      }
      else if (typeof this.obj === 'number') {
        this.typeOf = 'number';
        this.lineIsNumber();
      }
      else if (typeof this.obj === 'string') {
        this.typeOf = 'string';
        this.lineIsString();
      }
      else if (this.isFunction(this.obj)) {
        this.typeOf = 'func';
        this.lineIsFunction();
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
    else if (this.typeOfLine === 'err') {
      this.isErrorLineOfConsole();
    }

    if (this.isFirstLineOfMessage()) {
      this.fileLocAndLineToShowIfNeeded();
    }
  }

  // CHECKS CONTROL
  isNode(key) {
    return (typeof Node === 'object' ? key instanceof Node : key && typeof key === 'object' && typeof key.nodeType === 'number' && typeof key.nodeName === 'string');
  }
  isNodeList(key) {
    return (key instanceof NodeList);
  }
  isFunction(key) {
    return (key && {}.toString.call(key) === '[object Function]');
  }
  isFirstLineOfMessage() {
    return (this.fileLoc !== null && this.lineNum !== null);
  }



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

  isErrorLineOfConsole() {
    this.coreParentOfObj.parentNode.classList.add('newConsoleLineWrapError');
    this.coreParentOfObj.classList.add('newConsoleLineError');

    this.parentOfObj.classList.add('errorConsolePar');
    this.parentOfObj.innerHTML = this.obj;

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



  // CONSOLE LINE ACTION TO NODE OBJ
  lineIsDom() {
    let currObjELmnt = this.parentOfObj;
    let objsChild = this.obj;

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
    spanTagN.innerHTML = tagN;
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
        objsChild.classList.add('consoleDomHoverMouse');

        // GET ALL PARENTS AND THEN FORCE THEM TO OVERFLOW
        let helper = objsChild;
        const parents = [];

        while (helper) {
          parents.unshift(helper);
          helper = helper.parentNode;
        }

        parents.map((value) => {
          objsChild.classList.add('consoleDomHoverMouseOverflowForce');
        });
      }
    });

    document.addEventListener('mouseout', function (e) {
      const target = e.target.closest('#' + spanDom.id);

      if (target) {
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
          objsChild.classList.remove('consoleDomHoverMouseOverflowForce');
        });
      }
    });
  }

  // CONSOLE LINE ACTION TO NODELIST
  lineIsNodeList() {
    this.lineIsSimpleObject();
  }

  // CONSOLE LINE ACTION TO ARRAYLIST
  lineIsArrayList() {
    // CREATE THE MAIN CORE OF HTML CONSOLE OBJECT LINE
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);
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

          // ADD LINE FOR LENGTH
          let lineOfObj = document.createElement('p');
          lineOfObj.className = 'consoleArrayLineInfoP';
          store.objInfo.appendChild(lineOfObj);

          let keyObj = document.createElement('span');
          keyObj.className = 'consoleObjLineSecondary';
          keyObj.innerHTML = 'length';
          lineOfObj.appendChild(keyObj);
          let splitObj = document.createElement('span');
          splitObj.className = 'consoleObjLineMidSp';
          splitObj.innerHTML = ':';
          lineOfObj.appendChild(splitObj);
          let valueObj = document.createElement('span');
          valueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
          lineOfObj.appendChild(valueObj);

          let l = thisObj.obj.length;
          thisObj.createChildConsoleLine(valueObj, l);


          // ADD LINE FOR PROTOTYPE OF OBJECT
          let protLineOfObj = document.createElement('p');
          protLineOfObj.className = 'consoleArrayLineInfoP';
          store.objInfo.appendChild(protLineOfObj);

          let protKeyObj = document.createElement('span');
          protKeyObj.className = 'consoleObjLineSecondary';
          protKeyObj.innerHTML = '[[Prototype]]';
          protLineOfObj.appendChild(protKeyObj);
          let protSplitObj = document.createElement('span');
          protSplitObj.className = 'consoleObjLineMidSp';
          protSplitObj.innerHTML = ':';
          protLineOfObj.appendChild(protSplitObj);
          let protValueObj = document.createElement('span');
          protValueObj.className = 'consoleObjLineRightSp insideConsoleObjLine';
          protLineOfObj.appendChild(protValueObj);

          thisObj.createChildConsoleLine(protValueObj, Object.getPrototypeOf(thisObj.obj));
        }
        else {
          store.objInfo.innerHTML = '';
        }
      }
    });

    this.parentOfObj.appendChild(wholeLineObj);

    this.parentOfObj = wrapOfBtn;
  }

  // CONSOLE LINE ACTION TO CASUAL OBJ
  lineIsSimpleObject() {
    // CREATE THE MAIN CORE OF HTML CONSOLE OBJECT LINE
    let wholeLineObj = document.createElement('div');
    wholeLineObj.className = 'consoleObjLine';
    wholeLineObj.id = 'consoleObjLine' + this.uniqueId;

    let wrapOfBtn = document.createElement('div');
    wrapOfBtn.className = 'beforeConsoleObjBtn';
    wrapOfBtn.id = 'beforeConsoleObjBtn' + this.uniqueId;
    wholeLineObj.appendChild(wrapOfBtn);
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
          btnP: document.querySelector('#consoleObjBtnP' + thisObj.uniqueId),
          wrapObjInfo: document.querySelector('#consoleObjLineWrapInfo' + thisObj.uniqueId),
          objInfo: document.querySelector('#consoleObjLineInfo' + thisObj.uniqueId)
        };

        store.btn.classList.toggle('consoleObjBtnDecorate');
        store.btnImg.classList.toggle('consoleObjBtnOpenedImg');

        store.wrapObjInfo.classList.toggle('closedConsoleObjLineInfo');

        if (store.btnImg.classList.contains('consoleObjBtnOpenedImg')) {
          // OBJ'S CHILDREN CHECK
          for (const [key, value] of Object.entries(thisObj.obj)) {
            // OBJ'S CHILD PROTOTYPE
            let lineOfObj = document.createElement('p');
            lineOfObj.className = 'consoleObjLineInfoP';
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

            thisObj.childObj = valueObj;

            thisObj.createChildConsoleLine(valueObj, value);
          }
        }
        else {
          store.objInfo.innerHTML = '';
        }
      }
    });

    this.parentOfObj.appendChild(wholeLineObj);

    this.parentOfObj = wrapOfBtn;
  }

  // CONSOLE ACTION TO BOOLEAN
  lineIsBoolean() {
    this.parentOfObj.innerHTML += `<span>${this.obj}</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineBoolean');
  }

  // CONSOLE ACTION TO NUMBER
  lineIsNumber() {
    this.parentOfObj.innerHTML += `<span>${this.obj}</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineNumber');
  }

  // CONSOLE ACTION TO STRING
  lineIsString() {
    this.parentOfObj.innerHTML += `<span>'${this.obj}'</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineString');
  }

  // CONSOLE LINE ACTION TO FUNCTION
  lineIsFunction() {
    let objStr = this.obj.toString();

    // STYLING
    let main = objStr.substring(0, objStr.indexOf(')'));
    let sec = objStr.substring(objStr.indexOf(')'), objStr.length);

    let main1, main2 = '';
    if (main.includes('function ')) {
      [main1, ...main2] = main.split(' ');
      main1 = 'f  ';
    }
    else {
      main1 = ' ';
      main2 = main;
    }

    this.parentOfObj.classList.add('consoleObjLineFunction');

    let spanF = document.createElement('span');
    spanF.className = 'consoleObjLineFunctionMain';
    spanF.innerHTML = main1;
    this.parentOfObj.appendChild(spanF);

    let spanC = document.createElement('p');
    spanC.className = 'consoleObjLineFunctionSecondary';
    spanC.innerHTML = main2 + ' ' + sec;
    this.parentOfObj.appendChild(spanC);
  }

  // CONSOLE ACTION TO NULL
  lineIsNullOrUndefined(msg) {
    this.parentOfObj.innerHTML += `<span>${msg}</span>`;

    // STYLING
    this.parentOfObj.classList.add('consoleObjLineNull');
  }

  // ADD NUM AND FILE LOC OF LINE, IF IS THE FIRST
  fileLocAndLineToShowIfNeeded() {
    let linkDestinations = this.fileLoc.split('/');
    let finalLinkDestination = linkDestinations[linkDestinations.length - 1] + ': ';

    this.parentOfFileAndLine.innerHTML = `<span class=''>${finalLinkDestination}${this.lineNum}</span>`;

    this.parentOfObj.classList.add('beforeConsoleObjBtnFirst');
  }





  increaseThisIdElmtnsSecCopy() {
    let copy = this.thisIdElmtns;
    copy.secondaryC++;
    return copy;
  }

  createChildConsoleLine(currObjELmnt, objsChild) {
    // CHILDREN DON'T NEED FILE LOC AND LINE NUMBER
    let child = { message: objsChild, file: null, line: null }

    // SEND TO CHILD OF THIS OBJ IN CONSOLE
    let newthisIdElmtns = this.increaseThisIdElmtnsSecCopy();
    const childObj = new ConsoleLine(currObjELmnt, child, newthisIdElmtns, this.consoleObj, this.typeOfLine);
    childObj.start();
  }
}