import { defineStorage } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { conversionFunction } from '../function/conversion-function/resource'
export const storage = defineStorage({
  name: 'myProjectFiles',
  triggers: {

    onUpload: conversionFunction,
    
    
    // defineFunction({
    //   name:'myDemoFunction',
    //   entry:'../function/my-demo-function/handler.ts'
    // }),

  },
  access: (allow) => ({

    '/*': [

      allow.owner.to(['read','list','delete','write']),
      allow.resource(conversionFunction).to(['read', 'write', 'list', 'delete'])
    ]

  })

});