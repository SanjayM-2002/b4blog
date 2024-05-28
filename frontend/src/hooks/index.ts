import axios from 'axios';
import { useEffect, useState } from 'react';

export interface Blog {
  content: string;
  title: string;
  id: string;
  autherName: string;
  createdAt: Date;
  published: boolean;
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const getBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      const data = response.data;
      setBlogs(data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert('Error in fetching blogs');
        console.log(error.response);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return {
    loading,
    blogs,
  };
};

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const getBlog = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/api/v1/blog/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = response.data;
      console.log('data is: ', data.post);

      setBlog(data.post);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert('Error in fetching blogs');
        console.log(error.response);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, [id]);

  return {
    loading,
    blog,
  };
};
