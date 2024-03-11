import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'myProjectFiles',

  access: (allow) => ({

    '/foo/{entity_id}/*': [

      allow.owner.to(['read','list','delete','write'])

    ]

  })

});