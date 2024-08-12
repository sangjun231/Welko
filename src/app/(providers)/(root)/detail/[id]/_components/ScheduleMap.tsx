'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';

interface Place {
  title: string;
  category: string;
  description: string;
}

interface PlaceData {
  lat: number[];
  long: number[];
  places: Place[];
}

interface PostAndPlacesData {
  places: PlaceData[];
}

const ScheduleMap = () => {
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const isScriptLoaded = useNaverMapScript(clientId);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id; // URL에서 id를 가져옴
  const [selectedDay, setSelectedDay] = useState(0);

  const fetchPostAndPlaces = async (postId: string): Promise<PostAndPlacesData> => {
    try {
      const response = await axios.get(`/api/detail/map/${postId}`);
      const data = response.data;

      const parsedPlaces = data.places.map((item: any) => {
        return {
          lat: item.lat,
          long: item.long,
          places: item.places
        };
      });

      return { places: parsedPlaces };
    } catch (error) {
      console.error('Error fetching post and places:', error);
      throw error;
    }
  };

  // Supabase에서 게시물 및 장소 데이터를 가져오기 위한 React Query
  const { data, error, isLoading } = useQuery<PostAndPlacesData>({
    queryKey: ['postAndPlaces', postId],
    queryFn: () => fetchPostAndPlaces(postId)
  });

  useEffect(() => {
    if (!isScriptLoaded || isLoading || !data || data.places.length === 0) return;

    // 지도 초기화 함수
    const initializeMap = () => {
      const map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(data.places[0].lat[0], data.places[0].long[0]),
        zoom: 10
      });
      setMapInstance(map);
    };

    initializeMap();
  }, [isScriptLoaded, isLoading, data]);

  useEffect(() => {
    if (!mapInstance || !data) return;

    // 이전 마커 삭제
    if (mapInstance.markers) {
      mapInstance.markers.forEach((marker: any) => marker.setMap(null));
    } else {
      mapInstance.markers = [];
    }

    const newMarkers = data.places[selectedDay].lat
      .map((lat: number, index: number) => {
        if (index < data.places[selectedDay].long.length) {
          const markerContent = `
          <div class="text-white bg-primary-300 border-2 border-white px-2 rounded-full">${index + 1}</div>
        `;
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(lat, data.places[selectedDay].long[index]),
            map: mapInstance,
            title: data.places[selectedDay].places[index].title,
            icon: {
              content: markerContent,
              anchor: new window.naver.maps.Point(12, 12)
            }
          });
          return marker;
        }
      })
      .filter((marker) => marker !== undefined);

    mapInstance.markers = newMarkers;
  }, [mapInstance, data, selectedDay]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading map data</div>;

  if (!data) return <div>No data available</div>;

  return (
    <div className="flex flex-col text-lg">
      <h2 className="mb-4 font-semibold text-grayscale-900">Where you’ll tour</h2>
      <div id="map" style={{ width: '100%', height: '300px' }}></div>
      <div className="my-6 flex gap-2 text-xs font-medium">
        {data.places.length > 0 && (
          <button
            onClick={() => setSelectedDay(0)}
            className={`rounded-3xl px-4 py-2 ${selectedDay === 0 ? 'bg-primary-300 text-white' : 'bg-grayscale-50'}`}
          >
            Day 1
          </button>
        )}
        {data.places.length > 1 && (
          <button
            onClick={() => setSelectedDay(1)}
            className={`rounded-3xl px-4 py-2 ${selectedDay === 1 ? 'bg-primary-300 text-white' : 'bg-grayscale-50'}`}
          >
            Day 2
          </button>
        )}
        {data.places.length > 2 && (
          <button
            onClick={() => setSelectedDay(2)}
            className={`rounded-3xl px-4 py-2 ${selectedDay === 2 ? 'bg-primary-300 text-white' : 'bg-grayscale-50'}`}
          >
            Day 3
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {data?.places[selectedDay].places.map((place, index) => (
          <div key={index} className="relative flex items-start">
            <div className="flex flex-col items-center">
              <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary-300 text-sm font-medium text-white">
                {index + 1}
              </div>
              {index !== data.places[selectedDay].places.length - 1 ? (
                <div className="absolute top-6 h-[calc(100%)] w-px bg-grayscale-100"></div>
              ) : (
                <div className="absolute top-6 h-[calc(100%-1rem)] w-px bg-grayscale-100"></div>
              )}
            </div>
            <div className="shadow-custom-box ml-3 flex w-full flex-col gap-1 rounded-lg bg-white px-4 py-3">
              <h2 className="text-sm font-semibold">{place.title ? place.title.replace(/<\/?[^>]+(>|$)/g, '') : ''}</h2>
              <p className="text-xs text-gray-500">{place.category}</p>
              <hr className="my-2 h-[1px] w-full bg-grayscale-100" />
              <p className="text-xs font-normal text-gray-700">{place.description}</p>
            </div>
          </div>
        ))}
      </div>
      <hr className="mb-6 mt-8 h-[1px] w-full bg-grayscale-100" />
    </div>
  );
};

export default ScheduleMap;