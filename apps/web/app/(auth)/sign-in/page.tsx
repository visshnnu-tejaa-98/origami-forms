import type { Metadata } from "next";
import { SignInFlow } from "../_components/sign-in-flow";

export const metadata: Metadata = {
    title: "Origami · Sign in",
    description: "Sign in to your Origami paper desk.",
};

export default function SignInPage() {
    return <SignInFlow />;
}
