# Wwise Authoring API Client

To use waapi client in a Node.js project:

`npm install waapi-client --save`

waapi-client is normally used in conjunction with waapi module:

`npm install waapi --save`

waapi-client also comes with TypeScript definitions.

## Example

This example is a Node.js TypeScript example using ES2015 js target.

```
import * as waapi from 'waapi-client';
import {ak} from 'waapi';

async function main() {
    try {
        var session = await waapi.connect('ws://localhost:8080/waapi');

        var wwiseInfo = await session.call(ak.wwise.core.getInfo, {});
        console.log(`Connected to ${wwiseInfo.displayName} ${wwiseInfo.version.displayName}!`);
    }
    catch(e){
        console.log(`exception: ${JSON.stringify(e,null,4)}`);
    }
}

main();
```

Refer to [hello-wwise on GitHub](https://github.com/decasteljau/waapi-hello-wwise-async/blob/master/index.ts) for a more complete example.
