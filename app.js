import fs from 'node:fs';

const fieldHeight = 19
const stonesToWin = 5

const convertStringToNumberArray = (string) => {
  return string.split('').map(char => parseInt(char))
}

const analyzeLine = (line) => {
  return line.findIndex((checkNumber, id) => {
    return line.slice(id, id + stonesToWin).every(number => number === checkNumber && checkNumber > 0)
  })
}

const analyzeDiahonalLine = (line) => {
  return line.find((checkItem, id) => {
    return line.slice(id, id + stonesToWin).every(item => item.player === checkItem.player && checkItem.player > 0)
  })
}

const analyzeGameResults = (gameResults) => {
  for(let horisontalLineNumber = 0; horisontalLineNumber < gameResults.length; horisontalLineNumber++) {
    const winnerColumnId = analyzeLine(gameResults[horisontalLineNumber])
    if(winnerColumnId > -1) {
      return {
        winner: gameResults[horisontalLineNumber][winnerColumnId],
        rowId: horisontalLineNumber,
        columnId: winnerColumnId,
      }
    }
  }
  for(let verticalLineNumber = 0; verticalLineNumber < gameResults.length; verticalLineNumber++) {
    const line = gameResults.map((line, id) => gameResults[id][verticalLineNumber])
    const winnerRowId = analyzeLine(line)
    if(winnerRowId > -1) {
      return {
        winner: gameResults[winnerRowId][verticalLineNumber],
        rowId: winnerRowId,
        columnId: verticalLineNumber,
      }
    }
  }
  for(let diahonalLineNumber = stonesToWin - 1; diahonalLineNumber < gameResults.length * 2 - stonesToWin; diahonalLineNumber++) {
    const line = []
    if(diahonalLineNumber < fieldHeight) {
      for (let i = 0; i < diahonalLineNumber + 1; i++) {
        line.push({
          player: gameResults[diahonalLineNumber - i][i],
          row: diahonalLineNumber - i,
          column: i
        })
      }
    } else {
      for (let i = fieldHeight - 1; i > diahonalLineNumber - fieldHeight; i--) {
        line.push({
          player: gameResults[i][diahonalLineNumber - i],
          row: i,
          column: diahonalLineNumber - i
        })
      }
    }
    const winner = analyzeDiahonalLine(line)
    if(winner) {
      return {
        winner: winner.player,
        rowId: winner.row,
        columnId: winner.column,
      }
    }
  }
  for(let diahonalLineNumber = stonesToWin - 1; diahonalLineNumber < gameResults.length * 2 - stonesToWin; diahonalLineNumber++) {
    const line = []
    if(diahonalLineNumber < fieldHeight) {
      for (let i = 0; i < diahonalLineNumber + 1; i++) {
        line.push({
          player: gameResults[i][fieldHeight - diahonalLineNumber + i - 1],
          row: i,
          column: fieldHeight - diahonalLineNumber + i - 1
        })
      }
    } else {
      for (let i = 0; i < 2 * fieldHeight - diahonalLineNumber - 1; i++) {
        line.push({
          player: gameResults[diahonalLineNumber - fieldHeight + i + 1][i],
          row: diahonalLineNumber - fieldHeight + i + 1,
          column: i
        })
      }
    }
    const winner = analyzeDiahonalLine(line)
    if(winner) {
      return {
        winner: winner.player,
        rowId: winner.row,
        columnId: winner.column,
      }
    }
  }
}

const inputFile = fs.readFileSync('./input.txt')
const inputText = inputFile.toString()
const splitedInputText = inputText.split('\r\n')
const testCasesNumber = parseInt(splitedInputText.splice(0, 1)[0])
const testCases = []
let testCaseBuffer = []
splitedInputText.forEach((line, id) => {
  testCaseBuffer.push(convertStringToNumberArray(line))
  if (testCaseBuffer.length === fieldHeight && testCases.length < testCasesNumber) {
    testCases.push(testCaseBuffer)
    testCaseBuffer = []
  }
})

testCases.forEach((testCase, id) => {
  const result = analyzeGameResults(testCase)
  console.log(`Test case ${id+1}`)
  if(result) {
    console.log(`${result.winner}
${result.rowId + 1} ${result.columnId + 1}`)
  }
  else {
    console.log(0)
  }
})