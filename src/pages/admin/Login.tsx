import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { authApi } from '@/api/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getSafeLocalStorage } from '@/utils';
import { StorageKeyRedirectRouter } from '@/constants';

const formSchema = z.object({
  email: z.string().min(1, '邮箱不能为空'),
  password: z.string().min(1, '密码不能为空'),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: FormSchema) {
    try {
      const res = await authApi.login(data);
      if (res.code === 200) {
        localStorage.setItem('token', res.data.accessToken);
        toast.success('登录成功');
        navigate(getSafeLocalStorage(StorageKeyRedirectRouter, '/'));
      }
    } catch (error: any) {
      console.error(error.data.message);
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center">
      <Card className="w-full sm:max-w-md mx-auto">
        <CardHeader className="flex justify-center">
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-email">邮箱</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入邮箱"
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-password">密码</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="form-rhf-demo-password"
                        type={showPassword ? 'text' : 'password'}
                        aria-invalid={fieldState.invalid}
                        placeholder="请输入密码"
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                )}
              />
              <div className="h-4">
                <FieldError
                  className="text-xs"
                  errors={[
                    {
                      message: Object.values(form.formState.errors)
                        .map((error) => error?.message)
                        .join('，'),
                    },
                  ]}
                />
              </div>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="form-rhf-demo">
            登录
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
