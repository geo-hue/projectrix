import { motion } from "framer-motion";

const TextRevealLoader = () => {
    return (
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
      >
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-600/20 dark:from-blue-700/20 dark:to-blue-400/20"
            />
            {/* Grid Pattern */}
            <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-10">
              {[...Array(64)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: Math.random() }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: Math.random() * 2 }}
                  className="bg-blue-500 dark:bg-blue-400 h-full"
                />
              ))}
            </div>
          </div>
  
          {/* Center Content */}
          <div className="relative">
            {/* Rotating Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 border border-blue-600/20 dark:border-blue-400/20 rounded-full"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  marginLeft: `-${((i + 1) * 100) / 2}px`,
                  marginTop: `-${((i + 1) * 100) / 2}px`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, i % 2 === 0 ? 1.1 : 0.9, 1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
  
            {/* Main Logo Text Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Glowing Effect */}
              <motion.div
                className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-900/30 to-blue-600/30 dark:from-blue-700/30 dark:to-blue-400/30"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Text Container */}
              <h1 className="text-4xl md:text-6xl font-bold font-orbitron flex">
                {/* PROJECT Text Reveal */}
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="inline-block whitespace-nowrap bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent"
                  >
                    PROJECT
                  </motion.span>
                </div>
                
                {/* RIX Text Reveal */}
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                    className="inline-block whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-700 bg-clip-text text-transparent"
                  >
                    RIX
                  </motion.span>
                </div>
              </h1>
            </motion.div>
  
            {/* Tech particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"
                initial={{
                  opacity: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos(i * Math.PI / 10) * 100,
                  y: Math.sin(i * Math.PI / 10) * 100,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };
  
  export default TextRevealLoader;