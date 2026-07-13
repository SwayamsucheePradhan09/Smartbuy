import { motion, useAnimation } from "framer-motion";

interface Props {
  isVisible: boolean;
  onToggle: () => void;
}

export const BlinkingEye = ({ isVisible, onToggle }: Props) => {
  const controls = useAnimation();

  const handleHover = async () => {
    if (isVisible) {
      // Blink animation: quickly close (scaleY -> 0.2) and reopen (scaleY -> 1)
      await controls.start({ scaleY: 0.2, transition: { duration: 0.08 } });
      await controls.start({ scaleY: 1, transition: { duration: 0.12 } });
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={handleHover}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        transition: "color 0.2s ease",
        outline: "none",
      }}
      onFocus={(e) => (e.currentTarget.style.color = "#6366f1")}
      onBlur={(e) => (e.currentTarget.style.color = "#94a3b8")}
    >
      <motion.svg
        animate={controls}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transformOrigin: "center 12px" }}
        whileHover={{ scale: 1.15, color: "#6366f1" }}
        whileTap={{ scale: 0.9 }}
      >
        {isVisible ? (
          <>
            {/* Eye Open Path */}
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            {/* Pupil */}
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </>
        ) : (
          <>
            {/* Eye Closed Eyelid curve */}
            <path d="M3 10c3 3.5 5 5.5 9 5.5s6-2 9-5.5" />
            {/* Eyelashes */}
            <path d="M12 15.5v3.5" />
            <path d="M7.5 14.5L5.5 17.5" />
            <path d="M16.5 14.5L18.5 17.5" />
            <path d="M4.5 12L2.5 14" />
            <path d="M19.5 12L21.5 14" />
          </>
        )}
      </motion.svg>
    </button>
  );
};

export default BlinkingEye;
