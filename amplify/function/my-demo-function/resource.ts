import { defineFunction } from '@aws-amplify/backend';


export const myDemoFunction = defineFunction({



    name: 'myDemoFunction',
    entry: 'handler.ts' 

});