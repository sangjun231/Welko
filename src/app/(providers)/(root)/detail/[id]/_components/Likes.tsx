'use client';

import BackButton from '@/components/common/Button/BackButton';
import DeletePost from '@/hooks/Post/usePostDelete';
import useAuthStore from '@/zustand/bearsStore';
import { useLikeStore } from '@/zustand/likeStore';
import usePostStore from '@/zustand/postStore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import LikeBtn from '/public/icons/detail_icons/icon_like.svg';
import IconHome from '/public/icons/navbar_icons/icon_home.svg';
import { WebProps } from '@/types/webstate';
import WriteBtn from '/public/icons/tabler-icon-pencil.svg';
import DeleteBtn from '/public/icons/tabler-icon-trash.svg';

const Likes = ({ isWeb }: WebProps) => {
  const { id: postId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const { post } = usePostStore((state) => ({
    post: state.post
  }));
  const { liked, fetchLikeStatus, toggleLike } = useLikeStore((state) => ({
    liked: state.liked,
    fetchLikeStatus: state.fetchLikeStatus,
    toggleLike: state.toggleLike
  }));

  useEffect(() => {
    if (postId && user?.id) {
      fetchLikeStatus(postId, user.id);
    }
  }, [postId, user?.id, fetchLikeStatus]);

  const handleLike = () => {
    if (!user) {
      alert('좋아요를 누르기 위해서는 로그인이 필요합니다.');
      return;
    }
    toggleLike(postId, user.id);
  };

  const handleDelete = DeletePost();

  return (
    <div className="web:top-12 web:px-[88px] absolute left-0 right-0 top-2 z-10 flex items-center justify-between px-4">
      <BackButton />
      <div className="web:gap-10 flex gap-4">
        {post &&
          user &&
          post.user_id === user.id && ( // user가 존재하는지 확인
            <>
              <Link href={`/postpage/${postId}`}>
                <button className="icon-button">
                  <WriteBtn alt="WritePencil" width={isWeb ? 32 : 24} height={isWeb ? 32 : 24} />
                </button>
              </Link>
              <button className="icon-button" onClick={() => handleDelete(postId)}>
                <DeleteBtn alt="DeleteBtn" width={isWeb ? 32 : 24} height={isWeb ? 32 : 24} />
              </button>
            </>
          )}
        <div>
          <button onClick={handleLike} className="icon-button">
            {liked ? (
              <LikeBtn width={isWeb ? 32 : 24} height={isWeb ? 32 : 24} color="#141414" fill="#141414" />
            ) : (
              <LikeBtn width={isWeb ? 32 : 24} height={isWeb ? 32 : 24} />
            )}
          </button>
        </div>
        {!isWeb && (
          <Link href="/">
            <button className="icon-button">
              <IconHome alt="Home" width={24} height={24} />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Likes;
