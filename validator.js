var fs = require("fs");

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      if (!filename.endsWith("json") || filename === "template.json") {
        return;
      }
      fs.readFile(dirname + filename, "utf-8", function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

const clueValues = [200, 400, 600, 800, 1000];

function checkRegularRound(obj, roundName) {
  const isSingle = roundName === "single";
  const multiplier = isSingle ? 1 : 2;
  if (obj.length !== 6) {
    throw new Error(`${roundName} must have 6 categories.`);
  }
  const allContent = new Set();
  let numDailyDouble = 0;
  obj.forEach(function(category) {
    if (category.name === "") {
      throw new Error("category name cannot be empty");
    }
    if (category.clues.length !== 5) {
      throw new Error(
        `${roundName} category ${category.name} must have 5 clues.`
      );
    }
    category.clues.forEach(function(clue, i) {
      checkClue(clue);
      const expectedValue = clueValues[i] * multiplier;
      if (clue.value !== expectedValue) {
        throw new Error(
          `${roundName} category ${category.name} clue index ${i} expected value ${expectedValue} got ${clue.value}.`
        );
      }
      if (clue.isDailyDouble) {
        numDailyDouble++;
      }
      if (allContent.has(clue.text)) {
        throw new Error(
          `${roundName} category ${category.name} ${clue.value} duplicate clue: ${clue.text}`
        );
      }
      allContent.add(clue.text);
      if (allContent.has(clue.answer)) {
        throw new Error(
          `${roundName} category ${category.name} ${clue.value} duplicate answer: ${clue.answer}`
        );
      }
      allContent.add(clue.answer);
    });
  });
  if (
    (isSingle && numDailyDouble !== 1) ||
    (!isSingle && numDailyDouble !== 2)
  ) {
    throw new Error(
      roundName + " has the incorrect number of daily doubles " + numDailyDouble
    );
  }
}

function checkFinalRound(obj) {
  if (obj.name === "") {
    throw new Error("category name cannot be empty");
  }
  if (obj.clues.length !== 1) {
    throw new Error("final jeopardy should have only one clue");
  }
  checkClue(obj.clues[0]);
}

function checkClue(obj) {
  if (obj.text == null || obj.text === "") {
    throw new Error("clue should have text");
  }
  if (obj.answer == null || obj.answer === "") {
    throw new Error("clue should have an answer");
  }
}

readFiles(
  "./",
  function(filename, content) {
    console.log("Testing file " + filename);
    let hasError = false;
    try {
      const game = JSON.parse(content);
      checkRegularRound(game.single, "single");
      checkRegularRound(game.double, "double");
      checkFinalRound(game.final);
    } catch (e) {
      console.log("Error encountered: " + e.message);
      hasError = true;
    }
    if (hasError) {
      throw new Error("At least one game failed validation.");
    }
  },
  function(err) {
    throw err;
  }
);
