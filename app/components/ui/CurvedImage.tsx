import Image from "next/image";

interface CurvedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  variant?: "arch" | "rounded" | "pill";
  className?: string;
  priority?: boolean;
}

const variantStyles: Record<string, string> = {
  arch: "rounded-[50%_50%_0_0]",
  rounded: "rounded-[24px]",
  pill: "rounded-[9999px]",
};

export default function CurvedImage({
  src,
  alt,
  width,
  height,
  variant = "arch",
  className = "",
  priority = false,
}: CurvedImageProps) {
  return (
    <div className={`overflow-hidden ${variantStyles[variant]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        preload={priority}
        className="w-full h-auto"
      />
    </div>
  );
}
