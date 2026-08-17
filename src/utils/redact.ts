export function redactEmail(email: string): string {
	const [localPart, domain] = email.split("@");
	const redactedDomain = domain
		.split(".")
		.map((part, index, arr) => {
			if (index === arr.length - 1) {
				return part;
			}

			return "*".repeat(part.length);
		})
		.join(".");

	const redactedLocalPart = localPart[0] + "*".repeat(localPart.length - 1);

	return `${redactedLocalPart}@${redactedDomain}`;
}
