import React from 'react';
import { Composition } from 'remotion';
import { MotionGraphic, totalFrames } from './chronicle/Chronicle';
import { MotionGraphicProps } from './chronicle/types';
import sample from './chronicle/sample.json';

export const Root: React.FC = () => {
  return (
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
  );
};
