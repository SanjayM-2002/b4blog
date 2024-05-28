import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LabelledInput from './LabelledInput';
import { LoginInputType, SignupInputType } from '@sanjaym2002/b4blog-common';
import axios from 'axios';

const AuthCard = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupInputType>({
    fullname: '',
    email: '',
    password: '',
  });
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const submitForm = async () => {
    try {
      const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;
      console.log(BACKEND_BASE_URL);
      const { fullname, ...rest } = formData;
      const loginData: LoginInputType = rest;
      const submitData = type === 'signup' ? formData : loginData;
      console.log(submitData);
      const endpoint = `${BACKEND_BASE_URL}/api/v1/user/${type}`;
      console.log('endpoint is: ', endpoint);
      const response = await axios.post(endpoint, submitData);

      const data = response.data;
      console.log('response is: ', response);
      console.log('data is: ', data);
      const jwt = data.token;
      localStorage.setItem('token', jwt);
      navigate('/blog');
    } catch (error) {
      console.log('error is: ', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 411) {
          alert('Wrong input');
          console.log('Error response data:', error.response.data);
        } else if (error.response.status === 401) {
          alert('User already exists with this email');
          console.log('Error response data:', error.response.data);
        } else {
          // Handle other status codes or unexpected errors
          alert('An error occurred. Please try again.');
          console.log('Error response data:', error.response.data);
        }
      } else {
        // Handle non-Axios errors
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  return (
    <>
      <div className='bg-yellow-200 flex flex-col justify-center h-screen'>
        <div className='flex justify-center'>
          <div>
            <div className='px-8 '>
              <div className='font-bold text-3xl text-black text-center'>
                {type === 'signup' ? 'Create an account' : 'Login'}
              </div>
              <div className='font-bold text-lg text-gray-500 text-center'>
                Already have an account ?
                <Link
                  to={type === 'signup' ? '/login' : '/signup'}
                  className='underline pl-2'
                >
                  {type === 'signup' ? 'Login' : 'Signup'}
                </Link>
              </div>

              <div className='space-y-4 flex flex-col mt-6'>
                {type === 'signup' && (
                  <LabelledInput
                    label='Fullname'
                    name='fullname'
                    value={formData.fullname}
                    onChange={handleInput}
                    placeholder='John Doe'
                  />
                )}

                <LabelledInput
                  label='Email'
                  name='email'
                  value={formData.email}
                  onChange={handleInput}
                  placeholder='johndoe@gmail.com'
                />

                <LabelledInput
                  label='Password'
                  name='password'
                  value={formData.password}
                  onChange={handleInput}
                  placeholder='********'
                  type='password'
                />
                <button
                  type='button'
                  onClick={submitForm}
                  className='text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
                >
                  {type === 'signup' ? 'Signup' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthCard;
