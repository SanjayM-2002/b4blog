import AuthCard from '../components/AuthCard';
import Quote from '../components/Quote';

const Login = () => {
  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        <AuthCard type='login' />
        <Quote />
      </div>
    </>
  );
};

export default Login;
