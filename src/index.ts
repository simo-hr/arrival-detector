import playwright from 'playwright'
import { config } from './config'
import { sleep } from './utils/functions'
import { notify } from './notifications/line'

// ポケモンカードゲーム ソード＆シールド 拡張パック パラダイムトリガー
const url = 'https://books.rakuten.co.jp/rb/17222117'
// ポケットモンスター カードポッド for Nintendo Switch　Type-A
// const url = 'https://books.rakuten.co.jp/rb/16842902'

const mode = config.mode
const main = async () => {
  await sleep(1000)
  const browser = await playwright.firefox.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(url)

  /* 在庫チェック */
  const statusEl = page.locator('#purchaseBox .status-text > div.status-heading > span')
  const status = await statusEl.textContent()
  if (status?.includes('ご注文できない商品')) {
    await browser.close()
    await main()
  } else if (!status?.includes('在庫あり')) {
    console.log('unexpected status:', status)
    await browser.close()
    await main()
  }

  /* 購入 or 通知 */
  if (mode === 'notify') {
    await notify(`入荷されました。\n${url}`)
  } else if (mode === 'automatic_purchase') {
    /* お買い物かごに追加ボタンをクリック */
    const addCartButton = page.locator('.new_addToCart')
    await addCartButton.click()
    /* ご購入手続きボタンをクリック */
    const cartBtn = page.locator('#js-cartBtn')
    /* ログイン */
    await cartBtn.click()
    await page
      .locator(
        '#login_valid > div > div > div.section-in__main.user-login > div:nth-child(2) > div.input-login > input'
      )
      .fill(config.rakuten.user_id)
    await page
      .locator(
        '#login_valid > div > div > div.section-in__main.user-login > div:nth-child(3) > div.input-login > input'
      )
      .fill(config.rakuten.password)
    const nextBtnInLogin = page.locator('#login_valid > div > div > div.section-in__sub > button')
    await nextBtnInLogin.click()

    /* 金額チェック */
    const price = page.locator(
      'body > div.cart__main > div > div.cart__main__step4 > form > div.sub > div > div > div.cost-detail > dl > dd'
    )
    const priceText = await price.textContent()
    if (Number(priceText?.replace(',', '').replace('円(税込)', '')) > 1000) {
      console.log('1000円以上です')
      return await browser.close()
    }
  }

  await browser.close()
}

main()
