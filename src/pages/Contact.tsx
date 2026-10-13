import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import PageHeading from "../components/PageHeading";
import Container from "../components/common/Container";

interface ContactLink {
	label: string;
	href: string;
	icon: IconDefinition;
	external: boolean;
}

const contactLinks: ContactLink[] = [
	{
		label: "GitHub",
		href: "https://github.com/fernandocallejasr",
		icon: faGithub,
		external: true,
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/fernando-callejas/",
		icon: faLinkedin,
		external: true,
	}
];

const Contact = () => {
	return (
		<Container>
			<PageHeading title="Contact">
				<p className="font-primary text-base text-gray-700 dark:text-gray-300 mt-2 mb-8">
					Have a question or just want to say hi? Reach out through any of
					the channels below.
				</p>
				<ul className="flex flex-col items-center space-y-4">
					{contactLinks.map(({ label, href, icon, external }) => (
						<li key={label}>
							<a
								href={href}
								target={external ? "_blank" : undefined}
								rel={external ? "noopener noreferrer" : undefined}
								aria-label={label}
								className="inline-flex items-center font-primary text-lg font-semibold text-primary transition-colors duration-300 hover:text-dark"
							>
								<FontAwesomeIcon
									icon={icon}
									className="h-5 w-5 mr-3"
									aria-hidden="true"
								/>
								{label}
							</a>
						</li>
					))}
				</ul>
			</PageHeading>
		</Container>
	);
};

export default Contact;
