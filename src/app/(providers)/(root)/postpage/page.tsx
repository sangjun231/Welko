'use client';
import { useState } from 'react';
import Calendar from './_components/Calendar';
import NaverMap from './_components/NaverMap';
import Write from './_components/Write';

function PostPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div>
      {step === 1 && <Calendar next={nextStep} />}
      {step === 2 && <NaverMap next={nextStep} prev={prevStep} />}
      {step === 3 && <Write prev={prevStep} />}
    </div>
  );
}
export default PostPage;
