import React from "react";
import { AccessibilityWidget } from "sena-accessibility";

export default function AppLayout() {
	return (
		<>
			<Header />
			<AccessibilityWidget theme="dark" />
			<Content />
			<Footer />
		</>
	);
}