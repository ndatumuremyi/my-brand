/* eslint-disable consistent-return */
// import SecureLS from 'secure-ls';
// import Keys from './keys';
import keys from "./constants/keys.js";
let ls = {
  set: (key, value) => {
    localStorage.setItem(key, value)
  },
  get:(key) => {
    return localStorage.getItem(key)
  },
  remove:(key) => {
    return localStorage.removeItem(key)
  }
}

const set = (key, value) => {
  // const ls = new SecureLS({ encodingType: 'aes' });
  ls.set(key, value);
};

const get = (key) => {
  // if (Keys.ISSERVER) return;
  // const ls = new SecureLS({ encodingType: 'aes' });
  return ls.get(key);
};

const remove = (key) => {
  // if (Keys.ISSERVER) return;
  // const ls = new SecureLS({ encodingType: 'aes' });
  return ls.remove(key);
};

const removeToken = () => {
  // if (Keys.ISSERVER) return;
  // const ls = new SecureLS({ encodingType: 'aes' });
  return ls.remove(`${keys.APP_ACCESS_TOKEN}`);
};

const setToken = (value) => {
  // if (Keys.ISSERVER) return;
  // const ls = new SecureLS({ encodingType: 'aes' });
  //
  ls.set(`${keys.APP_ACCESS_TOKEN}`, value);
};

const getToken = () => {
  // if (Keys.ISSERVER) return;
  // const ls = new SecureLS({ encodingType: 'aes' });
  try {
    return ls.get(`${keys.APP_ACCESS_TOKEN}`) || null;
  } catch (error) {
    return null;
  }
};

const Secure = {
  set,
  setToken,
  get,
  getToken,
  remove,
  removeToken,
};

export default Secure;
