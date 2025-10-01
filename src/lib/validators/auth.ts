import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.string().email("Gunakan email yang valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  address: z.string().min(10, "Alamat minimal 10 karakter."),
});

export const loginSchema = z.object({
  email: z.string().email("Gunakan email yang valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
