import { expect, test, type Page } from '@playwright/test';
import path from 'path';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const SAUCE_NAME = 'Соус Spicy-X';
const ORDER_NUMBER = '12345';

const harPath = path.join(__dirname, 'hars', 'constructor.har');

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const openConstructorPage = async (page: Page) => {
  await page.routeFromHAR(harPath, {
    url: '**/api/**',
    notFound: 'abort'
  });
  await page.goto('/');
  await expect(page.getByText(BUN_NAME, { exact: true })).toBeVisible();
};

const addIngredient = async (
  page: Page,
  ingredientName: string
) => {
  const ingredientCard = page.locator('li').filter({ hasText: ingredientName });

  await expect(ingredientCard).toBeVisible();
  await ingredientCard.getByRole('button').click();
};

test.describe('burger constructor page', () => {
  test('adds bun and fillings from ingredients list to constructor', async ({
    page
  }) => {
    await openConstructorPage(page);

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);
    await addIngredient(page, SAUCE_NAME);

    await expect(
      page.getByText(new RegExp(`${escapeRegExp(BUN_NAME)} \\(`))
    ).toHaveCount(2);
    await expect(page.getByText(MAIN_NAME, { exact: true })).toHaveCount(2);
    await expect(page.getByText(SAUCE_NAME, { exact: true })).toHaveCount(2);
  });

  test('opens ingredient details modal and closes it with close button', async ({
    page
  }) => {
    await openConstructorPage(page);

    const ingredientCard = page.locator('li').filter({ hasText: MAIN_NAME });
    await ingredientCard.getByRole('link').click();

    const modal = page.locator('#modals > div').first();
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(MAIN_NAME);
    await expect(modal).toContainText('4242');

    await page.locator('#modals button').click();
    await expect(page.locator('#modals > div')).toHaveCount(0);
  });

  test('closes ingredient details modal by overlay click', async ({ page }) => {
    await openConstructorPage(page);

    const ingredientCard = page.locator('li').filter({ hasText: SAUCE_NAME });
    await ingredientCard.getByRole('link').click();

    await expect(page.locator('#modals')).toContainText(SAUCE_NAME);
    await page.locator('#modals > div').last().click({
      position: {
        x: 10,
        y: 10
      }
    });
    await expect(page.locator('#modals > div')).toHaveCount(0);
  });

  test('creates order, shows order number and clears constructor', async ({
    page,
    context,
    baseURL
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: baseURL || 'http://127.0.0.1:4000'
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    await openConstructorPage(page);

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    await page.locator('button').last().click();

    await expect(page.locator('#modals')).toContainText(ORDER_NUMBER);
    await expect(
      page.getByText(new RegExp(`${escapeRegExp(BUN_NAME)} \\(`))
    ).toHaveCount(0);
    await expect(page.getByText(MAIN_NAME, { exact: true })).toHaveCount(1);

    await page.locator('#modals button').click();
    await expect(page.locator('#modals > div')).toHaveCount(0);
  });
});
