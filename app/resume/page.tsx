import type { Metadata } from "next";
import ResumeContent from "./ResumeContent";

export const metadata: Metadata = {
    title: "Resume",
    description: "Resume of Brean Julius Carbonilla — full-stack developer skilled in React, Node.js, Express, MongoDB, and more.",
};

export default function ResumePage() {
    return <ResumeContent />;
}
