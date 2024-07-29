'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { API_MYPAGE_LIKES } from '@/utils/apiConstants';

type LikeProps = {
  postId: string;
  userId: string;
};

const Like: React.FC<LikeProps> = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);

  const fetchLikeStatus = async (): Promise<boolean> => {
    const response = await axios.get(API_MYPAGE_LIKES(userId));
    const likedPosts = response.data.posts.map((post: any) => post.id);
    return likedPosts.includes(postId);
  };

  const toggleLikeStatus = async (): Promise<void> => {
    await axios.put(API_MYPAGE_LIKES(userId), { postId });
  };

  const { data, isError, isLoading, refetch } = useQuery<boolean>({
    queryKey: ['likeStatus', postId, userId],
    queryFn: fetchLikeStatus,
    enabled: !!postId && !!userId
  });

  const likeMutation = useMutation<void, Error>({
    mutationFn: toggleLikeStatus,
    onSuccess: () => {
      refetch();
    }
  });

  const handleLike = () => {
    if (isLoading) return;
    likeMutation.mutate();
  };

  useEffect(() => {
    if (data !== undefined) {
      setLiked(data);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching like status</div>;

  return (
    <button onClick={handleLike} className="absolute right-0 top-0 p-2">
      {liked ? <FaHeart size={30} color="red" /> : <FaRegHeart size={30} />}
    </button>
  );
};

export default Like;