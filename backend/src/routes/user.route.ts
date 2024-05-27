import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { loginInput, signupInput } from '@sanjaym2002/b4blog-common';
import { Hono } from 'hono';
import { jwt, sign } from 'hono/jwt';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.get('/hello', async (c) => {
  return c.json({ msg: 'Hello world' });
});

//signup
userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  try {
    const zodResponse = signupInput.safeParse(body);
    if (!zodResponse.success) {
      c.status(411);
      return c.json({ error: zodResponse.error });
    }
    const isUserExists = await prisma.user.findFirst({
      where: {
        email: zodResponse.data.email,
      },
    });
    if (isUserExists) {
      c.status(401);
      return c.json({ error: 'User with this email already exists' });
    }
    const newUser = await prisma.user.create({
      data: {
        fullname: zodResponse.data.fullname,
        email: zodResponse.data.email,
        password: zodResponse.data.password,
      },
    });
    const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
    c.status(201);
    return c.json({
      id: newUser.id,
      name: newUser.fullname,
      email: newUser.email,
      token: token,
    });
  } catch (error) {
    c.status(500);
    return c.json({ error: 'Server error' });
  }
});

//login
userRouter.post('/login', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const zodResponse = loginInput.safeParse(body);
    if (!zodResponse.success) {
      c.status(411);
      return c.json({ error: zodResponse.error });
    }
    const isUserExists = await prisma.user.findFirst({
      where: {
        email: zodResponse.data.email,
      },
    });
    if (!isUserExists) {
      c.status(403);
      return c.json({ error: 'User with this email does not exist' });
    }
    const isPasswordCorrect =
      isUserExists.password === zodResponse.data.password;
    if (!isPasswordCorrect) {
      c.status(403);
      return c.json({ error: 'Incorrect password' });
    }
    const token = await sign({ id: isUserExists.id }, c.env.JWT_SECRET);
    c.status(201);
    return c.json({
      id: isUserExists.id,
      name: isUserExists.fullname,
      email: isUserExists.email,
      token: token,
    });
  } catch (error) {
    c.status(500);
    return c.json({ error: 'Server error' });
  }
});

//get user by id
userRouter.get('/getUser/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.req.param('id');
  try {
    const isUserExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!isUserExists) {
      c.status(403);
      return c.json({ error: 'Invalid userid' });
    }
    const { password, ...rest } = isUserExists;
    c.status(200);
    return c.json(rest);
  } catch (error) {
    c.status(500);
    return c.json({ error: 'Server error' });
  }
});
