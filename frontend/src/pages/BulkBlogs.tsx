import Appbar from '../components/Appbar';
import BlogCard from '../components/BlogCard';
import BlogSkeleton from '../components/BlogSkeleton';
import { useBlogs } from '../hooks';

const BulkBlogs = () => {
  const { loading, blogs } = useBlogs();
  console.log('blogs are: ', blogs.length, blogs[0]);
  if (loading) {
    return (
      <div>
        <Appbar />
        <div className='flex justify-center'>
          <div>
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div>
        <Appbar />
        <div className='flex justify-center'>
          <div>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.autherName || 'Anonymous'}
                title={blog.title}
                content={blog.content}
                publishedDate={String(blog.published)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkBlogs;
