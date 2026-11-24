import React from 'react';
import { Composition } from 'remotion';
import { MotionGraphic, totalFrames } from './chronicle/Chronicle';
import { MotionGraphicProps } from './chronicle/types';
import { Cover } from './chronicle/Cover';
import { Avatar, Banner, Watermark } from './brand/Brand';
import sample from './chronicle/sample.json';

export const Root: React.FC = () => {
  return (
  <>
    <Composition
      id="MotionGraphic"
      component={MotionGraphic as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={totalFrames((sample as unknown as MotionGraphicProps).scenes)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={sample as unknown as Record<string, unknown>}
      calculateMetadata={async ({ props }) => ({ durationInFrames: totalFrames((props as unknown as MotionGraphicProps).scenes) })}
    />
    <Composition id="Cover" component={Cover as unknown as React.FC<Record<string, unknown>>} durationInFrames={60} fps={30} width={1080} height={1920} defaultProps={sample as unknown as Record<string, unknown>} />
    <Composition id="BrandAvatar" component={Avatar} durationInFrames={60} fps={30} width={800} height={800} />
    <Composition id="BrandBanner" component={Banner} durationInFrames={60} fps={30} width={2560} height={1440} />
    <Composition id="BrandWatermark" component={Watermark} durationInFrames={60} fps={30} width={300} height={300} />
  </>
  );
};
