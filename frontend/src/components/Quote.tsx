const Quote = () => {
  return (
    <>
      <div className='bg-slate-200 h-screen flex flex-col justify-center'>
        <div className='text-black font-bold text-3xl text-center max-w-screen-lg'>
          "The customer support I recieved was exceptional. The support team
          went above and beyond to address my concerns"
        </div>
        <div className='text-black font-semibold text-2xl pl-8 pt-4'>
          Joe Root
        </div>
        <div className='text-black font-medium text-lg pl-8 pt-2'>CEO, ECB</div>
      </div>
    </>
  );
};

export default Quote;
