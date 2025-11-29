import { test, expect } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('https://ultimateqa.com/automation')
    await page.getByText('Interactions with simple elements').click()
})

test('Radio buttons - toBeChecked approach', async({page}) => {
    const maleRadio = page.locator('input[type="radio"][value="male"]')
    const femaleRadio = page.locator('input[type="radio"][value="female"]')
    const otherRadio = page.locator('input[type="radio"][value="other"]')

    // value approach
    await maleRadio.scrollIntoViewIfNeeded()
    await maleRadio.click()
    await expect(maleRadio).toBeChecked()

    await femaleRadio.scrollIntoViewIfNeeded()
    await femaleRadio.click()
    await expect(femaleRadio).toBeChecked()

    await otherRadio.scrollIntoViewIfNeeded()
    await otherRadio.click()
    await expect(otherRadio).toBeChecked()
})

test('Radio buttons - visual testing example', async({page}) => {
    const maleRadio = page.locator('input[type="radio"][value="male"]')
    const femaleRadio = page.locator('input[type="radio"][value="female"]')
    const otherRadio = page.locator('input[type="radio"][value="other"]')
    let radioSection = page.locator('div.et_pb_blurb_description', {hasText: 'Click and validate that they are selected'})

    await radioSection.scrollIntoViewIfNeeded()
    await expect(radioSection).toHaveScreenshot({maxDiffPixels: 50})

    await maleRadio.scrollIntoViewIfNeeded()
    await maleRadio.click()
    await expect(radioSection).toHaveScreenshot('MaleRadioButton.png')

    await femaleRadio.scrollIntoViewIfNeeded()
    await femaleRadio.click()
    await radioSection.scrollIntoViewIfNeeded()
    await expect(radioSection).toHaveScreenshot('FemaleRadioButton.png')

    await otherRadio.scrollIntoViewIfNeeded()
    await otherRadio.click()
    await radioSection.scrollIntoViewIfNeeded()
    await expect(radioSection).toHaveScreenshot('OtherRadioButton.png')
})