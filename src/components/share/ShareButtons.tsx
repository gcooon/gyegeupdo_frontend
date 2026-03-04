'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Share2,
  Link2,
  Check,
  MessageCircle,
  Twitter,
  Facebook,
} from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  variant?: 'default' | 'compact' | 'full';
  className?: string;
}

export function ShareButtons({
  title,
  description = '',
  url,
  imageUrl,
  variant = 'default',
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // 현재 URL 가져오기 (SSR 대응)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // 링크 복사
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 폴백: 구형 브라우저 지원
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && (window as typeof window & { Kakao?: { isInitialized: () => boolean; Share: { sendDefault: (options: object) => void } } }).Kakao) {
      const Kakao = (window as typeof window & { Kakao: { isInitialized: () => boolean; Share: { sendDefault: (options: object) => void } } }).Kakao;
      if (Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: title,
            description: description,
            imageUrl: imageUrl || 'https://gyegeupdo.kr/og-image.png',
            link: {
              webUrl: shareUrl,
              mobileWebUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '자세히 보기',
              link: {
                webUrl: shareUrl,
                mobileWebUrl: shareUrl,
              },
            },
          ],
        });
      } else {
        // 카카오 SDK 미초기화 시 웹 공유 페이지로 이동
        window.open(
          `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      }
    } else {
      // 카카오 SDK 미로드 시 카카오스토리로 폴백
      window.open(
        `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`,
        '_blank',
        'width=600,height=400'
      );
    }
  };

  // 트위터(X) 공유
  const handleTwitterShare = () => {
    const text = `${title}${description ? ` - ${description}` : ''}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  // 페이스북 공유
  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  // 네이티브 공유 (모바일)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // 사용자가 공유 취소한 경우
      }
    }
  };

  // 네이티브 공유 지원 여부
  const supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  // Compact 버전: 드롭다운 메뉴
  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
            <Share2 className="h-4 w-4" />
            공유
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
            {copied ? '복사됨!' : '링크 복사'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleKakaoShare} className="gap-2 cursor-pointer">
            <MessageCircle className="h-4 w-4 text-yellow-500" />
            카카오톡
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTwitterShare} className="gap-2 cursor-pointer">
            <Twitter className="h-4 w-4 text-sky-500" />
            트위터(X)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleFacebookShare} className="gap-2 cursor-pointer">
            <Facebook className="h-4 w-4 text-blue-600" />
            페이스북
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full 버전: 모든 버튼 노출
  if (variant === 'full') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
          {copied ? '복사됨!' : '링크 복사'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleKakaoShare}
          className="gap-2 hover:bg-yellow-50 hover:border-yellow-400"
        >
          <MessageCircle className="h-4 w-4 text-yellow-500" />
          카카오톡
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleTwitterShare}
          className="gap-2 hover:bg-sky-50 hover:border-sky-400"
        >
          <Twitter className="h-4 w-4 text-sky-500" />
          트위터
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFacebookShare}
          className="gap-2 hover:bg-blue-50 hover:border-blue-400"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          페이스북
        </Button>
      </div>
    );
  }

  // Default 버전: 모바일은 네이티브, 데스크톱은 드롭다운
  return (
    <div className={className}>
      {supportsNativeShare ? (
        <Button variant="outline" size="sm" onClick={handleNativeShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          공유하기
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              공유하기
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
              {copied ? '복사됨!' : '링크 복사'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleKakaoShare} className="gap-2 cursor-pointer">
              <MessageCircle className="h-4 w-4 text-yellow-500" />
              카카오톡
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTwitterShare} className="gap-2 cursor-pointer">
              <Twitter className="h-4 w-4 text-sky-500" />
              트위터(X)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFacebookShare} className="gap-2 cursor-pointer">
              <Facebook className="h-4 w-4 text-blue-600" />
              페이스북
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// 간단한 공유 아이콘 버튼 (인라인용)
export function ShareIconButton({
  title,
  description,
  url,
  className = '',
}: ShareButtonsProps) {
  return (
    <ShareButtons
      title={title}
      description={description}
      url={url}
      variant="compact"
      className={className}
    />
  );
}
