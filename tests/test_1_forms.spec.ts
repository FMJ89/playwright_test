import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { Helpers } from '../helpers/helpers'

test.beforeEach(async({page}) => {
    await page.goto('https://ultimateqa.com/automation')
    await page.getByText('Fill out forms').click()
})

test('Basic - fill the form without captcha', {tag: '@test_tag'}, async({page}) => {
    let helpers = new Helpers(page)
    const form0 = page.locator('#et_pb_contact_form_0')

    // random data
    const randomName = faker.person.firstName()
    const message = faker.lorem.lines(5)

    // fields have easier locators - practicing indirect approach
    await form0.getByPlaceholder('Name').fill(randomName)
    await form0.locator('.et_pb_contact_message').fill(message)
    await form0.getByRole('button').click()
    await expect(form0.locator('.et-pb-contact-message > p')).toHaveText('Thanks for contacting us')
})

test('Captcha form - all data, correct captcha', async({page}) => {
    let helpers = new Helpers(page)
    const form1 = page.locator('.et_pb_contact_form_1')

    // random data
    const randomName = faker.person.firstName()
    const message = faker.lorem.lines(5)
    
    // calculating captcha
    let captchaString = await page.locator('.et_pb_contact_captcha_question').textContent()
    let captchaSum = await helpers.parseCaptcha(captchaString)

    // filling fields
    await form1.getByPlaceholder('Name').fill(randomName)
    await form1.locator('.et_pb_contact_message').fill(message)
    await form1.locator(".et_pb_contact_captcha").fill(captchaSum.toString())
    await form1.getByRole('button').click()
    await expect(form1.locator('.et-pb-contact-message > p')).toHaveText('Thanks for contacting us')
})

test('Basic - incorrect captcha', async({page}) => {
    let helpers = new Helpers(page)
    const form1 = page.locator('.et_pb_contact_form_1')

    // random data
    const randomName = faker.person.firstName()
    const message = faker.lorem.lines(5)

    // calculating captcha, incorrect number
    let captchaString = await page.locator('.et_pb_contact_captcha_question').textContent()
    let captchaSum = await helpers.parseCaptcha(captchaString) + 1

    // filling fields
    await form1.getByPlaceholder('Name').fill(randomName)
    await form1.locator('.et_pb_contact_message').fill(message)
    await form1.locator(".et_pb_contact_captcha").fill(captchaSum.toString())
    await form1.getByRole('button').click()
    await expect(form1.locator('.et-pb-contact-message')).toHaveText('You entered the wrong number in captcha.')
})

test('Basic - no captcha entered', async({page}) => {
    const form1 = page.locator('.et_pb_contact_form_1')

    // random data
    const randomName = faker.person.firstName()
    const message = faker.lorem.lines(5)

    // filling fields
    await form1.getByPlaceholder('Name').fill(randomName)
    await form1.locator('.et_pb_contact_message').fill(message)
    await form1.getByRole('button').click()
    await expect(form1.locator('.et-pb-contact-message > p')).toHaveText('Please, fill in the following fields:')
    await expect(form1.locator('.et-pb-contact-message > ul > li')).toHaveText('Captcha')
})

test('Captcha form - no data entered.', async({page}) => {
    const form1 = page.locator('.et_pb_contact_form_1')
    
    // click the button with no fields filled.
    await form1.getByRole('button').click()
    await expect(form1.locator('.et-pb-contact-message > p')).toHaveText('Please, fill in the following fields:')
    await expect(form1.locator('.et-pb-contact-message > ul > li')).toHaveText(['Name', 'Message', 'Captcha'])
})

test('Captcha form - string instead of number', async({page}) => {
    const form1 = page.locator('.et_pb_contact_form_1')

    // random data
    const randomName = faker.person.firstName()
    const message = faker.lorem.lines(5)
    const captchaString = faker.string.alpha(5)

    // filling fields
    await form1.getByPlaceholder('Name').fill(randomName)
    await form1.locator('.et_pb_contact_message').fill(message)
    await form1.locator(".et_pb_contact_captcha").fill(captchaString)
    console.log(`Captcha string: ${captchaString}`)
    await form1.getByRole('button').click()
    await expect(form1.locator('.et-pb-contact-message')).toHaveText('You entered the wrong number in captcha.')
})

test('Captcha form - wrong captcha, then correct', async({page}) => {
    let helpers = new Helpers(page)
    const form1 = page.locator('.et_pb_contact_form_1')

    // random data
    const randomName = faker.person.firstName()
    const message = faker.lorem.lines(5)
    
    // calculating captcha
    let captchaString = await page.locator('.et_pb_contact_captcha_question').textContent()
    let captchaSum = await helpers.parseCaptcha(captchaString) + 1 

    // filling fields, wring captcha
    await form1.getByPlaceholder('Name').fill(randomName)
    await form1.locator('.et_pb_contact_message').fill(message)
    await form1.locator(".et_pb_contact_captcha").fill((captchaSum + 1).toString())
    await page.waitForTimeout(1000)
    await form1.getByRole('button').click()
    await expect(form1.locator('.et-pb-contact-message')).toHaveText('You entered the wrong number in captcha.')

    // redoing correct captcha, submitting.
    captchaString = await page.locator('.et_pb_contact_captcha_question').textContent()
    captchaSum = await helpers.parseCaptcha(captchaString)
    await form1.locator(".et_pb_contact_captcha").fill(captchaSum.toString())
    await form1.getByRole('button').click()

    await expect(form1.locator('.et-pb-contact-message > p')).toHaveText('Thanks for contacting us')
})