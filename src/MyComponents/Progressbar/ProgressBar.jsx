"use client"
import React from 'react'
import { motion, useScroll } from "motion/react"

const ProgressBar = () => {
    const { scrollYProgress } = useScroll()
    return (
        <motion.div
            id="scroll-indicator"
            style={{
                scaleX: scrollYProgress,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                originX: 0,
                zIndex: 1000,
                backgroundColor: "#71308A",
            }}
        />
    )
}

export default ProgressBar
