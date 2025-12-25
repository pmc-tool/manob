// MIGRATION: Avatar component from manob.ai - converted to Tailwind CSS
'use client';

import Image from 'next/image';

type AvatarProps = {
  avatar?: string;
  username?: string;
  size?: number;
  className?: string;
};

const getColorByChar = (char: string): string => {
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
    '#f39c12', '#d35400', '#c0392b', '#7f8c8d', '#e74c3c',
    '#e67e22', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
    '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
  ];

  const index = char.toUpperCase().charCodeAt(0) - 65;
  return colors[index] || '#bdc3c7';
};

export default function Avatar({
  avatar,
  username = 'U',
  size = 50,
  className = '',
}: AvatarProps) {
  const firstChar = username.charAt(0).toUpperCase();
  const bgColor = getColorByChar(firstChar);

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={username}
        width={size}
        height={size}
        style={{
          objectFit: 'cover',
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
        }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-medium select-none ${className}`}
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        fontSize: size / 2,
      }}
      title={username}
    >
      {firstChar}
    </div>
  );
}
