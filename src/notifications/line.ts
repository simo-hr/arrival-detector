import { Client } from '@line/bot-sdk'
import { config } from '../config'

const client = new Client({
  channelSecret: config.line.channel_secret,
  channelAccessToken: config.line.channel_access_token,
})

export const notify = async (message: string) => {
  await client
    .pushMessage(config.line.user_id, [
      {
        type: 'text',
        text: message,
      },
    ])
    .catch((error: any) => {
      console.log(error)
    })
}
