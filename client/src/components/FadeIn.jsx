import { motion } from "framer-motion";

/* Reusable scroll-triggered reveal — wraps children in a whileInView motion.div */
export default function FadeIn({ children, delay = 0, y = 40, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
