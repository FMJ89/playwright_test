import { test, expect } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('https://ultimateqa.com/automation')
    await page.getByText('Interactions with simple elements').click()
})

test('Mobile test #1', async({page}, testInfo) => {
    if(testInfo.project.name == 'mobile_example'){
        console.log('Log: example usage of testInfo.')
    }
    
    await page.locator('#idExample').click()
    await page.waitForTimeout(1000)
    expect(page.url()).toBe('https://ultimateqa.com/button-success')
    await expect(page.locator('.entry-title')).toHaveText('Button success')
})