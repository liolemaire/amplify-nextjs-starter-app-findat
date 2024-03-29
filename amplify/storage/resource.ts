import { defineStorage } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { myDemoFunction } from '../function/my-demo-function/resource'
export const storage = defineStorage({
  name: 'myProjectFiles',
  triggers: {

    onUpload: myDemoFunction
    
    // defineFunction({
    //   name:'myDemoFunction',
    //   entry:'../function/my-demo-function/handler.ts'
    // }),

  },
  access: (allow) => ({

    '/*': [

      allow.owner.to(['read','list','delete','write']),
      allow.resource(myDemoFunction).to(['read', 'write', 'list', 'delete'])
    ]

  })

});