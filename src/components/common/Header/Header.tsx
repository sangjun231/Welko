'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Search from '../Search/Search';
import Link from 'next/link';
import { handleLogout } from '@/utils/supabase/service';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // 로그인 상태 관리

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setIsLoggedIn(session !== null);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(session !== null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const logout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    await handleLogout(router);
  };

  return (
    <>
      <div className="hidden sm:block">
        <div className="flex justify-between">
          <h1>LOGO</h1>
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative mr-5 flex">
              <button className="bg-gray-400 p-2">Writing</button>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 rounded-md border-l-stone-400"
              >
                <p>MENU</p>
                <p>profile</p>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 top-5 z-50 mt-4 w-48 rounded-md bg-gray-200 shadow-lg">
                  <ul className="py-1">
                    <li>
                      <button className="block w-full px-4 py-2 text-start text-sm text-black hover:bg-gray-300">
                        마이페이지
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-start text-sm text-black hover:bg-gray-300"
                      >
                        로그아웃
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button>로그인 및 회원가입</button>
            </Link>
          )}
        </div>
        <Search />
      </div>

      <div className="block sm:hidden">
        <div className="flex items-center justify-center">
          <Image src="/icons/menu.png" alt="Menu icon" width={30} height={30} className="mx-5 mt-5" />
          <Search />
        </div>
      </div>
    </>
  );
}

export default Header;
