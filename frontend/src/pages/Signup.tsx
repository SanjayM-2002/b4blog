import Quote from '../components/Quote';
import AuthCard from '../components/AuthCard';

const Signup = () => {
  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        <AuthCard type='signup' />
        <Quote />
      </div>
    </>
  );
};

export default Signup;
