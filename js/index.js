document.addEventListener('DOMContentLoaded', function() {
  var isGameStarted = false;
  let isGameDone = false;
  var isPlayerOne = true;
  var defNoticeText = "If you ready to start please choose one of the square on the board~";
  var crossCounter = 0;
  var circleCounter = 0;
  var boardClickCounter = 0;
  var boardScoreWrapper = [];
  mainFunc();

  function mainFunc() {
    let buttonElmnt = document.getElementById("applySizeButton");
    if(buttonElmnt && buttonElmnt != "" && buttonElmnt != null) buttonElmnt.onclick = () => {renderBoard();};
    renderBoard();
    appendNoticeText(defNoticeText);
  }

  function renderBoard() {
    let xLength = getScaleTicSize("x");
    let yLength = getScaleTicSize("y");
    if(xLength != 0 && yLength != 0) {
      generateTicTacToe(xLength, yLength);
      setListenerOnBoard();
      appendNoticeText(!isGameStarted ? defNoticeText : "enjoy your game :)");
    }
  }

  function getScaleTicSize(inputtedAxis) {
    if(inputtedAxis && inputtedAxis != "") {
      let inputFieldElmnt = inputtedAxis == "x" ? document.getElementById("inputAmount1") : document.getElementById("inputAmount2");
      let recentCurrentInput = inputFieldElmnt && inputFieldElmnt.value && inputFieldElmnt.value != 0 ? inputFieldElmnt.value : 3;
      if(recentCurrentInput == 1) {
        appendNoticeText("<span class='red-text'>*the minimum value to be inserted is 2</span>");
        inputFieldElmnt.focus();
        return 0;
      }
      return recentCurrentInput;
    }
    return 3;
  }

  function generateTicTacToe(xVal, yVal) {
    if(xVal && xVal != 0 && yVal && yVal != 0) {
      var panelContent = document.getElementById("ticMainWrapper");
      if(panelContent && panelContent != "" && panelContent != null) {
        panelContent.style.gridTemplateColumns = generateColumRowTemplateOnGrid(xVal);
        panelContent.style.gridTemplateRows = generateColumRowTemplateOnGrid(yVal);
        let panelWrapperWidth = panelContent.offsetWidth;
        let panelHtml = generateTicTacToeContent(xVal, yVal, panelWrapperWidth)
        panelContent.innerHTML = "";
        panelContent.innerHTML = panelHtml.toString().replace(/,/g,"");
      }
    }
  }

  function generateColumRowTemplateOnGrid(numberToRender) {
    let newString = "";
    for(var i = 0; i < numberToRender; i++) {
      if(i == 0) {
        newString = "auto";
      } else {
        newString += " auto";
      }
    }
    return newString;
  }

  function generateTicTacToeContent(xVal, yVal, wrapperWidth=100) {
    let itemTotal = xVal * yVal;
    let htmlContent = [];
    let widthHeightPanel = wrapperWidth / itemTotal + "px";
    let columnId = 0;
    let rowId = 0;
    let isSameLength = (xVal == yVal);
    let columnLength = xVal;
    let rowLength = yVal;
    boardScoreWrapper = []; /* reset board scorer */

    if(itemTotal && itemTotal != 0) {
      let panelId = "";
      boardScoreWrapper.push([]);
      for (var i = 0; i < itemTotal; i++) {
        if(i % columnLength == 0 && i != 0) {
          /* generate column index to match the board || if it zero it will not enter this condition */
          rowId += 1;
          boardScoreWrapper.push([]);
        }

        columnId = i < rowLength ? i : 0;
        let multipier = rowId + 1;
        if(isSameLength) {
          columnId = i < (rowLength * multipier) ? (i - (rowLength * (rowId))) : 0;
        } else if(!isSameLength && rowLength > columnLength) {
          rowLength = columnLength;
          columnId = i < (rowLength * multipier) ? (i - (rowLength * (rowId))) : 0;
        } else if(!isSameLength && rowLength < columnLength) {
          rowLength = columnLength;
          columnId = i < (rowLength * multipier) ? (i - (rowLength * (rowId))) : 0;
        } else {
          columnId = i < (rowLength * multipier) ? (i - (rowLength * (rowId))) : 0;
        }

        /* generate item obj to control it when we checking it */
        let itemObj = {
          "id": (rowId + "-" + columnId),
          "desc": ""
        };

        /* push the object based on the column (column, row) */
        boardScoreWrapper[rowId].push(itemObj);
        htmlContent.push(`<div style="width: `+widthHeightPanel+`; height: `+widthHeightPanel+`;" class="tic-content-item" id=`+(rowId + "-" + columnId)+` key=`+("ticItem"+i)+`></div>`);
      }
    }
    return htmlContent;
  }

  function appendNoticeText (inputText) {
    var noticeWrapper = document.getElementById("ticNoticeWrapper");
    if(noticeWrapper && noticeWrapper != "" && noticeWrapper != null) noticeWrapper.innerHTML = inputText;
  }

  function setListenerOnBoard() {
    let panelItem = document.getElementsByClassName("tic-content-item");
    if(panelItem && panelItem != "" && panelItem != null && panelItem.length && panelItem.length > 0) {
      for (var i = 0; i < panelItem.length; i++) {
        panelItem[i].addEventListener('click', (events) => {chosenPanel(events.target)}, false);
      }
    }

    let resetButtonElmnt = document.getElementById("resetButton");
    if(resetButtonElmnt && resetButtonElmnt != "" && resetButtonElmnt != null) {
      resetButtonElmnt.addEventListener('click', () => {disableEnableHelper(true)}, false);
    };
  }

  function disableEnableHelper(isReset=false) {
    let inputColumn = document.getElementById("inputAmount1");
    let inputRows = document.getElementById("inputAmount2");
    let buttonApply = document.getElementById("applySizeButton");
    if(inputColumn && inputColumn != "" && inputColumn != null &&
      inputRows && inputRows != "" && inputRows != null &&
      buttonApply && buttonApply != "" && buttonApply != null
    ) {
      if(isReset) {
        inputColumn.removeAttribute("disabled", true);
        inputRows.removeAttribute("disabled", true);
        inputColumn.classList.remove("disable-input");
        inputRows.classList.remove("disable-input");
        buttonApply.classList.remove("disable-element");
        cleanBoard();
        isGameDone = false;
        isGameStarted = false;
        isPlayerOne = true;
        crossCounter = 0;
        circleCounter = 0;
        boardClickCounter = 0;
        boardScoreWrapper = [];
        renderBoard();
        appendNoticeText(defNoticeText);
      } else {
        inputColumn.setAttribute("disabled", true);
        inputRows.setAttribute("disabled", true);
        inputColumn.classList.add("disable-input");
        inputRows.classList.add("disable-input");
        buttonApply.classList.add("disable-element");
        inputColumn
        inputRows
        let noticeInGame = "enjoy your game :)";
        if(inputColumn.value && inputColumn.value != 0 && inputRows.value && inputRows.value != 0) {
          let diagonalAmount = (inputColumn.value == inputRows.value || inputColumn.value < inputRows.value) ? inputColumn.value : inputRows.value;
          noticeInGame = `Attention: The winning condition for this session is, horizontal match: <span class="green-text">`+inputColumn.value+` match tile</span>, vertical match: <span class="orange-text">`+inputRows.value+` match tile</span>, diagonal match: <span class="blue-text">`+diagonalAmount+` match tile</span>.`;
        }
        appendNoticeText(!isGameStarted ? defNoticeText : noticeInGame);
      }
    }
  }

  function cleanBoard() {
    let panelItem = document.getElementsByClassName("tic-content-item");
    if(panelItem && panelItem != "" && panelItem != null && panelItem.length && panelItem.length > 0) {
      for (var i = 0; i < panelItem.length; i++) {
        panelItem[i].classList.remove("crossed-panel");
        panelItem[i].classList.remove("circled-panel");
        panelItem[i].style.pointerEvents = "auto";
      }
    }
  }

  function chosenPanel(elementSelected) {
    if(elementSelected && elementSelected != "" && elementSelected != null) {
      let crossCircleClassName = isPlayerOne ? "crossed-panel" : "circled-panel";
      if(isPlayerOne) {
        crossCounter += 1;
      } else {
        circleCounter += 1;
      }
      boardClickCounter += 1;
      updateBoardScoreWrapper(isPlayerOne, elementSelected.id);
      isPlayerOne = !isPlayerOne;
      elementSelected.classList.add(crossCircleClassName);
      elementSelected.style.pointerEvents = "none";
      proccessTheGame(elementSelected);

      if(!isGameStarted) {
        isGameStarted = true;
        disableEnableHelper();
      }
    }
  }

  function updateBoardScoreWrapper(isCrossed, elementId) {
    let splitElementId = elementId.split("-");
    if(splitElementId.length == 2) {
      let rowId = splitElementId[0];
      let columnId = splitElementId[1];
      boardScoreWrapper[rowId][columnId]["desc"] = isCrossed ? "cross" : "circle";
    }
  }

  function proccessTheGame(lastSelected){
    let xLength = getScaleTicSize("x");
    let yLength = getScaleTicSize("y");
    if(xLength != 0 && yLength != 0) {
      let winScore = (xLength == yLength || xLength < yLength) ? xLength : yLength;
      if(crossCounter >= winScore || circleCounter >= winScore) {
        checkingBoard();
      } else if ((xLength * yLength) == boardClickCounter) {
        checkingBoard(true);
      }
    }
  }

  function checkingBoard(outOfTurn = false) {
    let rowCheck = 0;
    let crStatus = horizontalCheck();
    if(crStatus == "") crStatus = verticalCheck();
    if(crStatus == "") crStatus = diagonalRightCheck();
    if(crStatus == "") crStatus = diagonalLeftCheck();
    if(crStatus != "") {
      announceWinner(crStatus);
    } else if(crStatus == "" && outOfTurn) {
      announceWinner(crStatus, true);
    }
  }

  function announceWinner(winner, outOfTurn) {
    if(winner && winner == "cross") {
      appendNoticeText("Congratulations to <span class='orange-text'>Player 1</span>, you winning this game");
    } else if(winner && winner == "circle") {
      appendNoticeText("Congratulations to <span class='green-text'>Player 2</span>, you winning this game");
    } else if (winner == "" && outOfTurn) {
      appendNoticeText("Sorry we can't decide the winner");
    }
    isGameDone = true;
    disablePanel();
  }

  function disablePanel() {
    let panelItem = document.getElementsByClassName("tic-content-item");
    if(isGameDone && panelItem && panelItem != "" && panelItem != null && panelItem.length && panelItem.length > 0) {
      for (var i = 0; i < panelItem.length; i++) {
        panelItem[i].style.pointerEvents = "none";
      }
    }
  }

  function horizontalCheck() {
    let winningScore = getScaleTicSize("x");
    let crossCount = 0;
    let circleCount = 0;
    let returnStatus = "";
    for(var i = 0; i < boardScoreWrapper.length; i++) {
      crossCount = 0;
      circleCount = 0;
      for(var j = 0; j < boardScoreWrapper[i].length; j++) {
        if(boardScoreWrapper[i][j] && boardScoreWrapper[i][j]["desc"] && boardScoreWrapper[i][j]["desc"] == "circle") {
          circleCount += 1;
        } else if(boardScoreWrapper[i][j] && boardScoreWrapper[i][j]["desc"] && boardScoreWrapper[i][j]["desc"] == "cross") {
          crossCount += 1;
        }
        if(j == (boardScoreWrapper[i].length-1)) {
          returnStatus = (crossCount == winningScore) ? "cross" : ((circleCount == winningScore) ? "circle" : "");
          if(returnStatus != "") return returnStatus;
        }
      }
    }
    return "";
  }

  function verticalCheck() {
    let winningScore = getScaleTicSize("y");
    let crossCount = 0;
    let circleCount = 0;
    let newBoardScoreWrapper = transpose(boardScoreWrapper);
    let returnStatus = "";
    for(var i = 0; i < newBoardScoreWrapper.length; i++) {
      crossCount = 0;
      circleCount = 0;
      for(var j = 0; j < newBoardScoreWrapper[i].length; j++) {
        if(newBoardScoreWrapper[i][j] && newBoardScoreWrapper[i][j]["desc"] && newBoardScoreWrapper[i][j]["desc"] == "circle") {
          circleCount += 1;
        } else if(newBoardScoreWrapper[i][j] && newBoardScoreWrapper[i][j]["desc"] && newBoardScoreWrapper[i][j]["desc"] == "cross") {
          crossCount += 1;
        }
        if(j == (newBoardScoreWrapper[i].length-1)) {
          returnStatus = (crossCount == winningScore) ? "cross" : ((circleCount == winningScore) ? "circle" : "");
          if(returnStatus != "") return returnStatus;
        }
      }
    }
    return "";
  }

  function diagonalRightCheck() {
    let xLength = getScaleTicSize("x");
    let yLength = getScaleTicSize("y");
    let winningScore = (xLength == yLength || xLength < yLength) ? xLength : yLength;
    let crossCount = 0;
    let circleCount = 0;
    let returnStatus = "";
    for(var i = 0; i < boardScoreWrapper.length; i++) {
      if(boardScoreWrapper[i][i] && boardScoreWrapper[i][i]["desc"] && boardScoreWrapper[i][i]["desc"] == "circle") {
        circleCount += 1;
      } else if(boardScoreWrapper[i][i] && boardScoreWrapper[i][i]["desc"] && boardScoreWrapper[i][i]["desc"] == "cross") {
        crossCount += 1;
      }
      if(i == (boardScoreWrapper.length-1)) {
        returnStatus = (crossCount == winningScore) ? "cross" : ((circleCount == winningScore) ? "circle" : "");
        if(returnStatus != "") return returnStatus;
      }
    }
    return "";
  }

  function diagonalLeftCheck() {
    let xLength = getScaleTicSize("x");
    let yLength = getScaleTicSize("y");
    let winningScore = (xLength == yLength || xLength < yLength) ? xLength : yLength;
    let crossCount = 0;
    let circleCount = 0;
    let returnStatus = "";
    for(var i = 0; i < boardScoreWrapper.length; i++) {
      let rIdx = winningScore - i - 1;
      if(boardScoreWrapper[i][rIdx] && boardScoreWrapper[i][rIdx]["desc"] && boardScoreWrapper[i][rIdx]["desc"] == "circle") {
        circleCount += 1;
      } else if(boardScoreWrapper[i][rIdx] && boardScoreWrapper[i][rIdx]["desc"] && boardScoreWrapper[i][rIdx]["desc"] == "cross") {
        crossCount += 1;
      }
      if(i == (boardScoreWrapper.length-1)) {
        returnStatus = (crossCount == winningScore) ? "cross" : ((circleCount == winningScore) ? "circle" : "");
        if(returnStatus != "") return returnStatus;
      }
    }
    return "";
  }

  function transpose(original) {
    var copy = [];
    for (var i = 0; i < original.length; ++i) {
      for (var j = 0; j < original[i].length; ++j) {
        /* skip undefined values to preserve sparse array */
        if (original[i][j] === undefined) continue;
        /* create row if it doesn't exist yet */
        if (copy[j] === undefined) copy[j] = [];
        /* swap the x and y coords for the copy */
        copy[j][i] = original[i][j];
      }
    }
    return copy;
  }
});
