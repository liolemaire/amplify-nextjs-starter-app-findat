import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'myProjectFiles',

  access: (allow) => ({

    '/*': [

      allow.owner.to(['read','list','delete','write'])

    ]

  })

});