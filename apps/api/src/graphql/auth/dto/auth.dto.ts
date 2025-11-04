import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CredentialsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignInDtoType = z.infer<typeof SignInSchema>;
export type SignUpDtoType = z.infer<typeof CredentialsSchema>;

export class SignInDto extends createZodDto(SignInSchema) {}
export class SignUpDto extends createZodDto(CredentialsSchema) {}
