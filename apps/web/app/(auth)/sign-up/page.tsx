import type { Metadata } from "next";
import { SignUpFlow } from "../_components/sign-up-flow";

export const metadata: Metadata = {
    title: "Origami · Create account",
    description: "Start folding — three forms free, no card needed.",
};

export default function SignUpPage() {
    return <SignUpFlow />;
}
