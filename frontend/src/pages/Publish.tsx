import { useState } from 'react';
import Appbar from '../components/Appbar';
import TextEditor from '../components/TextEditor';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Publish = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const submitForm = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/v1/blog/createBlog`,
        { title, content },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = response.data;
      console.log('data is: ', data);
      navigate(`/blog/${data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert('Error in posting');
        console.log('error is: ', error.response);
      }
      console.log(error);
    }
  };
  return (
    <>
      <div>
        <Appbar />
        <div className='flex justify-center w-full pt-8'>
          <div className='max-w-screen-lg w-full'>
            <input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type='text'
              className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'
              placeholder='Title'
            />

            <TextEditor
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            <button
              onClick={submitForm}
              type='submit'
              className='mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
            >
              Publish post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Publish;
