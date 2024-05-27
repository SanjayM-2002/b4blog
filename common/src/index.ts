import { z } from 'zod';

export const signupInput = z.object({
  fullname: z.string({ message: 'fullname cannot be empty' }),
  email: z.string().min(1).email({ message: 'This is not a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password should have minimum 8 characters' }),
});

export const loginInput = z.object({
  email: z.string().min(1).email({ message: 'This is not a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password should have minimum 8 characters' }),
});

export const createBlogInput = z.object({
  title: z.string().min(1).max(50, { message: 'This is not a valid title' }),
  content: z
    .string()
    .min(1)
    .max(250, { message: 'This is not a valid content' }),
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string({ message: 'This is not a valid id' }),
});

export type SignupInputType = z.infer<typeof signupInput>;
export type LoginInputType = z.infer<typeof loginInput>;
export type CreateBlogInputType = z.infer<typeof createBlogInput>;
export type UpdateBlogInputType = z.infer<typeof updateBlogInput>;
