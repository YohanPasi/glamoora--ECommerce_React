import { cn } from "@/lib/utils";
import PropTypes from "prop-types"; // Import PropTypes for validation

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Prop validation
Skeleton.propTypes = {
  className: PropTypes.string, // className should be a string
};

export { Skeleton };
