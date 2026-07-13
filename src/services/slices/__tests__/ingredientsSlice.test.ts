import ingredientsReducer, {
  fetchIngredients,
  initialState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredients reducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('sets loading state while ingredients are being requested', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  it('saves ingredients after a successful request', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled(mockIngredients, 'request-id')
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('saves an error after a failed request', () => {
    const errorMessage = 'Network error';
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(new Error(errorMessage), 'request-id')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: errorMessage
    });
  });
});
