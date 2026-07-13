import { expect, test, type Page } from '@playwright/test';
import path from 'path';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const SAUCE_NAME = 'Соус Spicy-X';
const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_ID = '643d69a5c3f7b9001cfa0941';
const SAUCE_ID = '643d69a5c3f7b9001cfa0942';
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

const addIngredient = async (page: Page, ingredientId: string) => {
  const ingredientCard = page.getByTestId(`ingredient-${ingredientId}`);

  await expect(ingredientCard).toBeVisible();
  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
};

test.describe('burger constructor page', () => {
  test('adds bun and fillings from ingredients list to constructor', async ({
    page
  }) => {
    await openConstructorPage(page);

    const constructor = page.getByTestId('burger-constructor');

    await addIngredient(page, BUN_ID);
    await addIngredient(page, MAIN_ID);
    await addIngredient(page, SAUCE_ID);

    await expect(
      constructor.getByText(new RegExp(`${escapeRegExp(BUN_NAME)} \\(`))
    ).toHaveCount(2);
    await expect(constructor.getByText(MAIN_NAME, { exact: true })).toHaveCount(
      1
    );
    await expect(
      constructor.getByText(SAUCE_NAME, { exact: true })
    ).toHaveCount(1);
  });

  test('opens ingredient details modal and closes it with close button', async ({
    page
  }) => {
    await openConstructorPage(page);

    const ingredientCard = page.getByTestId(`ingredient-${MAIN_ID}`);
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

    const ingredientCard = page.getByTestId(`ingredient-${SAUCE_ID}`);
    await ingredientCard.getByRole('link').click();

    await expect(page.locator('#modals')).toContainText(SAUCE_NAME);
    await page
      .locator('#modals > div')
      .last()
      .click({
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

    const constructor = page.getByTestId('burger-constructor');

    await addIngredient(page, BUN_ID);
    await addIngredient(page, MAIN_ID);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.locator('#modals')).toContainText(ORDER_NUMBER);
    await expect(
      constructor.getByText(new RegExp(`${escapeRegExp(BUN_NAME)} \\(`))
    ).toHaveCount(0);
    await expect(constructor.getByText(MAIN_NAME, { exact: true })).toHaveCount(
      0
    );

    await page.locator('#modals button').click();
    await expect(page.locator('#modals > div')).toHaveCount(0);
  });
});
