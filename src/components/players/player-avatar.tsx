"use client"

import Avvvatars from "avvvatars-react"

interface PlayerAvatarProps {
  name: string
  size?: number
  border?: boolean
  borderSize?: number
  borderColor?: string
  shadow?: boolean
  className?: string
}

export function PlayerAvatar({
  name,
  size = 32,
  border,
  borderSize,
  borderColor,
  shadow,
  className,
}: PlayerAvatarProps) {
  return (
    <div className={className} style={{ maxWidth: "100%", overflow: "hidden" }}>
      <Avvvatars
        value={name}
        style="shape"
        size={size}
        border={border}
        borderSize={borderSize}
        borderColor={borderColor}
        shadow={shadow}
      />
    </div>
  )
}
