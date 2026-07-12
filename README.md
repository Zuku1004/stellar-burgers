# Stellar Burgers

Проектная работа Яндекс Практикума: приложение космической бургерной на React, TypeScript и Redux Toolkit.

## Функциональность

- загрузка ингредиентов с API;
- сборка бургера в конструкторе;
- подсчёт стоимости заказа;
- оформление заказа для авторизованного пользователя;
- регистрация, вход, выход и восстановление пароля;
- защищённые маршруты личного кабинета;
- редактирование профиля пользователя;
- лента заказов с обновлением данных;
- история заказов пользователя;
- страницы деталей ингредиента и заказа;
- модальные окна с поддержкой прямых ссылок.

## Стек

- React;
- TypeScript;
- Redux Toolkit;
- React Router;
- Webpack;
- ESLint;
- Prettier ;
- UI- компоненты `@zlden/react-developer-burger-ui-components`.

## Установка

```bash
npm install
```

Создайте файл `.env` в корне проекта и добавьте адрес API:

```bash
BURGER_API_URL=https://norma.education-services.ru/api
```

Пример переменных окружения есть в `.env.example`.

## Запуск

```bash
npm start
```

Локальный адрес приложения:

```text
http://localhost:4000
```

## Проверка

```bash
npm run lint
```

```bash
npx webpack --mode=production
```

Production-сборка создаётся в папке  `dist`.

## Тесты

Запуск Jest-тестов:

```bash
npm run test:jest
```

Запуск Playwright-тестов:

```bash
npm run test:playwright
```

## Основные  маршруты

- `/` — конструктор бургеров;
- `/feed` — Лента заказов;
- `/login` — вход;
- `/register` — регистрация;
- `/forgot-password` — восстановление пароля;
- `/reset-password` — Сброс пароля;
- `/profile` — профиль пользователя;
- `/profile/orders` — история заказов;
- `/ingredients/:id` — детали ингредиента;
- `/feed/:number` — детали заказа из ленты;
- `/profile/orders/:number` — детали заказа пользователя.
