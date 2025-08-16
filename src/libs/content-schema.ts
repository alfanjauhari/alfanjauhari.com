import z from 'zod'

export const UpdateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tag: z.string().min(1, 'Tag is required'),
  date: z.coerce.date(),
})

export const SnippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.coerce.date(),
})
