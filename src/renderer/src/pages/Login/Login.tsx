import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Checkbox, Form, Link } from '@heroui/react';

import { useLoginUserForMobileMutation } from '@/services/query/useAuthQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCommonStore } from '@/stores/useCommonStore';
import { LoginUserForMobileData } from '@/types/models/auth';
import { getHashedString } from '@/utils/hash';

import loginBg from '@/assets/images/login/login_bg.png';
import logo from '@/assets/images/login/store_program_full_logo.png';

interface LoginFormData {
  loginId: string;
  password: string;
  rememberMe: boolean;
  saveLoginId: boolean;
}

const Login = (): React.JSX.Element => {
  const navigate = useNavigate();

  const { setCurrentUser } = useAuthStore();
  const { setVisibleOverlayLoading } = useCommonStore();
  const { mutateAsync: loginUserForMobile } = useLoginUserForMobileMutation();
  const [errorText, setErrorText] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      loginId: '',
      password: '',
      rememberMe: false,
      saveLoginId: false,
    },
  });

  const loginId = watch('loginId');
  const password = watch('password');

  useEffect(() => {
    setErrorText('');
  }, [loginId, password]);

  useEffect(() => {
    const savedLoginId = localStorage.getItem('savedLoginId');

    if (savedLoginId) {
      setValue('loginId', savedLoginId);
      setValue('saveLoginId', true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const { loginId, password, rememberMe, saveLoginId } = data;

      const payload: LoginUserForMobileData = {
        loginId,
        password: getHashedString(password),
        rememberMe,
      };

      setVisibleOverlayLoading(true);

      const res = await loginUserForMobile(payload);

      if (res?.loginUserForMobile) {
        if (saveLoginId) {
          localStorage.setItem('savedLoginId', loginId);
        } else {
          localStorage.removeItem('savedLoginId');
        }

        setCurrentUser(res.loginUserForMobile);

        navigate('/');
      }
    } catch (error: any) {
      setErrorText(error.message);
      console.error(error);
    } finally {
      setVisibleOverlayLoading(false);
    }
  };

  return (
    <div className="w-[var(--width-login-form)] m-auto border-1">
      <div className="w-full h-full flex flex-row">
        <div className="w-1/2 h-full">
          <img
            src={loginBg}
            alt="login-bg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 h-full">
          <div className="w-full h-100% flex flex-col items-start justify-start p-6">
            <img
              src={logo}
              alt="logo"
              className="w-1/2 my-2"
            />
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full mt-8"
            >
              <Input
                className="w-full"
                label="아이디"
                placeholder="아이디를 입력해주세요."
                type="text"
                autoComplete="username"
                variant="bordered"
                {...register('loginId', { required: '아이디를 입력해 주세요' })}
              />
              <Input
                className="w-full"
                label="비밀번호"
                type="password"
                variant="bordered"
                placeholder="비밀번호를 입력해주세요."
                autoComplete="current-password"
                {...register('password', { required: '비밀번호를 입력해 주세요' })}
              />
              {(errors.loginId || errors.password) && (
                <p className="text-red-500 text-sm">
                  {errors.loginId?.message || errors.password?.message}
                </p>
              )}
              {errorText && (
                <div className="w-full flex flex-row items-center justify-end gap-4 my-2">
                  <p className="text-red-500 text-sm">{errorText}</p>
                </div>
              )}
              <Button
                className="w-full bg-primary text-white shadow-lg"
                size="lg"
                type="submit"
              >
                로그인
              </Button>
              <div className="w-full flex flex-row items-center justify-center gap-4 mt-4">
                <Checkbox {...register('rememberMe')}>자동 로그인</Checkbox>
                <Checkbox {...register('saveLoginId')}>아이디 저장</Checkbox>
              </div>
              <div className="w-full flex flex-row items-center justify-center gap-4 mt-4">
                <Link
                  className="text-sm underline"
                  href="/find-id"
                >
                  아이디 찾기
                </Link>
                <Link
                  className="text-sm underline"
                  href="/find-password"
                >
                  비밀번호 찾기
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
