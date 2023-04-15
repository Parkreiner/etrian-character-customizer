/**
 * @file The loading indicator for the top-level app.
 *
 * This component will play a special animation after the app loads its data,
 * but before LoadingIndicator is unmounted.
 *
 * @todo The eventual plan is that, in the exit animation, the indicator will
 * get covered with vines and vegetation right before it leaves the screen.
 */

import { range } from "@/utils/math";
import { maxLoadingDots } from "./localConstants";
import useDotCount from "./useDotCount";
import useExitAnimation from "./useExitAnimation";

type Props = {
  appLoaded: boolean;
  onAnimationCompletion: () => void;
};

const dotRange = range(1, maxLoadingDots + 1);

export default function LoadingIndicator({
  appLoaded,
  onAnimationCompletion,
}: Props) {
  const animationStyles = useExitAnimation(appLoaded, onAnimationCompletion);
  const visibleDots = useDotCount();

  return (
    <div
      className="absolute z-50 flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50 text-lg text-neutral-900"
      style={animationStyles}
    >
      {/**
       * @todo Replace div with tree-like SVG here once I design it.
       */}
      <div className="mb-4 h-[200px] w-[200px] rounded-full bg-teal-700" />

      <p className="pl-4">
        Loading
        {dotRange.map((dotNum) => (
          <span key={dotNum} style={{ opacity: dotNum <= visibleDots ? 1 : 0 }}>
            .
          </span>
        ))}
      </p>
    </div>
  );
}
