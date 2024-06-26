import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createBlogInput, updateBlogInput } from '@sanjaym2002/b4blog-common';

import { Hono } from 'hono';
import { verify } from 'hono/jwt';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    jwtPayload: string;
  };
}>();

//authentication middleware
blogRouter.use('/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  console.log('inside middleware');
  try {
    console.log('check 1');
    console.log(authHeader);
    const jwtResponse = await verify(authHeader || '', c.env.JWT_SECRET);
    console.log('jwt response is: ', jwtResponse);
    if (jwtResponse) {
      c.set('jwtPayload', jwtResponse.id);
      await next();
    }
  } catch (error) {
    c.status(404);
    return c.json({ error: 'Unauthorized' });
  }
});

//get all posts
blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogs = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    c.status(200);
    return c.json({ data: blogs });
  } catch (error) {
    c.status(500);
    return c.json({ error: 'Server error' });
  }
});

//create post
blogRouter.post('/createBlog', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get('jwtPayload');
  const body = await c.req.json();

  try {
    if (!userId) {
      c.status(403);
      return c.json({ error: 'Invalid user' });
    }
    console.log('check 1');
    const zodResponse = createBlogInput.safeParse(body);
    if (!zodResponse.success) {
      console.log('error in zod validation');
      c.status(403);
      return c.json({ error: zodResponse.error });
    }
    const newBlog = await prisma.post.create({
      data: {
        title: zodResponse.data.title,
        content: zodResponse.data.content,
        authorId: userId,
        published: true,
      },
    });
    c.status(201);
    return c.json(newBlog);
  } catch (error) {
    c.status(500);
    return c.json({ error: 'Server error' });
  }
});

//update post
blogRouter.put('/updatePost', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get('jwtPayload');
  const body = await c.req.json();
  try {
    if (!userId) {
      c.status(403);
      return c.json({ error: 'Invalid user' });
    }
    const zodResponse = updateBlogInput.safeParse(body);
    if (!zodResponse.success) {
      c.status(403);
      return c.json({ error: zodResponse.error });
    }
    if (!zodResponse.data.content && !zodResponse.data.title) {
      c.status(400);
      return c.json({ error: 'Both title and content cannot be empty' });
    }
    const postId = zodResponse.data.id;
    const isPostExists = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!isPostExists) {
      c.status(401);
      return c.json({ error: 'Invalid post id' });
    }
    let updatedTitle: string;
    let updatedContent: string;
    if (zodResponse.data.title) {
      updatedTitle = zodResponse.data.title;
    } else {
      updatedTitle = isPostExists.title;
    }

    if (zodResponse.data.content) {
      updatedContent = zodResponse.data.content;
    } else {
      updatedContent = isPostExists.content;
    }
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: updatedTitle,
        content: updatedContent,
      },
    });
    c.status(200);
    return c.json(updatedPost);
  } catch (error) {
    c.status(500);
    return c.json({ error: 'Server error' });
  }
});

//get blog by id
blogRouter.get('/:postId', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const postId = c.req.param('postId');

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      c.status(400);
      return c.json({ error: 'Invalid post id' });
    }

    c.status(200);
    return c.json({ post });
  } catch (error) {
    c.status(500);
    return c.json({ error: 'Server error' });
  }
});
