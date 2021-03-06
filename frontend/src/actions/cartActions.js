import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  // console.log('id', id);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty
    }
  });

  window.localStorage.setItem(
    'cartItems',
    JSON.stringify([...getState().cart.cartItems])
  );
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  // console.log('action/payload', id);
  dispatch({ type: CART_REMOVE_ITEM, payload: { id } });

  window.localStorage.setItem(
    'cartItems',
    JSON.stringify([...getState().cart.cartItems])
  );
};

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: { ...data } });
  // console.log('action, shipping address', data);
  window.localStorage.setItem('shippingAddress', JSON.stringify({ ...data }));
};
export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data
  });
  localStorage.setItem('paymentMethod', JSON.stringify(data));
};
