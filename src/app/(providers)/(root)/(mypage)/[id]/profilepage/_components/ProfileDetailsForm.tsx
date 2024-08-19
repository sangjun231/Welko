'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProfileDetailsFormProps = {
  nickname: string;
  setNickname: (nickname: string) => void;
  region: string;
  userId: string;
};

const ProfileDetailsForm = ({ nickname, setNickname, region, userId }: ProfileDetailsFormProps) => {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegionClick = () => {
    router.replace(`/${userId}/profilepage/regionpage`);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length >= 15) {
      setError('Nickname cannot exceed 15 characters.');
    } else {
      setError('');
    }
  };

  return (
    <div className="my-[32px] flex flex-col gap-[24px] web:gap-[40px]">
      <div className="flex flex-col gap-[8px] web:gap-[24px]">
        <label className="text-[16px] font-medium web:text-[21px]">Nickname</label>
        <input
          className="mt-[8px] w-full rounded-2xl border bg-grayscale-50 p-[16px] text-[16px] font-medium text-grayscale-900"
          type="text"
          placeholder="Write your nickname"
          defaultValue={''}
          onChange={handleNicknameChange}
          onBlur={(e) => setNickname(e.target.value)}
          maxLength={15}
        />
        {error && <p className="text-[12px] text-red-500">{error}</p>}
      </div>
      <div className="flex flex-col gap-[8px] web:gap-[24px]">
        <label className="text-[16px] font-medium web:text-[21px]">Location</label>
        <button
          className="flex w-full items-start rounded-2xl border bg-grayscale-50 p-[16px] text-[16px] text-grayscale-900"
          onClick={handleRegionClick}
        >
          {region || 'Set your region'}
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
