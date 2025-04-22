import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PodiumSkeleton() {
  return (
    <div className="podium-skeleton">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <Skeleton baseColor="#202020" highlightColor="#444" />
        </div>
      ))}
    </div>
  );
}

export default PodiumSkeleton;
