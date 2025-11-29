import { Page } from '@playwright/test'

export class Helpers {
    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async parseCaptcha(captchaString: string | null){
        let captchaSplit = captchaString?.split(' + ')
        let captchaSum = 0
        if (captchaSplit?.length == 2){
        captchaSum = parseInt(captchaSplit[0]) + parseInt(captchaSplit[1])
        }
        return captchaSum
    }

}