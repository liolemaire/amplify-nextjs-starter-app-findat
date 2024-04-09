import { defineFunction } from '@aws-amplify/backend';


export const conversionFunction = defineFunction({



    name: 'conversionFunction',
    entry: 'handler.ts' 

});