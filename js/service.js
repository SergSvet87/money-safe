import { API_URL } from './const.js';

export const getData = async (url) => {
  try {
    const res = await fetch(`${API_URL}${url}`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Помилка при отриманні даних:", error);
    throw error;
  }
};

export const postData = async (url, data) => {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Помилка при відправленні даних:", error);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Помилка при видаленні даних:", error);
    throw error;
  }
};
