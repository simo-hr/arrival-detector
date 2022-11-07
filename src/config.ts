require('dotenv').config()

export const config = {
  rakuten: {
    user_id: process.env.RAKUTEN_USER_ID || '',
    password: process.env.RAKUTEN_PASSWORD || '',
  },
  line: {
    channel_secret: process.env.LINE_CHANNEL_SECRET || '',
    channel_access_token: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
    user_id: process.env.LINE_USER_ID || '',
  },
}
