import axios, { AxiosError } from "axios";

const BASE_URL = 'http://164.90.166.249:3001'

interface IProgrammingLanguage {
  id: number;
  name: string;
  creator: string;
  releaseYear: number;
  paradigm: string;
  popularity: number;
}

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
      throw new Error('Failed to fetch programming-languages by id');
    }
  };

  export const searchLanguages = async (token: string, searchTerm: string,  sortBy?: string, sortOrder?: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/programming-languages/search-sort`,
        {
          search_keyword: searchTerm, 
          sortBy,      
          sortOrder,   
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 404) {
          return [];
       }
      }
      throw new Error('Failed to search programming languages');
    }
  };
  
  export const addNewLanguage = async (newLanguage: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(
            `${BASE_URL}/programming-languages`,
            newLanguage,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to add new programming language");
    }
};

export const updateLanguage = async (
  id: number,
  updatedLanguage: Partial<IProgrammingLanguage>,
  token: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/programming-languages/${id}`,
      updatedLanguage,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to update programming language');
  }
};

  export const deleteLanguage = async (id: number, token: string) => {
    try {
        await axios.delete(`${BASE_URL}/programming-languages/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        throw new Error ('Failed to delete programming language');
    }
  };

  export const deleteAllLanguages = async (ids: number[], token: string) => {
    try {
        await axios.delete(`${BASE_URL}/programming-languages`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {ids},
        });
    } catch (error) {
        throw new Error ('Failed to delete programming-languages selected');
    }
  };


  