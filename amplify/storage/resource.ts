import { defineStorage } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { conversionFunction } from '../function/conversion-function/resource'
import { insertFunction } from '../function/insert-function/resource';
export const storage = defineStorage({
  name: 'myProjectFiles',
  triggers: {

    onUpload: conversionFunction,
    
  },
  access: (allow) => ({

    '/*': [

      allow.owner.to(['read','list','delete','write']),
      allow.resource(conversionFunction).to(['read', 'write', 'list', 'delete']),
      ]

  })

});