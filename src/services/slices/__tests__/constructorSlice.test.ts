jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://example.com/bun.png',
  image_large: 'https://example.com/bun-large.png',
  image_mobile: 'https://example.com/bun-mobile.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://example.com/main.png',
  image_large: 'https://example.com/main-large.png',
  image_mobile: 'https://example.com/main-mobile.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://example.com/sauce.png',
  image_large: 'https://example.com/sauce-large.png',
  image_mobile: 'https://example.com/sauce-mobile.png'
};

describe('burgerConstructor reducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('adds a bun to the constructor', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));

    expect(state).toEqual({
      bun: {
        ...mockBun,
        id: 'mock-uuid'
      },
      ingredients: []
    });
  });

  it('adds a filling to the constructor', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));

    expect(state).toEqual({
      bun: null,
      ingredients: [
        {
          ...mockMain,
          id: 'mock-uuid'
        }
      ]
    });
  });

  it('removes a filling from the constructor', () => {
    const ingredientToRemove: TConstructorIngredient = {
      ...mockMain,
      id: 'main-id'
    };
    const ingredientToKeep: TConstructorIngredient = {
      ...mockSauce,
      id: 'sauce-id'
    };

    const state = constructorReducer(
      {
        bun: null,
        ingredients: [ingredientToRemove, ingredientToKeep]
      },
      removeIngredient('main-id')
    );

    expect(state.ingredients).toEqual([ingredientToKeep]);
  });

  it('moves a filling inside the constructor', () => {
    const firstIngredient: TConstructorIngredient = {
      ...mockMain,
      id: 'main-id'
    };
    const secondIngredient: TConstructorIngredient = {
      ...mockSauce,
      id: 'sauce-id'
    };

    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  it('clears the constructor', () => {
    const state = constructorReducer(
      {
        bun: {
          ...mockBun,
          id: 'bun-id'
        },
        ingredients: [
          {
            ...mockMain,
            id: 'main-id'
          }
        ]
      },
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
