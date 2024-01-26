# Reactulate++ | Integrating C++ with React.js

We will briefly explain how to integrate C++ code with a React.js application using Emscripten. Emscripten is a toolchain for compiling C/C++ code into WebAssembly, making it accessible to JavaScript and allowing you to seamlessly combine the power of C++ with the flexibility of React.js.

## Prerequisites
Before you start, make sure you have the following prerequisites installed on your system:

- **Node.js and npm: To manage your React.js project.**

- **Emscripten: To compile C++ code to WebAssembly.**

- **Basic knowledge of React.js and C++.**

## Steps
### 1. Create a React.js Project

If you don't have an existing React.js project, create one using the following command:

```
npx create-react-app cplusplus-react-app
```

Change to the project directory:

```
cd cplusplus-react-app
```

### 2. Write Your C++ Code

Write your C++ code that you want to integrate into the React.js application. In this example, we have a gradient.cpp file that contains a gradient descent algorithm. Make sure to include any necessary dependencies and define the functions you want to call from JavaScript.

### 3. Create a Makefile

To compile the C++ code to WebAssembly, create a `Makefile`. This file should contain the compilation instructions using Emscripten. For example:

```
src/dist/gradient.mjs: cpp/gradient.cpp
    emcc cpp/gradient.cpp cpp/tinyexpr.c -o src/dist/gradient.mjs \
        -s ENVIRONMENT='web' \
        -s SINGLE_FILE=1 \
        -s EXPORT_NAME='createGradientModule' \
        -s USE_ES6_IMPORT_META=0 \
        -I cpp \
        -s EXPORTED_FUNCTIONS='["_init", "_generate_next_chunk", "_get_history_x", "_get_history_y", "_get_history_size", "_get_error_message", "_get_if_stopped"]' \
        -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
        -O3
```

This Makefile instructs Emscripten to compile your C++ code into a WebAssembly module named `gradient.mjs`. Adjust the flags and options according to your project's requirements.

### 4. Build the C++ Module

Run the `make` command to build the C++ module:

```
make
```

This will generate the `gradient.mjs` file in the `src/dist` directory.

### 5. Create a JavaScript Module
In your React.js project, create a JavaScript module that imports the compiled C++ module. For example:

```
// createGradientModule.js
import createGradientModule from "./dist/gradient.mjs";

export default async function initializeGradientModule() {
  const Module = await createGradientModule();

  function callGradientDescent(/* parameters */) {
    // Call C++ functions from Module
    // ...
  }

  // Export functions or objects as needed
  return {
    callGradientDescent,
    // ...
  };
}
```

### 6. Use the C++ Module in React.js
In your React.js components, use the functions and objects exported from the JavaScript module to interact with the C++ code. Import the module and call the C++ functions as needed.

```
import React, { useEffect, useState } from "react";
import initializeGradientModule from "./createGradientModule";

function App() {
  const [gradientModule, setGradientModule] = useState(null);

  useEffect(() => {
    async function initializeModule() {
      const module = await initializeGradientModule();
      setGradientModule(module);
    }

    initializeModule();
  }, []);

  useEffect(() => {
    if (gradientModule) {
      // Use functions from the C++ module
      // gradientModule.callGradientDescent(/* parameters */);
    }
  }, [gradientModule]);

  // Render your React components and UI here

  return (
    <div className="App">
      {/* Your React components */}
    </div>
  );
}

export default App;
```

### 7. Build and Run the React.js Application
Build and run your React.js application as you normally would:

```
npm start
```

Your React.js application should now be able to interact with the C++ code through the Emscripten-generated WebAssembly module.

# React running app

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
