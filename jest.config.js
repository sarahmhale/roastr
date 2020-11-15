module.exports = {
      "transform": {
      "^.+\\.svelte$": [
        "svelte-jester",
        {
          "preprocess": true
        }
      ],
      "^.+\\.ts$": "ts-jest",
      "^.+\\.js$": "babel-jest"
    },
    "moduleFileExtensions": [
      "js",
      "ts",
      "svelte",
      "json"
    ],
    "setupFilesAfterEnv": ["@testing-library/jest-dom/extend-expect"],
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.ts",
      "\\.(css|scss|stylesheet)$": "<rootDir>/__mocks__/styleMock.ts"
    },
    "testPathIgnorePatterns": ["/node_modules/", "/public/build/", "/storybook-static/"]
};