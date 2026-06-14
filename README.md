# Sequence-Controller-Animation 🎬⚡💻

This repository contains the solution for the **Sequencing Animations** challenge from the [MDN Web Docs: Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Sequencing_animations).

It was completed as part of the **MuLearn** task: **Sequencing Animations 🎬⚡💻 (100 Karma Points)**.

## 📝 Challenge Overview

The goal of this project is to animate a series of images (Alices) sequentially using JavaScript Promises. Specifically, the animation for the second image only begins once the first image has finished its animation, and the third image waits for the second to finish.

This effectively demonstrates the power of asynchronous JavaScript, showing how to avoid "callback hell" and properly manage the `Animation.finished` promise returned by the Web Animations API.

## 🛠️ Technologies Used

- **HTML5** & **CSS3** (MDN Starter Code)
- **JavaScript (ES6+)**
  - Web Animations API (`element.animate()`)
  - JavaScript Promises (`.then()`, `.catch()`)

## 🚀 How to Run

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Salvin-Sebastian/Sequence-Controller-Animation.git
   ```
2. Open the `index.html` file in any modern web browser.
3. Watch the sequence of animations trigger one after another!

## 💡 Implementation Details

The core logic resides in `main.js`. By tapping into the `finished` property of the `Animation` object (which returns a Promise), we are able to easily sequence the transformations cleanly:

```javascript
alice1.animate(aliceTumbling, aliceTiming).finished
  .then(() => alice2.animate(aliceTumbling, aliceTiming).finished)
  .then(() => alice3.animate(aliceTumbling, aliceTiming).finished)
  .catch((error) => console.error(`Error animating Alices: ${error}`));
```

---
*Completed for the MuLearn learning journey.*
