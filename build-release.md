# Release Procedure

## Testing the build

Run the following command:

    .\node_modules\.bin\tsc -p ./src --outDir dist/ --declaration

## Updating version package.json

Update the version in package.json file.

## Publishing

npm publish