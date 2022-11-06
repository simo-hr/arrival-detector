require('dotenv').config()

export const config = {
  rakuten: {
    user_id: process.env.RAKUTEN_USER_ID || '',
    password: process.env.RAKUTEN_PASSWORD || '',
  },
}
