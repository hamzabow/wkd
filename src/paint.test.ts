import {
  paintGray,
  paintGreen,
  paintRed,
  paintBlue,
  paintYellow,
  paintMagenta,
  paintCyan,
  paintWhite,
  paintBlack,
  paintBold,
  paintUnderline,
  paintBlink,
  paintReverse,
  paintHidden,
  paintStrikethrough,
} from "./paint.ts";

// Visual test function to display all painting styles
function displayAllStyles() {
  const sampleText = "Hello, World!";
  const styles = [
    { name: "Gray", fn: paintGray },
    { name: "Green", fn: paintGreen },
    { name: "Red", fn: paintRed },
    { name: "Blue", fn: paintBlue },
    { name: "Yellow", fn: paintYellow },
    { name: "Magenta", fn: paintMagenta },
    { name: "Cyan", fn: paintCyan },
    { name: "White", fn: paintWhite },
    { name: "Black", fn: paintBlack },
    { name: "Bold", fn: paintBold },
    { name: "Underline", fn: paintUnderline },
    { name: "Blink", fn: paintBlink },
    { name: "Reverse", fn: paintReverse },
    { name: "Hidden", fn: paintHidden },
    { name: "Strikethrough", fn: paintStrikethrough },
  ];

  console.log("\nVisual Test of Painting Functions:");
  console.log("==================================\n");

  styles.forEach(({ name, fn }) => {
    console.log(`${name.padEnd(15)}: ${fn(sampleText)}`);
  });

  // Test some combinations
  console.log("\nCombination Examples:");
  console.log("====================\n");
  console.log("Bold + Red:", paintBold(paintRed(sampleText)));
  console.log("Underline + Blue:", paintUnderline(paintBlue(sampleText)));
  console.log(
    "Bold + Yellow + Underline:",
    paintBold(paintYellow(paintUnderline(sampleText)))
  );
}

// Run the visual test
displayAllStyles();
