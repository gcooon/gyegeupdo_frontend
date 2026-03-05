'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  scale: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const DEFAULT_COLORS = [
  '#FBBF24', // amber
  '#F59E0B', // amber darker
  '#3B82F6', // blue
  '#10B981', // emerald
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#EF4444', // red
  '#14B8A6', // teal
];

export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 50,
  colors = DEFAULT_COLORS,
  onComplete,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      // 조각 생성
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // 화면 너비 %
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }));
      setPieces(newPieces);
      setShow(true);

      // 일정 시간 후 사라짐
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, particleCount, colors, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
              }}
              initial={{
                top: '-5%',
                opacity: 1,
                rotateZ: piece.rotation,
              }}
              animate={{
                top: '110%',
                opacity: [1, 1, 0],
                rotateZ: piece.rotation + 720,
                x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300],
              }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: 'easeOut',
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// 축하 효과를 위한 컴포넌트
interface CelebrationProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export function Celebration({
  show,
  title = '축하합니다!',
  subtitle,
  onClose,
}: CelebrationProps) {
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (show) {
      setConfettiActive(true);
    }
  }, [show]);

  return (
    <>
      <Confetti
        isActive={confettiActive}
        duration={4000}
        onComplete={() => setConfettiActive(false)}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
              >
                🎉
              </motion.div>
              <motion.h2
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h2>
              {subtitle && (
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {subtitle}
                </motion.p>
              )}
              {onClose && (
                <motion.button
                  className="mt-6 px-6 py-2 bg-accent text-white rounded-full font-medium"
                  onClick={onClose}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  확인
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// 레벨업 효과 컴포넌트
interface LevelUpProps {
  show: boolean;
  level: number;
  levelName: string;
  onClose?: () => void;
}

export function LevelUp({ show, level, levelName, onClose }: LevelUpProps) {
  return (
    <Celebration
      show={show}
      title={`레벨 ${level} 달성!`}
      subtitle={`${levelName}이 되었습니다`}
      onClose={onClose}
    />
  );
}

// 뱃지 획득 효과 컴포넌트
interface BadgeEarnedProps {
  show: boolean;
  badgeName: string;
  badgeEmoji: string;
  onClose?: () => void;
}

export function BadgeEarned({ show, badgeName, badgeEmoji, onClose }: BadgeEarnedProps) {
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (show) {
      setConfettiActive(true);
    }
  }, [show]);

  return (
    <>
      <Confetti
        isActive={confettiActive}
        duration={3000}
        particleCount={30}
        onComplete={() => setConfettiActive(false)}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
              initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                <motion.span
                  className="text-5xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                  }}
                >
                  {badgeEmoji}
                </motion.span>
              </motion.div>
              <motion.p
                className="text-sm text-amber-600 font-medium mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                새로운 뱃지 획득!
              </motion.p>
              <motion.h2
                className="text-xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {badgeName}
              </motion.h2>
              {onClose && (
                <motion.button
                  className="mt-6 px-6 py-2 bg-accent text-white rounded-full font-medium"
                  onClick={onClose}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  확인
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
