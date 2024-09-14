import axios from 'axios';

const BASE_URL = 'http://164.90.166.249:3001'

export const loginUser = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

export const logoutUser = async (token: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/logout`, {
      },
    {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      return response.data;
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  export const fetchLanguages = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/programming-languages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    } catch(error) {
        throw new Error('Failed to fetch programming-languages')
    }
  }

  export const fetchLanguageById = async (id: number, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/programming-languages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch car programming-languages');
    }
  };

  export const searchLanguages = async (token: string, searchTerm: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/programming-languages/search-sort`,
        {
          search_keyword: searchTerm, // Trimitem cuvântul de căutare
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to search programming languages');
    }
  };
  

  export const updateCarById = async (
    id: number,
    car: { brand: string; model: string; color: string; engine: string; horsePower: number },
    token: string
  ) => {
    try {
      await axios.put(`${BASE_URL}/cars/${id}`, car, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      throw new Error('Failed to update car');
    }
  };

  export const deleteCarById = async (id: number, token: string) => {
    try {
        await axios.delete(`${BASE_URL}/cars/${id}`, {
            headers: {
                Authorization: token,
            },
        });
    } catch (error) {
        throw new Error ('Failed to delete car');
    }
  };

  export const deleteAllCars = async (ids: number[], token: string) => {
    try {
        await axios.delete(`${BASE_URL}/cars`, {
            headers: {
                Authorization: token,
            },
            data: {ids},
        });
    } catch (error) {
        throw new Error ('Failed to delete car');
    }
  };


  export const AddNewCar = async(car: {brand: string; model:string; color:string; engine: string; horsePower: number}, token: string) => {
    try {
      await axios.post(`${BASE_URL}/cars`, car, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      throw new Error('Failed to add a car')
    }

  }