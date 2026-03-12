'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, Mail, Lock, User } from 'lucide-react';
import { useTranslations } from '@/i18n';

export function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const t = useTranslations('auth');
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 후 리다이렉트할 URL (기본값: /)
  const redirectUrl = searchParams?.get('redirect') || searchParams?.get('next') || '/';

  // 이미 로그인되어 있으면 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, authLoading, router, redirectUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 클라이언트 측 유효성 검사
    if (formData.password !== formData.password2) {
      setError(t('errorPasswordMismatch'));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError(t('errorPasswordTooShort'));
      setIsLoading(false);
      return;
    }

    if (formData.nickname.length < 2) {
      setError(t('errorNicknameTooShort'));
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.password2,
        formData.nickname
      );

      if (result.success) {
        router.push(redirectUrl);
      } else {
        const errorMsg = typeof result.message === 'string'
          ? result.message
          : Object.values(result.message).flat().join(', ');
        setError(errorMsg);
      }
    } catch {
      setError(t('errorSignupFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/20 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('signupTitle')}</CardTitle>
          <CardDescription>
            {t('signupDesc')}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">{t('nickname')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  placeholder={t('nicknamePlaceholder')}
                  value={formData.nickname}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('passwordMinLength')}
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password2">{t('confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password2"
                  name="password2"
                  type="password"
                  placeholder={t('confirmPasswordPlaceholder')}
                  value={formData.password2}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signingUp')}
                </>
              ) : (
                t('signupButton')
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {t('hasAccount')}{' '}
              <Link href="/login" className="text-accent hover:underline font-medium">
                {t('loginButton')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
