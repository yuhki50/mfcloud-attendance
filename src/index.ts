import * as puppeteer from 'puppeteer'
import {Command, flags} from '@oclif/command'

class MfcloudAttendance extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (--company=VALUE)
    company: flags.string({description: 'MFCloud company', required: true}),
    // flag with a value (--email=VALUE)
    email: flags.string({description: 'MFCloud email', required: true}),
    // flag with a value (--password=VALUE)
    password: flags.string({description: 'MFCloud password', required: true}),
    // flag (--arrive)
    arrive: flags.boolean({description: 'Arrive company'}),
    // flag (--leave)
    leave: flags.boolean({description: 'Leave company'}),
    // flag with a value (-d, --delay)
    delay: flags.integer({char: 'd', description: 'Delay [minute]'}),
    // flag (-r, --random)
    random: flags.boolean({char: 'r', description: 'Enable random delay time', dependsOn: ['delay']}),
  }

  async run() {
    const {flags} = this.parse(MfcloudAttendance)

    const browser = await puppeteer.launch({
      args: [
        '--lang=ja,en-US,en',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    })

    const page = await browser.newPage()

    await page.emulate({
      viewport: {
        width: 1920,
        height: 1080,
      },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    })

    try {
      await page.goto('https://attendance.moneyforward.com/employee_session/new')
      await page.type('input#employee_session_form_office_account_name', flags.company || '')
      await page.type('input#employee_session_form_account_name_or_email', flags.email || '')
      await page.type('input#employee_session_form_password', flags.password || '')
      await page.click('input[name=commit]')
      await page.waitForSelector('h1.attendance-category-title', {timeout: 3000})

      const minDelay = 0
      const delay = flags.delay || minDelay
      const randomDelay = flags.random ? Math.floor(Math.random() * delay) : delay
      await page.waitFor((randomDelay > minDelay ? randomDelay : minDelay) * 1000 * 60)

      if (flags.arrive) {
        await page.click('ul.attendance-card-time-stamp-list li:nth-child(1) a.attendance-card-time-stamp-button.attendance-text-link') // 出勤
      } else if (flags.leave) {
        await page.click('ul.attendance-card-time-stamp-list li:nth-child(2) a.attendance-card-time-stamp-button.attendance-text-link') // 退勤
      }
    }
    catch (e) {
      console.log(e)
      await page.screenshot({path: 'error-screen.png'})
    }

    await browser.close()
  }
}

export = MfcloudAttendance
