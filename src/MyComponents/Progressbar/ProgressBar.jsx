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
                top: 70,
                left: 0,
                right: 0,
                height: 2,
                originX: 0,
                zIndex: 10,
                backgroundColor: "#71308A",
            }}
        />
    )
}

export default ProgressBar
